'use strict';

Program.prototype.trans = function() {
  var res = "";
  for(var s in this.ss) {
    //res += "setTimeout(function() { " + this.ss[s].trans() + "}, " + 1000*s + ");";
    res += this.ss[s].trans() + ";";
  }
  return res;
}

Goto.prototype.trans = function() {
  return "window.location.href = \"" + this.url + "\"";
}

ClickByID.prototype.trans = function() {
  return "document.getElementById('" + this.id +"').click()";
}

ClickByClass.prototype.trans = function() {
  return "document.getElementsByClassName('" + this.klass +"')[" + this.pos + "].click()";
}

ClickByAttribute.prototype.trans = function() {
  return "document.getElementsByTagName('" + this.attr +"')[" + this.pos + "].click()";
}

FillByID.prototype.trans = function() {
  return "document.getElementById('" + this.id +"').value = '" + this.text + "'";
}

FillByClass.prototype.trans = function() {
  return "document.getElementsByClassName('" + this.klass +"')[" + this.pos + "].value = '" + this.text + "'";
}

FillByAttribute.prototype.trans = function() {
  return "document.getElementsByTagName('" + this.attr +"')[" + this.pos + "].value = '" + this.text + "'";
}

SelectByID.prototype.trans = function() {
  return "document.getElementById('" + this.id +"').value = '" + this.text + "'";
}

SelectByClass.prototype.trans = function() {
  return "document.getElementsByClassName('" + this.klass +"')[" + this.pos + "].value = '" + this.text + "'";
}

SelectByAttribute.prototype.trans = function() {
  return "document.getElementsByTagName('" + this.attr +"')[" + this.pos + "].value = '" + this.text + "'";
}

function trans(ast) {
  return ast.trans();
}

O.transAST = trans;
