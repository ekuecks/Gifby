'use strict';



Program.prototype.trans = function() {
  var res = "";
  for(var s in this.ss) {
    res += this.ss[s].trans() + ";";
  }
  if(this.ss[this.ss.length - 1] instanceof ExpStmt) {
    return res;
  }
  res += "null;";
  return res;
}

ExpStmt.prototype.trans = function() {
  return this.e.trans();
}

Lit.prototype.trans = function() {
  if(typeof(this.primValue) === "string") {
    return "'" + this.primValue + "'";
  }
  else if(this.primValue === null) {
    return 'null';
  }
  return this.primValue.toString();
}

Var.prototype.trans = function() {
  return this.x;
}

BinOp.prototype.trans = function() {
  if(this.op === "*") {
    return "(_LitWrapper(" + this.e1.trans() + ").mul" + "(" + this.e2.trans() + "))";
  }
  if(this.op === "/") {
    return "(_LitWrapper(" + this.e1.trans() + ").div" + "(" + this.e2.trans() + "))";
  }
  if(this.op === "%") {
    return "(_LitWrapper(" + this.e1.trans() + ").mod" + "(" + this.e2.trans() + "))";
  }
  if(this.op === "+") {
    return "(_LitWrapper(" + this.e1.trans() + ").plus" + "(" + this.e2.trans() + "))";
  }
  if(this.op === "-") {
    return "(_LitWrapper(" + this.e1.trans() + ").minus" + "(" + this.e2.trans() + "))";
  }
  if(this.op === "==") {
    return "(_LitWrapper(" + this.e1.trans() + ").eq" + "(" + this.e2.trans() + "))";
  }
  if(this.op === "!=") {
    return "(_LitWrapper(" + this.e1.trans() + ").neq" + "(" + this.e2.trans() + "))";
  }
  if(this.op === ">") {
    return "(_LitWrapper(" + this.e1.trans() + ").gt" + "(" + this.e2.trans() + "))";
  }
  if(this.op === "<") {
    return "(_LitWrapper(" + this.e1.trans() + ").lt" + "(" + this.e2.trans() + "))";
  }
}

This.prototype.trans = function() {
  return "this";
}

InstVar.prototype.trans = function() {
  return "_checkInstVar(this, '" + this.x + "')";
}

New.prototype.trans = function() {
  var params = [];
  for(var i in this.es) {
    params[i] = this.es[i].trans();
  }
  return "new " + this.C + "().init(" + params.join(",") + ")";
}

Send.prototype.trans = function() {
  var params = [];
  for(var i in this.es) {
    params[i] = this.es[i].trans();
  }
  var m = this.m;
  if(m === "*") {
    m = "mul";
  }
  if(m === "/") {
    m = "div";
  }
  if(m === "%") {
    m = "mod";
  }
  if(m === "+") {
    m = "plus";
  }
  if(m === "-") {
    m = "minus";
  }
  if(m === "==") {
    m = "eq";
  }
  if(m === "!=") {
    m = "neq";
  }
  if(m === ">") {
    m = "gt";
  }
  if(m === "<") {
    m = "lt";
  }
  var rec = this.erecv.trans();
  return "_LitWrapper(" + this.erecv.trans() + ")." + m + "(" + params.join(",") + ")";
}

SuperSend.prototype.trans = function() {
  var params = [];
  for(var i in this.es) {
    params[i] = this.es[i].trans();
  }
  var callParams = "this";
  if(params.length > 0) {
    callParams += ", " + params.join(",");
  }
  return "this._super.prototype." + this.m + ".call(" + callParams + ")";
}

ClassDecl.prototype.trans = function() {
  _classes[this.C] = this.S;
  var instance = "";
  for(var i in this.xs) {
    instance += "this._instanceDict['" + this.xs[i] + "'] = null; ";
  }
  return "class " + this.C + " extends " + this.S + "{ constructor() " + "{ " 
    + "super(); " + instance + "} }";
}

