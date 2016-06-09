O {

  Program
    = Stmts

  Stmts
    = Stmt*

  Stmt
    = goto string                                                           -- goto
    | click string                                                          -- click
    | fill string string                                                    -- fill
    | select string string                                                  -- select

  // Lexical rules

  string  (a string literal)
    = "\"" (~"\"" ~"\n" any)* "\""

  space
   += comment

  comment
    = "/*" (~"*/" any)* "*/"  -- multiLine
    | "//" (~"\n" any)*       -- singleLine

  tokens
    = (string | comment | any)*

  goto = "GOTO" ~alnum
  click = "CLICK" ~alnum
  fill = "FILL" ~alnum
  select = "SELECT" ~alnum

}
