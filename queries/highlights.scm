; keywords
(number) @number
(flag (flag_delimiter) @keyword)
(flag name: (identifier) @keyword)

"func" @keyword.function
"macro" @keyword.function

[
  "if"
  "menu"
  "return"
  "import"
  "var"
  "repeat"
  "repeatEach"
] @keyword

; operators
(operator) @operator

; functions
(function_call name: (identifier) @function.call)

; strings
(string) @string
(multi_line_string) @string

; comments
[
 (comment)
 (block_comment)
] @comment @spell