MethodDecl.prototype.trans = function() {
  _level += 1;
  var body = [];
  for(var i in this.ss) {
    var next = this.ss[i].trans();
    next = next.replace(/this\._super/g, _classes[this.C]);
    if(this.C === 'Num') {
      next = next.replace(/this/g, "this._instanceDict['x']");
    }
    else if(this.C === 'Str') {
      next = next.replace(/this/g, "this._instanceDict['s']");
    }
    else if(this.C === 'True' || this.C === 'False' || this.C === 'Bool') {
      next = next.replace(/this/g, "this._instanceDict['x'");
    }
    else if(this.C === 'Null') {
      next = next.replace(/this/g, 'null');
    }
    body[i] = next;
  }
  _level -= 1;
  var m = this.m;
  if(m === "*") {
    m = "mul";
  }
  if(m === "/") {
    m = "div";
  }
  if(m === "%") {
    m = "mod";
  }
  if(m === "+") {
    m = "plus";
  }
  if(m === "-") {
    m = "minus";
  }
  if(m === "==") {
    m = "eq";
  }
  if(m === "!=") {
    m = "neq";
  }
  if(m === ">") {
    m = "gt";
  }
  if(m === "<") {
    m = "lt";
  }
  var nest = "\"";
  for(var i = 1; i < Math.pow(2, _level); i++) {
    nest = "\\" + nest;
  }
  return this.C + ".prototype." + m + " = function(" + this.xs.join(",") + ")" + "{ var _errName =  _nextError(); eval('window.' + _errName + ' = new _BlockError(_errName, null)'); try { return eval(" + nest + "(() => { " +  body.join(";") + "; return this; }).call(this)" + nest + ".replace(/_BLOCKERROR/g, _errName)) } catch(e) { if(e instanceof _BlockError) { if(e.n == eval(_errName).n) { return e.e; } } throw e; } }";
}

VarDecl.prototype.trans = function() {
  return "var " + this.x + " = " + this.e.trans();
}

VarAssign.prototype.trans = function() {
  return this.x + " = " + this.e.trans();
}


InstVarAssign.prototype.trans = function() {
  return "_checkInstVarAssign(this, '" + this.x + "'); this._instanceDict['" + this.x + "'] = " + this.e.trans() + ";";
}

Return.prototype.trans = function() {
  return "return " + this.e.trans();
}

_BlockThrow.prototype.trans = function() {
  return "_BLOCKERROR.e = " + this.e.trans() + "; throw _BLOCKERROR";
}

BlockLit.prototype.trans = function() {
  var res = "new Block().init((" + this.xs.join(",") + ") => { ";
  var s = this.ss;
  for(var i in s) {
    if(s[i] instanceof Return) {
      s[i] = new _BlockThrow(s[i].e);
    }
  }
  if(!(s[s.length - 1] instanceof Return || s[s.length - 1] instanceof _BlockThrow) && s[s.length - 1] instanceof ExpStmt) {
    s[s.length - 1] = new Return(s[s.length - 1]);
  }
  var p = new Program(s);
  var t = p.trans();
  res += t + " })";
  return res;
}

