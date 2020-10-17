let Shell : Type = < Bash | Zsh | Fish >
let shebang = \(shell : Shell) ->
      merge { Bash = "#!/bin/bash"
            , Zsh  = "#!/bin/zsh"
            , Fish = "#!/bin/fish" }
            shell
in shebang Shell.Zsh
