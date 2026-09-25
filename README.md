⚠️ WARNING: This project is AI-generated, and is a **placeholder** for real editor support.

---

# tree-sitter-ilk

Tree-sitter grammars for [Ilk](../ilk), aimed primarily at syntax highlighting in Zed.

| Grammar    | Path        | Files   | Root          |
| ---------- | ----------- | ------- | ------------- |
| `ilk`      | `ilk/`      | `.ilk`  | `document`    |
| `ilk_meta` | `ilk_meta/` | `.ilkm` | `source_file` |

Both grammars share their term rules through `common/define-grammar.js`. Each has its own `queries/highlights.scm`; the term section of the two files is duplicated and should be kept in sync.

## Operators

Ilk operators are declared in side-loaded meta files, which the grammar cannot see. Instead, any run of two or more terms is parsed as a flat `operator_expression`, and GLR dynamic precedence decides which bare atoms act as prefix or infix `operator` nodes:

| Role                   | Dynamic precedence |
| ---------------------- | ------------------ |
| infix symbol (`+`, `>=`) | +2               |
| infix word (`mod`)     | +1                 |
| prefix (`not`, `-`)    | 0                  |
| symbol as an operand   | -1                 |

So `a mod b`, `not a = b`, `a = not b`, `- a + b` and `a - - b` all come out as you'd expect, without any operator table. The expression is flat: the grammar does not attempt to recover the precedence tree.

## Development

Tools come from the flake (`direnv allow`, or prefix commands with `nix develop -c`):

```sh
(cd ilk && tree-sitter generate)
(cd ilk_meta && tree-sitter generate)
tree-sitter test                               # corpus + highlight tests, from the repo root
tree-sitter parse path/to/file.ilk
tree-sitter parse -p ilk_meta path/to/file.ilkm
```

The generated `*/src/` directories are committed, since Zed builds grammars from them. They are generated with ABI 15; if an editor rejects that, regenerate with `tree-sitter generate --abi 14`.

## Using in Zed

Point an extension's `extension.toml` at this repository with `path = "ilk"` (and/or `path = "ilk_meta"`), and copy the matching `queries/highlights.scm` into the extension's `languages/<name>/` directory.

## Limitations

- Operator inference is heuristic. Ambiguous runs of bare word atoms (e.g. `a b c d`) may be split differently than a real meta file would.
- `$x -1` (no space) lexes `-1` as a number, whereas Ilk reads it as `$x - 1`.
- A symbol atom containing `/*` may lex as the start of a comment.
- Block indentation and region label matching are not checked; region and block markers are flat nodes, since labeled regions may overlap.