function trans(ast) {
  return "_Unwrap(eval(\"" + ast.trans() + "\"));";
}
class _BlockError extends Error { 
  constructor(n, e) { 
    super("Non-local return scope error.");
    this.n = n;
    this.e = e;
  } 
} 
class Obj { 
  constructor() { 
    this._instanceDict = {}; 
  } 
  init() { 
    return this;
  }
}
class Block extends Obj { 
  constructor() { 
    super(); 
    this._instanceDict['b'] = null;
    this._instanceDict['n'] = null;
  } 
  init(b, n) { 
    this._instanceDict['b'] = b;
    this._instanceDict['n'] = n;
    return this;
  }
  call() { 
    return this._instanceDict['b'].apply(this, Array.prototype.slice.call(arguments));
  }
}
function _checkNum(x) { 
  if(x instanceof Num) { 
    return x;
  } 
  throw 'Expected a number but got: ' + x;
} 
function _checkZeroNum(x) { 
  if(x instanceof Num) { 
    if(x._instanceDict['x'] !== 0) { 
      return x;
    } 
    throw 'Divide by 0';
  } 
  throw 'Expected a number but got: ' + x;
} 
function _checkNumber(x) { 
  if(typeof(x) == 'number') { 
    return x;
  } 
  throw 'Expected a number but got: ' + x;
} 
function _checkZero(x) { 
  if(typeof(x) == 'number') { 
    if(x !== 0) { 
      return x;
    } 
    throw 'Divide by 0';
  } 
  throw 'Expected a number but got: ' + x;
} 
function _checkString(x) { 
  if(x instanceof Str) { 
    return x;
  }
  throw 'Expected a string but got: ' + x;
} 
function _checkInstVar(obj, x) { 
  if(undefined === obj._instanceDict[x]) { 
    throw 'Unexpected identifier: ' + x;
  } 
  return obj._instanceDict[x];
} 
function _checkInstVarAssign(obj, x) { 
  if(undefined === obj._instanceDict[x]) { 
    throw 'Unexpected identifier: ' + x;
  }
} 
class Null extends Obj {};
class Num extends Obj { 
  constructor() { 
    super(); 
    this._instanceDict['x'] = null;
  } 
  init(x) { 
    this._instanceDict['x'] = _checkNumber(x); 
    return this;
  } 
  mul(other) { 
    return this._instanceDict['x'] * _checkNum(_LitWrapper(other))._instanceDict['x'];
  } 
  div(other) { 
    return this._instanceDict['x'] / _checkZeroNum(_LitWrapper(other))._instanceDict['x'];
  } 
  minus(other) { 
    return this._instanceDict['x'] - _checkNum(_LitWrapper(other))._instanceDict['x']; 
  } 
  plus(other) { 
    return this._instanceDict['x'] + _checkNum(_LitWrapper(other))._instanceDict['x'];
  } 
  mod(other) { 
    return this._instanceDict['x'] % _checkZeroNum(_LitWrapper(other))._instanceDict['x'];
  } 
  eq(other) { 
    return this._instanceDict['x'] == _checkNum(_LitWrapper(other))._instanceDict['x'];
  } 
  neq(other) { 
    return this._instanceDict['x'] != _checkNum(_LitWrapper(other))._instanceDict['x'];
  } 
  gt(other) { 
    return this._instanceDict['x'] > _checkNum(_LitWrapper(other))._instanceDict['x'];
  } 
  lt(other) { 
    return this._instanceDict['x'] < _checkNum(_LitWrapper(other))._instanceDict['x'];
  } 
}; 
class Bool extends Obj { 
  constructor() { 
    super(); 
    this._instanceDict['x'] = null;
  };
  init(x) {
    this._instanceDict['x'] = x;
  }
}
class True extends Bool {
  constructor() {
    super();
  }
  init() {
    this._instanceDict['x'] = true;
    return this;
  }
}; 
class False extends Bool { 
  constructor() {
    super();
  }
  init() {
    this._instanceDict['x'] = false;
    return this;
  }
};
class Str extends Obj { 
  constructor() { 
    super(); 
    this._instanceDict['s'] = null;
  } 
  init(s) { 
    this._instanceDict['s'] = s; 
    return this;
  } 
  plus(other) { 
    if(other instanceof Str) {
      return this._instanceDict['s'] + other._instanceDict['s'];
    }
    return this._instanceDict['s'] + other;
  } 
}; 
function _Unwrap(obj) { 
  if(obj instanceof Null) { 
    return null;
  }
  else if(obj instanceof Str) { 
    return obj._instanceDict['s']; 
  } 
  else if(obj instanceof Num) { 
    return obj._instanceDict['x']; 
  }
  else if(obj instanceof True) {
    return true;
  }
  else if(obj instanceof False) {
    return false;
  }
  else if(obj instanceof Bool) { 
    if(obj._instanceDict['x']) { 
      return true;
    } 
    return false;
  } 
  else if(typeof(obj) === 'object' || typeof(obj) === 'function') { 
    return obj; 
  }
  return obj; 
};
function _LitWrapper(obj) { 
  if(obj === null) { 
    return new Null().init();
  } 
  else if(typeof(obj) === 'object' || typeof(obj) === 'function') { 
    return obj; 
  } 
  else if(typeof(obj) === 'string') { 
    return new Str().init(obj); 
  } 
  else if(typeof(obj) === 'number') { 
    return new Num().init(obj); 
  } 
  else if(typeof(obj) === 'boolean') { 
    if(obj) { 
      return new True().init();
    } 
    return new False().init();
  } 
};
function _nextError() {
  _blocks++;
  return "_BlockError" + _blocks.toString();
}
