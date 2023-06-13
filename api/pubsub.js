const PubNuB = require("pubnub");

const credentials = {
  publishKey: "pub-c-95a11798-2209-48c0-b30e-be5ba7ab5df4",
  subscribeKey: "sub-c-238e0d09-cda7-4bd2-bb4c-b74f39d68e06",
  uuid: "sec-c-MDY3ZGI5MzUtMmVkMy00MDVkLTg3M2ItZjRhOTFlNDZmMWQw", // secretKey
};

const CHANNELS_MAP = {
  TEST: "TEST",
  BLOCK: "BLOCK",
};

class PubSub {
  constructor({ blockchain }) {
    this.pubnub = new PubNuB(credentials);
    this.blockchain = blockchain;
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
              .addBlock({ block: parsedMessage })
              .then(() => console.log("New block accepted."))
              .catch((error) => console.error("New block rejected:", error.message));
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
