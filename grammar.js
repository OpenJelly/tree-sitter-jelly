module.exports = grammar({
    name: 'jelly',
    externals: $ => [
        $.string_chars
    ],        
    rules: {
        source_file: $ => repeat($._definition),
    
        _definition: $ => choice(
            $.function_definition,
            $.macro_definition,
            $.menu_definition,
            $.conditional_definition,
            $.repeat_definition,
            $.repeat_each_definition,
            $._statement,
            $.flag,
            $.import,
            $.comment,
            $.block_comment
        ),

        // MARK: Flags
        flag: $ => seq(
            $.flag_delimiter,
            field('name', $.identifier),
            ':',
            field('value', $.identifier),
            optional(',')
        ),

        flag_delimiter: $ => "#",

        // MARK: Import Statements
        import: $ => seq(
            "import",
            /\s+/,
            field('library', $.identifier)
        ),

        // MARK: Repeat
        repeat_definition: $ => seq(
            'repeat',
            choice('(', /\s+/),
            field('amount', $.number),
            choice(')', /\s+/),
            field('body', $.block),
            optional(field('magic_variable', $.magic_variable_definition))
        ),

        repeat_each_definition: $ => seq (
            'repeatEach',
            choice('(', /\s+/),
            field('variable', $.identifier),
            choice(')', /\s+/),
            field('body', $.block),
            optional(field('magic_variable', $.magic_variable_definition))
        ),

        // MARK: Conditional definitions
        conditional_definition: $ => seq(
            'if',
            choice('(', /\s+/),
            field('primary', $._primitive),
            optional(
                seq(
                    /\s+/,
                    field('operator', optional($.operator)),
                    /\s+/,
                    field('secondary', optional($._primitive)),    
                )
            ),
            choice(')', /\s+/),
            field('body', $.block),
            optional(
                choice(
                    field('magic_variable', $.magic_variable_definition),
                    field('else', $.conditional_else)
                )
            ),
        ),

        conditional_else: $ => seq(
            'else',
            field('body', $.block),
            optional(field('magic_variable', $.magic_variable_definition))
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
            choice('(', /\s+/),
            field("prompt", $.string),
            choice('(', /\s+/),
            field("body", $.menu_block),
            optional(field('magic_variable', $.magic_variable_definition))
        ),
    
        menu_block: $ => seq(
            '{',
            repeat($.menu_case),
            '}'
        ),

        // The following two rules are a little odd and need to be updated in the future. 
        // The menu_case_body has the : because it can not match the empty string. 
        // However, this really should be included in menu_case.
        menu_case: $ => seq(
            'case',
            optional('('),
            field('case', $.string),
            optional(')'),
            field('body', $.menu_case_body),
        ),

        menu_case_body: $ => seq(
            ':',
            repeat($._definition)
        ),
        
        // MARK: Function & Macro Declaration Defintion
        function_definition: $ => seq(
            'func',
            field('name', $.identifier),
            field('parameters', $.parameter_list),
            field('body', $.block),
        ),
    
        macro_definition: $ => seq(
            'macro',
            field('name', $.identifier),
            field('parameters', $.parameter_list),
            field('body', $.block),
        ),

        parameter_list: $ => seq(
            '(',
            repeat($.parameter_list_item),
            ')'
        ),
                
        // TODO: Alter this so there is no longer support for optional parameters.
        // Any altering I have tried has ended in infinite loops. Not sure why... Needs more work.
        parameter_list_item: $ => seq(
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
        ),
       
        // MARK: Statements
        _statement: $ => choice(
            $.function_call,
            $.variable_declaration,
            $.set_variable,
            $.return_statement
        ),

        variable_declaration: $ => seq(
            'var',
            /\s+/,
            field('name', $.identifier),
            /\s+/,
            '=',
            /\s+/,
            field('value', $._primitive)
        ),

        set_variable: $ => seq(
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

        identifier: $ => seq(
            field('content', $.identifier_content),
            optional(
                field('property', 
                    repeat(
                        $.variable_property
                    )
                )
            ),
        ),

        identifier_content: $ => /[a-zA-Z0-9_$-]+/,
        
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
                    field("text", $.string_chars), 
                    field("interpolation", $.string_interpolation)
                )
            ),
            '"'
        ),

        multi_line_string: ($) => seq(
            '"""',
            repeat(
                choice(
                    field("text", $.string_chars), 
                    field("interpolation", $.string_interpolation)
                )
            ),
            '"""'
        ),
  
        string_interpolation: $ => seq(
            '${',
            field('identifier', $.identifier),
            '}'
        ),

        variable_property: $ => seq(
            '.',
            field('type', $.variable_property_type),
            '(',
            field('value', $.identifier),
            ')'
        ),

        variable_property_type: $ => choice("as", "get", "key"),

        // Block of code
        block: $ => seq(
            '{',
            repeat($._definition),
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
