module.exports = grammar({
    name: 'jelly',
    rules: {
        source_file: $ => repeat($._definition),
    
        _definition: $ => choice(
            $.function_definition,
            $.macro_definition,
            $.menu_definition,
            $.conditional_definition,
            $.statement,
            $.flag,
            $.import,
            $.comment,
            $.block_comment,
        ),

        // MARK: Flags
        flag: $ => seq(
            $.flag_delimeter,
            field('name', $.identifier),
            ':',
            field('value', $.identifier)
        ),

        flag_delimeter: $ => "#",

        // MARK: Import Statements
        import: $ => seq(
            "import",
            /\s+/,
            field('library', $.identifier)
        ),

        // MARK: Conditional defintions
        conditional_definition: $ => seq(
            'if',
            choice('(', /\s+/),
            field('primary', $._primitive),
            /\s+/,
            field('operator', optional($.operator)),
            /\s+/,
            field('secondary', optional($._primitive)),
            choice(')', /\s+/),
            $.block,
            optional($.coinditional_else) 
        ),

        coinditional_else: $ => seq(
            'else',
            $.block
        ),

        operator: $ => choice(
            '&&',
            '||',
            '==',
            '!=',
            '<',
            '<=',
            '>',
            '>=',
            '::',
            '!:',
            '$$',
            '$!'
        ),

        // MARK: Menu Defintions
        menu_definition: $ => seq(
            'menu',
            $.menu_parameters,
            $.menu_block
        ),

        menu_parameters: $ => seq(
            '(',
            $.string,
            ',',
            $.array,
            ')',
        ),
    
        menu_block: $ => seq(
            '{',
            repeat($.menu_case),
            '}'
        ),

        menu_case: $ => seq(
            'case',
            '(',
            field('case', $.string),
            ')',
            ':',
            field('statements', 
                repeat(
                    $.statement
                )
            )
        ),

        // MARK: Function & Macro Decleration Defintion
        function_definition: $ => seq(
            'func',
            field('name', $.identifier),
            field('parameters', $.parameter_list),
            field('statements', $.block)
        ),
    
        macro_definition: $ => seq(
            'macro',
            field('name', $.identifier),
            field('parameters', $.parameter_list),
            field('statements', $.block)
        ),

        parameter_list: $ => seq(
            '(',
            repeat(
                seq(
                    optional(
                        seq(
                            field('parameter_name', $.identifier),
                            ':',
                            /\s+/
                        )
                    ),
                    field('item', $._primitive),
                    optional(','),
                    optional(/\s+/),
                )
            ),
            ')'
        ),
       
        // MARK: Statements
        statement: $ => choice(
            $.function_call,
            $.variable_decleration,
            $.return_statement
        ),

        variable_decleration: $ => seq(
            'var',
            /\s+/,
            field('name', $.identifier),
            /\s+/,
            '=',
            /\s+/,
            field('value', $._primitive)
        ),

        function_call: $ => seq(
            field('name', $.identifier),
            field('parameters', $.parameter_list),
            optional(field('magic_variable', $.magic_variable_definition))
        ),

        // Magic Variable
        magic_variable_definition: $ => seq(
            '>>',
            /\s+/,
            field('name', $.identifier)
        ),

        // Return Statement
        return_statement: $ => seq(
            'return',
            field('value', $._primitive)        
        ),
   
        // Primitives
        _primitive: $ => choice(
            $.identifier,
            $.array,
            $.string,
            $.multi_line_string,
            $.number
        ),

        identifier: $ => /[a-zA-Z0-9_$]+/,
        
        number: $ => /\d+/,

        // Array
        array: $ => seq(
            '[',
            repeat(
                choice(
                    seq(
                        field('item', $._primitive),
                        ','
                    ),
                field('item', $._primitive)
                )
            ),
            ']'
        ),

        // Strings
        string: $ => seq(
            '"',
            repeat(
                choice(
                    field("text", $._string_text), 
                    $._string_interpolation
                )
            ),
            '"'
        ),

        multi_line_string: ($) => seq(
            '"""',
            repeat(
                choice(
                    field("text", $._mutli_line_string_text), 
                    $._string_interpolation
                )
            ),
            '"""'
        ),
  
        _string_text: $ => /[^\\"]+/,
        _mutli_line_string_text: $ => /[^\\"]+/,

        _string_interpolation: $ => seq(
            '${',
            field('interpolation_identifier', $.identifier),
            '}'
        ),

        // Block of code
        block: $ => seq(
            '{',
            repeat($.statement),
            '}'
        ),

        // MARK: Comments
        comment: $ => seq(
            '//',
            field('content', $.comment_content)
        ),

        block_comment: ($) => seq(
            '/*',
            field('content',
                repeat(
                    $.block_comment_content,
                ),
            ),
            '*/'
        ),

        comment_content: $ => /.*/,
        block_comment_content: $ => /.+/,
    }
});
