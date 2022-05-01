const path = require('path'), 
      fs = require('fs'),
      solc = require('solc');

const contractPath = path.resolve(__dirname, 'contracts', 'Lottery.sol');
const source = fs.readFileSync(contractPath, 'utf8');

var input = {
    language: 'Solidity',
    sources: {
        'Lottery.sol' : {
            content: source
        }
    },
    settings: {
        outputSelection: {
            '*': {
                '*': [ '*' ]
            }
        }
    }
};

var output = JSON.parse(solc.compile(JSON.stringify(input)));

exports.abi = output.contracts['Lottery.sol']['Lottery'].abi;
exports.bytecode = output.contracts['Lottery.sol']['Lottery'].evm.bytecode.object;