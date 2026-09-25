const { defineGrammar, semicolonSep1 } = require('../common/define-grammar');

module.exports = defineGrammar('ilk_meta', {
  source_file: ($) => optional(seq(semicolonSep1($._expression), optional(';'))),
});
