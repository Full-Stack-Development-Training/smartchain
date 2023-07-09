const { resolve } = require("path");
const Block = require("./block");
const { rejects } = require("assert");

class Blockchain {
  constructor() {
    this.chain = [Block.genesis()];
  }
  addBlock({ block, transactionQueue }) {
    return new Promise((resolve, reject) => {
      Block.validateBlock({
        lastBlock: this.chain[this.chain.length - 1],
        block,
      })
        .then(() => {
          this.chain.push(block);
          transactionQueue.clearBlockTransactions({
            transactionSeries: block.transactionSeries
          })
          return resolve();
        })
        .catch(reject); // (error) => reject(error)
    });
  }
  replaceChain({ chain }) {
    return new Promise(async (resolve, reject) => {
      
      for (let i = 0; i < chain.length; i++) {
        const block = chain[i];
        const lastBlockIndex = i - 1;
        const lastBlock = lastBlockIndex >= 0 ? chain[i - 1] : null;

        try {
          
          await Block.validateBlock({ lastBlock, block });
        } catch (error) {
          return reject(error);
        }
        console.log(`*-- Validated block number: ${block.blockHeaders.number}`);
      }
      this.chain = chain;
      return resolve();
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
