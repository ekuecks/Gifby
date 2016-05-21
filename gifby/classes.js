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
    this.id = id.interval.contents.substring(1, id.interval.contents.length - 1);
  }
}

class Fill extends Stmt {
  constructor(id, text) {
    super();
    this.id = id.interval.contents.substring(1, id.interval.contents.length - 1);
    this.text = text.interval.contents.substring(1, text.interval.contents.length - 1);
  }
}
