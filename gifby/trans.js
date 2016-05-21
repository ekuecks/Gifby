'use strict';

Program.prototype.trans = function() {
  var res = "";
  for(var s in this.ss) {
    res += this.ss[s].trans() + ";";
  }
  return res;
}

Click.prototype.trans = function() {
  return "click(" + this.id +")";
}

Fill.prototype.trans = function() {
  return "$('" + this.id + "').val(\"" + this.text + "\")";
}

function trans(ast) {
  return "function click(el){\nvar ev = document.createEvent(\"MouseEvent\");\nev.initMouseEvent(\n\"click\",\ntrue /* bubble */, true /* cancelable */,\nwindow, null,\n0, 0, 0, 0, /* coordinates */\nfalse, false, false, false, /* modifier keys */\n0 /*left*/, null\n);\nel.dispatchEvent(ev);\n}" + ast.trans();
}
