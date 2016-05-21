'use strict';

Program.prototype.trans = function() {
  var res = "";
  for(var s in this.ss) {
    res += this.ss[s].trans() + ";";
  }
  return res;
}

function trans(ast) {
  return "_Unwrap(eval(\"" + ast.trans() + "\"));";
}
