/**
 * 需测试项：
 * 1. 获取区块
 * 2. 获取 Balance
 * 3. 获取 GasPrice
 * 4. 获取 Nonce
 * 5. 发送交易
 * 6. 获取交易
 * 7. 接收合约事件
 */

const fetch = require('node-fetch')
const fs = require('fs')
const ethers = require("../packages/ethers")

// const endpoint = 'https://civilian.cpchain.io'
const endpoint = 'http://127.0.0.1:8501'

const provider = new ethers.providers.JsonRpcProvider(endpoint);

const signer = provider.getSigner()

let getPrivKey = async (keystore, password) => {
  try {
    let wallet = await ethers.Wallet.fromEncryptedJson(
      keystore,
      password,
    );
    if (wallet) {
      return wallet;
    } else {
      throw 'encrypt error';
    }
  } catch (error) {
    if (error.message.indexOf('invalid password') > -1) {
      console.error('密码错误', error.message)
    } else {
      console.error(error.message);
    }
  }
}

let main = async (keystore_file) => {
  // 获取 BlockNumber
  // let number = await provider.getBlockNumber()
  // console.log('当前区块号', number)

  if (!keystore_file) {
    console.error('Error: keystore_path is null')
    return
  }

  let account = null
  
  try {
    if (fs.existsSync(keystore_file)) {
      account = JSON.parse(fs.readFileSync(keystore_file, 'utf8'))
    }
  } catch(err) {
    console.error(err)
    return
  }

  // 获取 Balance
  // let balance = await provider.getBalance(account.address)
  // balance = ethers.utils.formatEther(balance) // ethers.utils.parseEther("1.0")
  // console.log('Balance:', balance)

  // 获取区块
  // let block = await provider.getBlock(100)
  // console.log('Miner of #100:', block.miner)

  // 获取 GasPrice
  let gasPrice = await provider.getGasPrice()
  gasPrice = ethers.utils.formatEther(gasPrice)
  console.log('Gas price:', gasPrice)

  // 获取 Nonce
  let nonce = await provider.getTransactionCount(account.address)
  console.log('Nonce:', nonce)

  // Send raw transaction
  password = 'a1234567'
  let wallet = await getPrivKey(JSON.stringify(account), password)
  let to = '0x' + account.address
  let gas = 300000
  const tx = {
    type: 0,
    nonce: nonce,
    to: to,
    value: ethers.utils.parseEther('1'),
    gas: gas,
    gasPrice: ethers.utils.parseEther(gasPrice),
    input: "0x",
    chainId: 337,
  }
  let signedTx = await wallet.signCPCTransaction(tx)
  wallet.provider = provider
  // await wallet.sendTransaction(signedTx)
  // await provider.sendTransaction(signedTx)
  console.log(signedTx)
  const r = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-type': 'application/json;charset=UTF-8' },
    body: `{"jsonrpc":"2.0","method":"eth_sendRawTransaction","params":["${signedTx}"],"id":1}`
  })

  const res = await r.json()
  console.log(res)
}

const keystore_file = process.argv[2]
main(keystore_file)
