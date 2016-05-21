'use strict';

// ---------------------------------------------------------
// "Classes" that represent AST nodes
// ---------------------------------------------------------

class Program extends AST {
  constructor(ss) {
    super();
    this.ss = ss;
  }
}

// Statements

class Stmt extends AST {
  constructor() {
    super();
  }
}

class Click extends Stmt {
  constructor(id) {
    super();
    this.id = id;
  }
}

class Fill extends Stmt {
  constructor(text) {
    super();
    this.text = text;
  }
}
