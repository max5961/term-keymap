- [ ]: handle/decide how to handle ambiguous control sequences
- [x]: handle kitty codes with `{ABCDEFHPQS}`
- [x]: handle kitty codes for supporting terminals w/o req protocol (this goes w/ above task)
- [x]: unhandled CSI sequences should not update Data
- [ ]: configureStdin should be able to undefined argument rather than force empty obj
- [ ]: fix comments on readme about not needing `configureStdin`, since it IS
  necessary unless you manually set raw mode to true
- [ ]: option for throw if raw mode not supported in `configureStdin`






