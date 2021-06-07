
const ethers = require("../packages/ethers")

// create random
let wallet = ethers.Wallet.createRandom({
  path: "m/44'/337'/0'/0/0"
})
console.log('Create a wallet:', wallet.mnemonic)
console.log(wallet.address)

// import wallet
let wallet2 = ethers.Wallet.fromMnemonic("nuclear husband cricket anger wing churn armor twist veteran intact grunt fire", "m/44'/337'/0'/0/0")
console.log('Import a wallet:', wallet2.mnemonic)
console.log(wallet2.address)

