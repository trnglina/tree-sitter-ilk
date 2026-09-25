(comment) @comment

(number) @number

(quoted_atom) @string

(escape_sequence) @string.escape

((atom) @constant
  (#not-match? @constant "^[$?#]|[$?#]$"))

((atom) @variable
  (#match? @variable "^[$?#]|[$?#]$"))

(functor) @function

[
  (symbol)
  (operator)
] @operator

[
  "("
  ")"
] @punctuation.bracket

[
  ","
  ";"
] @punctuation.delimiter
