# smartchain
Ethereum system, with smart contracts, a blockchain, cryptocurrency, and more.

## Basic concepts

### The Blockchain: data structure that serves as a public ledger.
- Parent Hash:
Cryptographic hash of the parent block
- hash function:
generates a unique output for every unique input

### Mining: act of spending CPU power to find valid blocks
- Proof of work:
requires miners to solve a puzzle to mine blocks
- Proof of work difficulty: time based
- Ethereum-inspired algorithm:
1. Calculate a block target hash.
2. Try and find an 'underTargetHash' lower than the block target hash.
underTargetHash consists of: timestamp, number, beneficiary, difficulty and nonce value.

### The Blockchain Network
- Private Application and API
- Pub/sub - Server-to-server Communication
-- PubNuB