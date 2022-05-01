const assert = require("assert"),
      ganache = require("ganache-cli"),
      Web3 = require("web3"),
      web3 = new Web3(ganache.provider()),
      { bytecode, abi } = require('../compile');
      let accounts, contract;

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();

  contract = await new web3.eth.Contract(abi)
    .deploy({ data: bytecode })
    .send({ from: accounts[0], gas: '1000000' });
});

describe("Lottery contract", () => {
  it("deploys a contract", () => {
    assert.ok(contract.options.address);
  });

  it("allows one account to enter", async () => {
    await contract.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei('0.001', 'ether') 
    });

    const players = await contract.methods.getPlayers().call({
      from: accounts[0]
    });

    assert.equal(accounts[0], players[0]); 
    assert.equal(1, players.length); 
  });

  it("allows multiple accounts to enter", async () => {
    await contract.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei('0.001', 'ether') 
    });    
    
    await contract.methods.enter().send({
      from: accounts[1],
      value: web3.utils.toWei('0.001', 'ether') 
    });    
    
    await contract.methods.enter().send({
      from: accounts[2],
      value: web3.utils.toWei('0.001', 'ether') 
    });

    const players = await contract.methods.getPlayers().call({
      from: accounts[0]
    });

    assert.equal(accounts[0], players[0]); 
    assert.equal(accounts[1], players[1]); 
    assert.equal(accounts[2], players[2]); 
    assert.equal(3, players.length); 
  });

  it("requires a minimum amount of ether to enter", async () => {
    try {
      await contract.methods.enter().send({
        from: accounts[0],
        value: web3.utils.toWei('0.0001', 'ether') 
      });

      assert(false);
    } catch (error) {
      assert(error);
    }
  });

  it("only manager can call pick winner", async () => {
    try {
      await contract.methods.pickWinner().send({
        from: accounts[1]
      })

      assert(false);
    } catch (error) {
      assert(error);
    }
  });  
  
  it("sends money to the winner", async () => {
    await contract.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei('0.001', 'ether') 
    });

    const initialBalance = await web3.eth.getBalance(accounts[0]); 

    await contract.methods.pickWinner().send({
      from: accounts[0]
    });

    const finalBalance = await web3.eth.getBalance(accounts[0]);
    const difference = finalBalance - initialBalance;

    assert(difference > web3.utils.toWei('0.0008', 'ether'));
  });

});