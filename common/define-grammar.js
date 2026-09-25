const WORD =
  /[A-Za-z][A-Za-z0-9]*(_[A-Za-z0-9]+)*[$?#]?|[$?#]([A-Za-z0-9]+(_[A-Za-z0-9]+)*[$?#]?)?/;

const SYMBOL = /[&*+\-./:<=>@\\^~]+/;

const NUMBER = /-?[0-9]+(\.[0-9]+)?([eE][+-]?[0-9]+)?/;

const commaSep1 = (rule) => seq(rule, repeat(seq(',', rule)));

const semicolonSep1 = (rule) => seq(rule, repeat(seq(';', rule)));

function defineGrammar(name, rootRules) {
  return grammar({
    name,

    extras: ($) => [/\s/, $.comment],

    conflicts: ($) => [
      [$._primary, $._prefix_operator],
      [$._symbol_operand, $._prefix_operator],
    ],

    rules: {
      ...rootRules,

      _facts: ($) => semicolonSep1($._expression),

      _expression: ($) => choice($._primary, $.operator_expression),

      operator_expression: ($) =>
        choice(
          seq(repeat1($._prefix_operator), $._primary),
          seq(
            repeat($._prefix_operator),
            $._primary,
            repeat1(
              seq($._infix_operator, repeat($._prefix_operator), $._primary),
            ),
          ),
        ),

      _prefix_operator: ($) =>
        choice(alias($.atom, $.operator), alias($.symbol, $.operator)),

      _infix_operator: ($) =>
        choice(
          prec.dynamic(1, alias($.atom, $.operator)),
          prec.dynamic(2, alias($.symbol, $.operator)),
        ),

      _primary: ($) =>
        choice(
          $.atom,
          $.quoted_atom,
          $.number,
          $.compound,
          $.group,
          $._symbol_operand,
        ),

      _symbol_operand: ($) => prec.dynamic(-1, $.symbol),

      compound: ($) =>
        seq(
          field(
            'functor',
            choice(
              alias($.atom, $.functor),
              alias($.symbol, $.functor),
              $.quoted_atom,
            ),
          ),
          token.immediate('('),
          commaSep1(field('argument', $._expression)),
          ')',
        ),

      group: ($) => seq('(', $._expression, ')'),

      atom: (_) => WORD,

      symbol: (_) => SYMBOL,

      number: (_) => NUMBER,

      quoted_atom: ($) =>
        seq(
          "'",
          repeat(
            choice(
              token.immediate(prec(1, /[^'\\\x00-\x1f\x7f]+/)),
              $.escape_sequence,
            ),
          ),
          token.immediate("'"),
        ),

      escape_sequence: (_) =>
        token.immediate(
          choice(
            "''",
            /\\['\\nrt]/,
            /\\u[0-9a-fA-F]{4}/,
            /\\U[0-9a-fA-F]{8}/,
          ),
        ),

      comment: (_) => token(seq('/*', /[^*]*\*+([^/*][^*]*\*+)*/, '/')),
    },
  });
}

module.exports = { defineGrammar, WORD, semicolonSep1 };
