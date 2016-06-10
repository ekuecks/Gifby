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

class Goto extends Stmt {
  constructor(url) {
    super();
    this.url = url;
  }
}

class ClickByID extends Stmt {
  constructor(id) {
    super();
    this.id = id.substring(3).trim();
  }
}

class ClickByClass extends Stmt {
  constructor(klass) {
    super();
    // klass = "CLASS:klass NUMBER:number
    var index = klass.indexOf("NUMBER:");
    if(index > -1) {
      this.pos = parseInt(klass.substring(index + 7)) - 1;
      this.klass = klass.substring(6, index - 1).trim();
    }
    else {
      this.pos = 0;
      this.klass = klass.substring(6).trim();
    }
  }
}

class ClickByAttribute extends Stmt {
  constructor(attr) {
    super();
    // attr = "ATTRIBUTE:attribute NUMBER:number
    var index = attr.indexOf("NUMBER:");
    if(index > -1) {
      this.pos = parseInt(attr.substring(index + 7)) - 1;
      this.attr = attr.substring(10, index - 1).trim();
    }
    else {
      this.pos = 0;
      this.attr = attr.substring(10).trim();
    }
  }
}

class FillByID extends Stmt {
  constructor(id, text) {
    super();
    // id = "ID:id NUMBER:number
    this.text = text.interval.contents.substring(1, text.interval.contents.length - 1);
    this.id = id.substring(3).trim();
  }
}

class FillByClass extends Stmt {
  constructor(klass, text) {
    super();
    // klass = "CLASS:klass NUMBER:number
    this.text = text.interval.contents.substring(1, text.interval.contents.length - 1);
    var index = klass.indexOf("NUMBER:");
    if(index > -1) {
      this.pos = parseInt(klass.substring(index + 7)) - 1;
      this.klass = klass.substring(6, index - 1).trim();
    }
    else {
      this.pos = 0;
      this.klass = klass.substring(6).trim();
    }
  }
}

class FillByAttribute extends Stmt {
  constructor(attr, text) {
    super();
    // attr = "ATTRIBUTE:attribute NUMBER:number
    this.text = text.interval.contents.substring(1, text.interval.contents.length - 1);
    var index = attr.indexOf("NUMBER:");
    if(index > -1) {
      this.pos = parseInt(attr.substring(index + 7)) - 1;
      this.attr = attr.substring(10, index - 1).trim();
    }
    else {
      this.pos = 0;
      this.attr = attr.substring(10).trim();
    }
  }
}

class SelectByID extends Stmt {
  constructor(id, text) {
    super();
    // id = "ID:id NUMBER:number
    this.text = text.interval.contents.substring(1, text.interval.contents.length - 1);
    this.id = id.substring(3).trim();
  }
}

class SelectByClass extends Stmt {
  constructor(klass, text) {
    super();
    // klass = "CLASS:klass NUMBER:number
    this.text = text.interval.contents.substring(1, text.interval.contents.length - 1);
    var index = klass.indexOf("NUMBER:");
    if(index > -1) {
      this.pos = parseInt(klass.substring(index + 7)) - 1;
      this.klass = klass.substring(6, index - 1).trim();
    }
    else {
      this.pos = 0;
      this.klass = klass.substring(6).trim();
    }
  }
}

class SelectByAttribute extends Stmt {
  constructor(attr, text) {
    super();
    // attr = "ATTRIBUTE:attribute NUMBER:number
    this.text = text.interval.contents.substring(1, text.interval.contents.length - 1);
    var index = attr.indexOf("NUMBER:");
    if(index > -1) {
      this.pos = parseInt(attr.substring(index + 7)) - 1;
      this.attr = attr.substring(10, index - 1).trim();
    }
    else {
      this.pos = 0;
      this.attr = attr.substring(10).trim();
    }
  }
}
