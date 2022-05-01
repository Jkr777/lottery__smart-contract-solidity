require('dotenv').config();

const HDWalletProvider = require('@truffle/hdwallet-provider'),
      Web3 = require('web3'),
      { bytecode, abi } = require('./compile');

const provider = new HDWalletProvider(
  process.env.MNEMONIC__PHRASE,
  process.env.INFURA__ENDPOINT
); 

const web3 = new Web3(provider); 

async function deploy() {
  const accounts = await web3.eth.getAccounts(); 

  const res = await new web3.eth.Contract(abi)
    .deploy({ data: bytecode })
    .send({ from: accounts[0], gas: '1000000' }); 

  console.log(JSON.stringify(abi));
  console.log('contract deployed to', res.options.address);
};

deploy();