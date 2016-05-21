'use strict';

Program.prototype.trans = function() {
  var res = "";
  for(var s in this.ss) {
    res += this.ss[s].trans() + ";";
  }
  return res;
}

Click.prototype.trans = function() {
  return "$('#" + this.id +"').trigger('click')";
}

Fill.prototype.trans = function() {
  return "$('#" + this.id + "').val('" + this.text + "')";
}

function trans(ast) {
  return ast.trans();
}
