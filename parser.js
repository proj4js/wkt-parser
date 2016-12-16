'use strict';
module.exports = parseString;

const NEUTRAL = 1;
const KEYWORD = 2;
const NUMBER = 3;
const QUOTED = 4;
const AFTERQUOTE = 5;
const ENDED = -1;
const whitespace = /\s/;
const latin = /[A-Za-z]/;
const keyword = /[A-Za-z84]/;
const endThings = /[,\]]/;
const digets = /[\d\.E\-\+]/;
class Parser {
  constructor(text) {
    if (typeof text !== 'string') {
      throw new Error('not a string');
    }
    this.text = text.trim();
    this.level = 0;
    this.place = 0;
    this.root = null;
    this.stack = [];
    this.currentObject = null;
    this.state = NEUTRAL;
  }
  readCharicter() {
    let char = this.text[this.place++];
    if (this.state !== QUOTED) {
      while (whitespace.test(char)) {
        if (this.place >= this.text.length) {
          return;
        }
        char = this.text[this.place++];
      }
    }
    switch (this.state) {
      case NEUTRAL:
        return this.neutral(char);
      case KEYWORD:
        return this.keyword(char)
      case QUOTED:
        return this.quoted(char);
      case AFTERQUOTE:
        return this.afterquote(char);
      case NUMBER:
        return this.number(char);
      case ENDED:
        return;
    }
  }
  afterquote(char) {
    if (char === '"') {
      this.word += '"';
      this.state = QUOTED;
      return;
    }
    if (endThings.test(char)) {
      this.afterItem(char);
      return;
    }
    throw new Error(`havn't handled "${char}" in afterquote yet, index ${this.place}`);
  }
  afterItem(char) {
    if (char === ',') {
      if (this.word !== null) {
        this.currentObject.push(this.word);
      }
      this.word = null;
      this.state = NEUTRAL;
      return;
    }
    if (char === ']') {
      this.level--;
      if (this.word !== null) {
        this.currentObject.push(this.word);
        this.word = null;
      }
      this.state = NEUTRAL;
      this.currentObject = this.stack.pop();
      if (!this.currentObject) {
        this.state = ENDED;
      }

      return;
    }
  }
  number(char) {
    if (digets.test(char)) {
      this.word += char;
      return;
    }
    if (endThings.test(char)) {
      this.word = parseFloat(this.word);
      this.afterItem(char);
      return;
    }
    throw new Error(`havn't handled "${char}" in number yet, index ${this.place}`);
  }
  quoted(char) {
    if (char === '"') {
      this.state = AFTERQUOTE;
      return;
    }
    this.word += char;
    return;
  }
  keyword(char) {
    if (keyword.test(char)) {
      this.word += char;
      return;
    }
    if (char === '[') {
      let newObjects = [];
      newObjects.push(this.word);
      this.level++;
      if (this.root === null) {
        this.root = newObjects;
      } else {
        this.currentObject.push(newObjects);
      }
      this.stack.push(this.currentObject);
      this.currentObject = newObjects;
      this.state = NEUTRAL;
      return;
    }
    if (endThings.test(char)) {
      this.afterItem(char);
      return;
    }
    throw new Error(`havn't handled "${char}" in keyword yet, index ${this.place}`);
  }
  neutral(char){
    if (latin.test(char)) {
      this.word = char;
      this.state = KEYWORD;
      return;
    }
    if (char === '"') {
      this.word = '';
      this.state = QUOTED;
      return;
    }
    if (digets.test(char)) {
      this.word = char;
      this.state = NUMBER;
      return;
    }
    if (endThings.test(char)) {
      this.afterItem(char);
      return;
    }
    throw new Error(`havn't handled "${char}" in neutral yet, index ${this.place}`);
  }
  output() {
    while (this.place < this.text.length) {
      this.readCharicter();
    }
    if (this.state === ENDED) {
      return this.root;
    }
    throw new Error(`unable to parse string '${this.text}'. State is ${this.state}.`);
  }
}

function parseString (txt) {
  var parser = new Parser(txt);
  return parser.output();
}
