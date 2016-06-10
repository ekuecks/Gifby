'use strict';

Program.prototype.trans = function() {
  var res = "";
  for(var s in this.ss) {
    res += "setTimeout(function() { " + this.ss[s].trans() + "}, " + 1000*s + ");";
  }
  return res;
}

Goto.prototype.trans = function() {
  return "window.location.href = \"" + this.url + "\"";
}

ClickByID.prototype.trans = function() {
  return "$('#" + this.id +"').trigger('click')";
}

ClickByClass.prototype.trans = function() {
  return "$('." + this.klass +"').slice(" + this.pos + ", " + this.pos + " + 1).trigger('click')";
}

ClickByAttribute.prototype.trans = function() {
  return "$('" + this.attr +"').slice(" + this.pos + ", " + this.pos + " + 1).trigger('click')";
}

FillByID.prototype.trans = function() {
  return "$('#" + this.id +"').val(\"" + this.text + "\")";
}

FillByClass.prototype.trans = function() {
  return "$('." + this.klass +"').slice(" + this.pos + ", " + this.pos + " + 1).val(\"" + this.text + "\")";
}

FillByAttribute.prototype.trans = function() {
  return "$('" + this.attr +"').slice(" + this.pos + ", " + this.pos + " + 1).val(\"" + this.text + "\")";
}

SelectByID.prototype.trans = function() {
  return "$('#" + this.id +"').val(\"" + this.text + "\")";
}

SelectByClass.prototype.trans = function() {
  return "$('." + this.klass +"').slice(" + this.pos + ", " + this.pos + " + 1).val(\"" + this.text + "\")";
}

SelectByAttribute.prototype.trans = function() {
  return "$('" + this.attr +"').slice(" + this.pos + ", " + this.pos + " + 1).val(\"" + this.text + "\")";
}

function trans(ast) {
  return ast.trans();
}

O.transAST = trans;
