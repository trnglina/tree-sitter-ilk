const { defineGrammar, WORD } = require('../common/define-grammar');

module.exports = defineGrammar('ilk', {
  document: ($) =>
    repeat(
      choice(
        $.text,
        $.escape,
        $.point,
        $.region_open,
        $.region_close,
        $.block_open,
        $.block_close,
      ),
    ),

  text: (_) => token(prec(1, /[^@]+/)),

  escape: (_) => '@@',

  point: ($) => seq('@{', $._facts, '}'),

  region_open: ($) =>
    seq(
      choice('@<', seq('@', $._label, token.immediate('<'))),
      $._facts,
      '|',
    ),

  region_close: ($) =>
    choice('@>', seq('@', $._label, token.immediate('>'))),

  block_open: ($) => seq('@[', $._facts, '|'),

  block_close: (_) => '@]',

  _label: ($) => field('label', alias(token.immediate(WORD), $.label)),
});
