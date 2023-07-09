const PubNuB = require("pubnub");
const Transaction = require("../transaction");
require('dotenv').config()

const credentials = {
  publishKey: process.env.PUBLISH_KEY,
  subscribeKey: process.env.SUBSCRIBE_KEY,
  uuid: process.env.SECRET_KEY, // secretKey
};

const CHANNELS_MAP = {
  TEST: "TEST",
  BLOCK: "BLOCK",
  TRANSACTION: "TRANSACTION",
};

class PubSub {
  constructor({ blockchain, transactionQueue }) {
    this.pubnub = new PubNuB(credentials);
    this.blockchain = blockchain;
    this.transactionQueue = transactionQueue;
    this.subscribeToChannels();
    this.listen();
  }

  subscribeToChannels() {
    this.pubnub.subscribe({
      channels: Object.values(CHANNELS_MAP),
    });
  }

  publish({ channel, message }) {
    this.pubnub.publish({ channel, message });
  }

  listen() {
    this.pubnub.addListener({
      message: (messageObject) => {
        const { channel, message } = messageObject;
        const parsedMessage = JSON.parse(message);
        console.log("Message received. Channel:", channel);
        switch (channel) {
          case CHANNELS_MAP.BLOCK:
            console.log("block message", message);
            this.blockchain
              .addBlock({
                block: parsedMessage,
                transactionQueue: this.transactionQueue,
              })
              .then(() => console.log("New block accepted.", parsedMessage))
              .catch((error) =>
                console.error("New block rejected:", error.message)
              );
            break;
          case CHANNELS_MAP.TRANSACTION:
            console.log(`Received transaction: ${parsedMessage.id}`);
            this.transactionQueue.add(new Transaction(parsedMessage));
            break;
          default:
            return;
        }
      },
    });
  }
  broadcastBlock(block) {
    this.publish({
      channel: CHANNELS_MAP.BLOCK,
      message: JSON.stringify(block),
    });
  }
  broadcastTransaction(transaction) {
    this.publish({
      channel: CHANNELS_MAP.TRANSACTION,
      message: JSON.stringify(transaction),
    });
  }
}

module.exports = PubSub;

// Debugging:

// const pubsub = new PubSub();
// setTimeout(() => {
//   pubsub.publish({
//     channel: CHANNELS_MAP.TEST,
//     message: "foo",
//   });
// }, 3000);
