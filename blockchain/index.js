const Block = require("./block");

class Blockchain {
  constructor() {
    this.chain = [Block.genesis()];
  }
}
module.exports = Blockchain;


// Debugging:
// const blockchain = new Blockchain()
// console.log("🚀 ~ file: index.js:11 ~ blockchain:", JSON.stringify(blockchain));
