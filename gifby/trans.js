'use strict';

Program.prototype.trans = function() {
  var res = "";
  for(var s in this.ss) {
    res += this.ss[s].trans() + ";";
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
  if(this.pos == 0) {
    return "$('." + this.klass +"').trigger('click')";
  }
  else {
    return "$('." + this.klass +"').slice(" + this.pos + ", " + this.pos + " + 1).trigger('click')";
  }
}

ClickByAttribute.prototype.trans = function() {
  if(this.pos == 0) {
    return "$('" + this.attr +"').trigger('click')";
  }
  else {
    return "$('" + this.attr +"').slice(" + this.pos + ", " + this.pos + " + 1).trigger('click')";
  }
}

FillByID.prototype.trans = function() {
  return "$('#" + this.id +"').val(\"" + this.text + "\")";
}

FillByClass.prototype.trans = function() {
  if(this.pos == 0) {
    return "$('." + this.klass +"').val(\"" + this.text + "\")";
  }
  else {
    return "$('." + this.klass +"').slice(" + this.pos + ", " + this.pos + " + 1).val(\"" + this.text + "\")";
  }
}

FillByAttribute.prototype.trans = function() {
  if(this.pos == 0) {
    return "$('" + this.attr +"').val(\"" + this.text + "\")";
  }
  else {
    return "$('" + this.attr +"').slice(" + this.pos + ", " + this.pos + " + 1).val(\"" + this.text + "\")";
  }
}

function trans(ast) {
  return ast.trans();
}
