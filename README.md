Solidity Metadata Uploader
==========================

Solidity Metadata Uploader uploads [Solidity code
metadata](http://solidity.readthedocs.io/en/develop/metadata.html#contract-metadata) to swarm.

The metadata swarm hash is already added to end of your smart contract's byte
code.

End user applications can then pull down this metadata from swarm and
automatically generate a user interface for your dapp.

No more copy and pasting around ABI JSON! 🎉

Install
=======

`npm install --save-dev solidity-metadata-uploader`

Usage with truffle
==================

Add the following to your truffle migrations:



    var MetaCoin = artifacts.require("./MetaCoin.sol");
    var SolidityMetadataUploader = require("solidity-metadata-uploader");

    module.exports = function(deployer) {
      deployer.deploy(MetaCoin);
      SolidityMetadataUploader.upload(`contracts/MetaCoin.sol`, (address) => {
        console.log(`Uploaded contract metadata to: http://swarm-gateways.net/bzzr:/${address}`);
      });
    };
