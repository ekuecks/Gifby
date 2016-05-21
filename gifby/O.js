'use strict';

var g = ohm.grammarFromScriptElement();
var O = new Language(g, g.semantics().addOperation('toAST', {

  Program: function(stmts) {
    return new Program(stmts.toAST());
  },

  Stmts: function(ss) {
    var e = optE.toAST()[0];
    return ss.toAST().concat(e ? new ExpStmt(e) : []);
  },

  Stmt_click: function(_fill, id) {
    return new Click(id);
  },

  Stmt_fill: function(_fill, id, text) {
    return new Fill(id, text);
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

