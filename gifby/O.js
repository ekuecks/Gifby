'use strict';

var g = ohm.grammarFromScriptElement();
var O = new Language(g, g.semantics().addOperation('toAST', {

  Program: function(stmts) {
    return new Program(stmts.toAST());
  },

  Stmts: function(ss) {
    return ss.toAST().concat([]);
  },

  Stmt_goto: function(_goto, str) {
    str = str.interval.contents.substring(1, str.interval.contents.length - 1);
    return new Goto(str);
  },

  Stmt_click: function(_fill, str) {
    str = str.interval.contents.substring(1, str.interval.contents.length - 1);
    if(str.indexOf("ID:") > -1) {
      return new ClickByID(str);
    }
    else if(str.indexOf("CLASS:") > -1) {
      return new ClickByClass(str);
    }
    else {
      return new ClickByAttribute(str);
    }
  },

  Stmt_fill: function(_fill, str, text) {
    str = str.interval.contents.substring(1, str.interval.contents.length - 1);
    if(str.indexOf("ID:") > -1) {
      return new FillByID(str, text);
    }
    else if(str.indexOf("CLASS:") > -1) {
      return new FillByClass(str, text);
    }
    else {
      return new FillByAttribute(str, text);
    }
  },

  string: function(_oq, cs, _cq) {
    var chars = [];
    var idx = 0;
    cs = cs.toAST();
    while (idx < cs.length) {
      var c = cs[idx++];
      if (c === '\\' && idx < cs.length) {
        c = cs[idx++];
        switch (c) {
          case 'n': c = '\n'; break;
          case 't': c = '\t'; break;
          default: idx--;
        }
      }
      chars.push(c);
    }
    return chars.join('');
  }
}));

// O.prettyPrintAST is declared in prettyPrint.js

