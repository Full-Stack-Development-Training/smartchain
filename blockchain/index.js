const Block = require("./block");

class Blockchain {
  constructor() {
    this.chain = [Block.genesis()];
  }
  addBlock({ block }) {
    return new Promise((resolve, reject) => {
      Block.validateBlock({
        lastBlock: this.chain[this.chain.length - 1],
        block,
      })
        .then(() => {
          this.chain.push(block);
          return resolve();
        })
        .catch(reject); // (error) => reject(error)
    });
  }
}
module.exports = Blockchain;

// Debugging:

// const blockchain = new Blockchain()
// console.log("🚀 ~ file: index.js:11 ~ blockchain:", JSON.stringify(blockchain));

// const blockchain = new Blockchain();
// for (let i = 0; i < 1000; i++) {
//   const lastBlock = blockchain.chain[blockchain.chain.length - 1];
//   const block = Block.mineBlock({
//     lastBlock,
//     beneficiary: "beneficiary",
//   });
//   blockchain.addBlock({ block });
//   console.log("🚀 ~ file: index.js:25 ~ block:", block);
// }
