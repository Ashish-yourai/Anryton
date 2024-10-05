// const Web3 = require('web3');
const Web3 = require("web3");
const Common = require("ethereumjs-common").default;
const Tx = require("ethereumjs-tx").Transaction;
require("dotenv").config();
const request = require("request");
//const web3 = new Web3(process.env.RPC_URL);
const web3 = new Web3("https://rpc-mainnet.maticvigil.com");

var crypto = require('crypto');
const InputDataDecoder = require("ethereum-input-data-decoder");
const cron = require("node-cron");
var crypto = require("crypto"),
  algorithm = "aes-256-ctr",
  password = "ANRYNFT";
const bep20AbiJson = [
  {
    constant: true,
    inputs: [],
    name: "name",
    outputs: [{ name: "", type: "string" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      { name: "_spender", type: "address" },
      { name: "_value", type: "uint256" },
    ],
    name: "approve",
    outputs: [{ name: "", type: "bool" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "totalSupply",
    outputs: [{ name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      { name: "_from", type: "address" },
      { name: "_to", type: "address" },
      { name: "_value", type: "uint256" },
    ],
    name: "transferFrom",
    outputs: [{ name: "", type: "bool" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "decimals",
    outputs: [{ name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [],
    name: "unpause",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      { name: "account", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    name: "mint",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [{ name: "_value", type: "uint256" }],
    name: "burn",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "paused",
    outputs: [{ name: "", type: "bool" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      { name: "_spender", type: "address" },
      { name: "_subtractedValue", type: "uint256" },
    ],
    name: "decreaseApproval",
    outputs: [{ name: "success", type: "bool" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [{ name: "_owner", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "balance", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      { name: "listAddress", type: "address" },
      { name: "isBlackListed", type: "bool" },
    ],
    name: "blackListAddress",
    outputs: [{ name: "success", type: "bool" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [],
    name: "pause",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "owner",
    outputs: [{ name: "", type: "address" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "symbol",
    outputs: [{ name: "", type: "string" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      { name: "_to", type: "address" },
      { name: "_value", type: "uint256" },
    ],
    name: "transfer",
    outputs: [{ name: "", type: "bool" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      { name: "_spender", type: "address" },
      { name: "_addedValue", type: "uint256" },
    ],
    name: "increaseApproval",
    outputs: [{ name: "success", type: "bool" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [
      { name: "_owner", type: "address" },
      { name: "_spender", type: "address" },
    ],
    name: "allowance",
    outputs: [{ name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [{ name: "newOwner", type: "address" }],
    name: "transferOwnership",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { name: "_name", type: "string" },
      { name: "_symbol", type: "string" },
      { name: "_decimals", type: "uint256" },
      { name: "_supply", type: "uint256" },
      { name: "tokenOwner", type: "address" },
    ],
    payable: false,
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "from", type: "address" },
      { indexed: true, name: "to", type: "address" },
      { indexed: false, name: "value", type: "uint256" },
    ],
    name: "Mint",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "burner", type: "address" },
      { indexed: false, name: "value", type: "uint256" },
    ],
    name: "Burn",
    type: "event",
  },
  { anonymous: false, inputs: [], name: "Pause", type: "event" },
  { anonymous: false, inputs: [], name: "Unpause", type: "event" },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "previousOwner", type: "address" },
      { indexed: true, name: "newOwner", type: "address" },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "blackListed", type: "address" },
      { indexed: false, name: "value", type: "bool" },
    ],
    name: "Blacklist",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "owner", type: "address" },
      { indexed: true, name: "spender", type: "address" },
      { indexed: false, name: "value", type: "uint256" },
    ],
    name: "Approval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "from", type: "address" },
      { indexed: true, name: "to", type: "address" },
      { indexed: false, name: "value", type: "uint256" },
    ],
    name: "Transfer",
    type: "event",
  },
];
const nftContractAbi = [
  {
    inputs: [
      { internalType: "contract IERC20", name: "_token", type: "address" },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "_nft_id",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "buy_address",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "sell_address",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "nft_amount",
        type: "uint256",
      },
      { indexed: false, internalType: "string", name: "_name", type: "string" },
      {
        indexed: false,
        internalType: "string",
        name: "_nft_description",
        type: "string",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "_timestamp",
        type: "uint256",
      },
    ],
    name: "Buy",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "_nft_id",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "_nft_mint_address",
        type: "address",
      },
      {
        indexed: true,
        internalType: "string",
        name: "_nft_name",
        type: "string",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "_nft_amount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "string",
        name: "_nft_description",
        type: "string",
      },
      {
        indexed: false,
        internalType: "string",
        name: "_nft_image",
        type: "string",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "_timestamp",
        type: "uint256",
      },
    ],
    name: "CreateNFT",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "_order_id",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "_beneficiary",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "_caller",
        type: "address",
      },
    ],
    name: "Unstake",
    type: "event",
  },
  {
    inputs: [],
    name: "BuyNFTcount",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "NFTcount",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "string", name: "_name", type: "string" },
      { internalType: "string", name: "_description", type: "string" },
      { internalType: "uint256", name: "_amount", type: "uint256" },
      { internalType: "uint256", name: "_id", type: "uint256" },
    ],
    name: "buy",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "string", name: "_name", type: "string" },
      { internalType: "string", name: "_description", type: "string" },
      { internalType: "string", name: "_nft_image", type: "string" },
      { internalType: "uint256", name: "_amount", type: "uint256" },
    ],
    name: "createNft",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    name: "nftDetails",
    outputs: [
      { internalType: "uint256", name: "nft_id", type: "uint256" },
      { internalType: "address", name: "buy_address", type: "address" },
      { internalType: "address", name: "sell_address", type: "address" },
      { internalType: "uint256", name: "nft_amount", type: "uint256" },
      { internalType: "uint256", name: "timestamp", type: "uint256" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "token",
    outputs: [{ internalType: "contract IERC20", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "newOwner", type: "address" }],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    name: "users",
    outputs: [
      { internalType: "uint256", name: "nft_id", type: "uint256" },
      { internalType: "address", name: "nft_mint_address", type: "address" },
      { internalType: "uint256", name: "nft_amount", type: "uint256" },
      { internalType: "string", name: "nft_name", type: "string" },
      { internalType: "string", name: "nft_description", type: "string" },
      { internalType: "string", name: "nft_image", type: "string" },
      { internalType: "uint256", name: "buy_count", type: "uint256" },
      { internalType: "uint256", name: "sell_count", type: "uint256" },
      { internalType: "uint256", name: "timestamp", type: "uint256" },
    ],
    stateMutability: "view",
    type: "function",
  },
];
const ipfsAbi = [
  {
    inputs: [],
    name: "getHash",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "string", name: "x", type: "string" }],
    name: "sendHash",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];
const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
var dbSchema = require("../config/config");
// noether: ‘0’
// wei: ‘1’
// kwei: ‘1000’
// Kwei: ‘1000’
// babbage: ‘1000’
// femtoether: ‘1000’
// mwei: ‘1000000’
// Mwei: ‘1000000’
// lovelace: ‘1000000’
// picoether: ‘1000000’
// gwei: ‘1000000000’
// Gwei: ‘1000000000’
// shannon:‘1000000000’
// nanoether: ‘1000000000’
// nano: ‘1000000000’
// szabo: ‘1000000000000’
// microether: ‘1000000000000’
// micro: ‘1000000000000’
// finney: ‘1000000000000000’
// milliether: ‘1000000000000000’
// milli: ‘1000000000000000’
// ether: ‘1 000 000 000 000 000 000’

const encrypt = (text) => {
  var cipher = crypto.createCipher(algorithm, password);
  var crypted = cipher.update(text, "utf8", "hex");
  crypted += cipher.final("hex");
  return crypted;
};
const decrypt = (text) => {
  var decipher = crypto.createDecipher(algorithm, password);
  var dec = decipher.update(text, "hex", "utf8");
  dec += decipher.final("utf8");
  return dec;
};

const SEND_ANRYTON_TOKEN = async (to, amount) => {
  //console.log("calling--send token---", to,amount);
  let walletFrom = process.env.ANRYTON_HOT_WALLET_ADDRESS;
  let privateKey = process.env.ANRYTON_PRIVATE_KEY;
  let contractAddress = process.env.CONTRACT_ADDRESS;
  //console.log("walletFrom--privateKey--contractAddress-",walletFrom,privateKey,contractAddress, Math.floor(amount * 100) / 100);
  let resp = await transfer_eth_token(
    walletFrom,
    privateKey,
    to,
    Math.floor(amount * 100) / 100, // Math.floor(amount),
    contractAddress,
    process.env.TOKEN_DECIMALS
  );
  //console.log("resp.status---", resp)
  if (resp.success == 1) {
    return {
      success: true,
      message: "successfull ",
      hash: resp.receipt.transactionHash,
    };
  } else {
    return { success: false, message: resp.message };
  }
};

const transfer_eth_token = async (
  WalletFrom,
  privateKey,
  reciverAddress,
  amount,
  contractAddress,
  decimals
) => {
  //console.log('recived params in transfer eth token ' ,{WalletFrom :WalletFrom , privateKey : privateKey ,reciverAddress :  reciverAddress ,amount : amount ,contractAddress : contractAddress , decimals : decimals})
  const BSC_MAIN = Common.forCustomChain(
    "mainnet",
    {
      name: "eth",
      networkId: parseInt(process.env.NETWORK_ID),
      chainId: parseInt(process.env.CHAIN_ID),
    },
    "petersburg"
  );
  let final_response;
  var count = await web3.eth.getTransactionCount(WalletFrom);
  //console.log("count--------", count);
  try {
    var contract = new web3.eth.Contract(bep20AbiJson, contractAddress);
    var contractName = await contract.methods.name().call();
    let transferAmount = amount * Math.pow(10, decimals);
   // console.log("contractName--------", contractName);
    //console.log("transferAmount--------", transferAmount);
    //transferAmount = web3.utils.toHex(new BigNumber(transferAmount)).toString()
    let gasTransferAmount = amount * 100000000000000000;
   // console.log('gasTransferAmount ' ,gasTransferAmount)
    try {
      var dataVal = contract.methods
        .transfer(reciverAddress, web3.utils.toHex(transferAmount.toString()))
        .encodeABI();
      var resultgas = await web3.eth.estimateGas({
        from: WalletFrom,
        to: contractAddress,
        data: dataVal,
      });
     // console.log(' resultgas Limit ', resultgas);
      var block = await web3.eth.getBlock("latest");
      var gasLimit = block.gasLimit;
      //console.log('gasLimit  ', gasLimit);
      var gasPrice = await web3.eth.getGasPrice(function (error, result) {
      //  console.log('gasPrice',web3.utils.fromWei(result, 'ether'));
        return result;

        // var gasPriceInGwei = web3.utils.fromWei(result, 'gwei');
        // ////console.log(gasPriceInGwei);
      });
      const rawTransaction = {
        from: WalletFrom,
        nonce: "0x" + count.toString(16),
        to: contractAddress,
        gasLimit: web3.utils.toHex(resultgas),
        gasPrice: web3.utils.toHex(gasPrice),
        data: dataVal,
      };
     // console.log('rrrr  ',rawTransaction);
      var tx = new Tx(rawTransaction, { common: BSC_MAIN });
      // privateKey = privateKey.substring(2)
      let privKey = Buffer.from(privateKey, "hex");
      tx.sign(privKey);
      var serializedTx = tx.serialize();
      var rawTxHex = "0x" + serializedTx.toString("hex");
      try {
        let resp = await web3.eth
          .sendSignedTransaction(rawTxHex)
          .on("receipt", (receipt) => {
            console.log('case 1');
            final_response = {
              success: 1,
              status: "success",
              receipt: receipt,
            };
          })
          .then((receipt) => {
            console.log('case 2');
            final_response = {
              success: 1,
              status: "success",
              receipt: receipt,
            };
            // success
            return final_response;
          })
          .catch((err) => {
            console.log('fail 2',err);
            ////console.log('case 3');
            final_response = {
              success: 0,
              status: "fail",
              message: "insufficient funds for gas * price + value",
            };
            return final_response;
            // fail
          });
        return resp;
      } catch (err) {
        ////console.log('case 4');
        console.log('outter fail',err);
        return { success: 0, status: "fail", message: err };
      }
    } catch (error) {
      console.log('error 5',error);
      return { success: 0, status: "fail", message: error.reason };
    }
  } catch (err) {
    console.log('contract error 6' ,err)
    return { success: 0, status: "fail", message: err };
  }
};

const CALCULATE_GAS_FEE_FOR_NFT = async (
  name,
  description,
  nftImage,
  price,
  anrytonPrice,
  userEthAddress
) => {
 // console.log("CALCULATE_GAS_FEE_FOR_NFT--")
  if (userEthAddress && web3.utils.isAddress(userEthAddress)) {
    //////console.log('update hash called for ' , userEthAddress)
    let WalletFrom = process.env.ANRYTON_HOT_WALLET_ADDRESS;
    let NFT_SMART_CONTRACT_ADDRESS = process.env.NFT_SMART_CONTRACT_ADDRESS;
    ////console.log(userEthAddress ,'NFT_SMART_CONTRACT_ADDRESS ' , NFT_SMART_CONTRACT_ADDRESS)
    // const BSC_MAIN = Common.forCustomChain('mainnet', {
    //     name: 'bnb',
    //     networkId: parseInt(process.env.NETWORK_ID),
    //     chainId: parseInt(process.env.CHAIN_ID)
    // },'petersburg')
    // let final_response;
    // var count = await web3.eth.getTransactionCount(WalletFrom);
    try {
      var contract = new web3.eth.Contract(
        nftContractAbi,
        NFT_SMART_CONTRACT_ADDRESS
      );
      console.log("contract NFT--")
      price = price * Math.pow(10, 18);
      //console.log("-==== contract done");
      var dataVal = contract.methods
        .createNft(
          name,
          description,
          nftImage,
          web3.utils.toHex(price.toString())
        )
        .encodeABI();
      try {
        var resultgas = await web3.eth.estimateGas({
          from: WalletFrom,
          to: process.env.NFT_SMART_CONTRACT_ADDRESS,
          data: dataVal,
        });
      console.log('near about ' ,resultgas )
      } catch (e) {
        console.log("eee ", e);
      }

      var block = await web3.eth.getBlock("latest");
      var gasLimit = block.gasLimit;
      console.log('gasLimit ' , gasLimit)
      var gasPrice = await web3.eth.getGasPrice(function (error, result) {
        console.log("===========> latest", error);
        //   ////console.log('gasPrice',  web3.utils.fromWei(result, 'szabo'));
        return result; //web3.utils.fromWei(, 'szabo');

        // var gasPriceInGwei = web3.utils.fromWei(result, 'gwei');
        // ////console.log(gasPriceInGwei);
      });
      // ////console.log("gasPrice=------- wei", web3.utils.fromWei(gasPrice, 'wei'))
      // ////console.log("gasPrice=------- kwei", web3.utils.fromWei(gasPrice, 'kwei'))
      // ////console.log("gasPrice=------- babbage", web3.utils.fromWei(gasPrice, 'babbage'))
      // ////console.log("gasPrice=------- mwei", web3.utils.fromWei(gasPrice, 'mwei'))
      // ////console.log("gasPrice=------- lovelace", web3.utils.fromWei(gasPrice, 'lovelace'))
      // ////console.log("gasPrice=------- gwei", web3.utils.fromWei(gasPrice, 'gwei'))
      // ////console.log("gasPrice=------- nano", web3.utils.fromWei(gasPrice, 'nano'))
      // ////console.log("gasPrice=------- szabo", web3.utils.fromWei(gasPrice, 'szabo'))
      // ////console.log("gasPrice=------- finney", web3.utils.fromWei(gasPrice, 'finney'))
      // ////console.log("gasPrice=------- ether", web3.utils.fromWei(gasPrice, 'ether'))
      // ////console.log("gasPrice=------- finney", web3.utils.fromWei(gasPrice, 'finney'))

      //console.log("=== ether  ", gasPrice);
      gasPrice = web3.utils.fromWei(gasPrice, "ether");
      console.log("=========>gass price", gasPrice);
      var eth_price = await request_url(
        "https://pro-api.coingecko.com/api/v3/simple/price?x_cg_pro_api_key=CG-3ZDCX2RyYi9gYKa131PW3t18&ids=ethereum,digitex-futures-exchange&vs_currencies=usd"
      );
      // //console.log("---eth_price---", eth_price);
      // var eth_price=body;
      eth_price = JSON.parse(eth_price);

      // let gas_usd_charges = gasPrice * eth_price..lastPrice;
      let gas_usd_charges = gasPrice * eth_price.ethereum.usd;
     
      //////console.log("anrytonPrice=-------", anrytonPrice)
      // //console.log("=== in balance")
      let user_token_balance = await address_token_balance(userEthAddress);

      ////console.log("user_token_balance---", user_token_balance);
      return {
        success: 1,
        status: "success",
        gasPrice: gasPrice,
        eth_price: eth_price.ethereum.usd,
        gas_usd_charges: gas_usd_charges,
        anryton_charges: gas_usd_charges / anrytonPrice,
        user_token_balance: user_token_balance,
      };
      // request("https://pro-api.coingecko.com/api/v3/simple/price?x_cg_pro_api_key=CG-3ZDCX2RyYi9gYKa131PW3t18&ids=ethereum,digitex-futures-exchange&vs_currencies=usd", async function(error, res, body) {
      //     if (!error ) { //&& res.statusCode == 200
      //         //console.log('requst body ' , body)
      //        // return    resolve(body);

      //     } else {
      //         //console.log('url error ', error)
      //        // return reject(error);
      //        return({ success: 0,
      //             status : 'fail',
      //             error: error ,
      //         });
      //     }
      // });
    } catch (err) {
      //console.log("contract error ===6", err);
      return { success: 0, status: "fail", message: err };
    }
  } else {
    return {
      success: 0,
      status: "fail",
      message: "Please buy some tokens to create nft",
    };
  }
};
const CALCULATE_GAS_FEE_FOR_TOKEN_TRANSFER = async () => {};
const CALCULATE_ETH_GAS_FEE_FOR_NFT = async (
  name,
  description,
  nftImage,
  price,
  userEthAddress
) => {
  let WalletFrom = process.env.ANRYTON_HOT_WALLET_ADDRESS;
  let NFT_SMART_CONTRACT_ADDRESS = process.env.NFT_SMART_CONTRACT_ADDRESS;
  // ////console.log('NFT_SMART_CONTRACT_ADDRESS ' , NFT_SMART_CONTRACT_ADDRESS)
  try {
    var contract = new web3.eth.Contract(
      nftContractAbi,
      NFT_SMART_CONTRACT_ADDRESS
    );
    price = price * Math.pow(10, 18);
    var dataVal = contract.methods
      .createNft(
        name,
        description,
        nftImage,
        web3.utils.toHex(price.toString())
      )
      .encodeABI();
    try {
      var resultgas = await web3.eth.estimateGas({
        from: WalletFrom,
        to: process.env.NFT_SMART_CONTRACT_ADDRESS,
        data: dataVal,
      });
      ////console.log('near about  CALCULATE_ETH_GAS_FEE_FOR_NFT' ,resultgas )
    } catch (e) {
      ////console.log('eee ' , e)
    }
    var block = await web3.eth.getBlock("latest");
    var gasLimit = block.gasLimit;
    var gasPrice = await web3.eth.getGasPrice(function (error, result) {
      //   ////console.log('gasPrice  szabo',  web3.utils.fromWei(result, 'szabo'));
      return result; //web3.utils.fromWei(, 'szabo');

      // var gasPriceInGwei = web3.utils.fromWei(result, 'gwei');
      // ////console.log(gasPriceInGwei);
    });
    ////console.log('gasPrice ' , gasPrice)
    // ////console.log('gasLimit ' , gasLimit)
    gasPrice = web3.utils.fromWei(gasPrice, "szabo");
    ////console.log('gasLimit ' , gasPrice)
    let eth_price = await request_url(
      "https://api.vindax.com/api/v1/ticker/24hr?symbol=ETHUSDT"
    );
    eth_price = JSON.parse(eth_price);
    let gas_usd_charges = gasPrice * eth_price.lastPrice;
    let user_token_balance = await address_token_balance(userEthAddress);
    return {
      success: 1,
      status: "success",
      gasPrice: gasPrice,
      eth_price: eth_price.lastPrice,
      gas_usd_charges: gas_usd_charges,
      user_token_balance: user_token_balance,
    };
  } catch (err) {
    ////console.log('contract error 6' ,err)
    return { success: 0, status: "fail", message: err };
  }
};
let address_token_balance = async (address) => {
  // ////console.log("calling  address_tokne_balance---", address , process.env.CONTRACT_ADDRESS);
  var contract = new web3.eth.Contract(
    bep20AbiJson,
    process.env.CONTRACT_ADDRESS
  );
  let balance = await contract.methods.balanceOf(address).call();
  ////console.log("balance--", balance);
  return web3.utils.fromWei(balance, "ether");
};

let CHECK_FOR_ETH_BALANCE = async (transaction) => {
  let user = await dbSchema.User.findById(transaction.userId);
  // ////console.log('its transaction ', transaction)
  // ////console.log('user ', user.etheriumAddress.address)

  if (
    user.etheriumAddress.address &&
    web3.utils.isAddress(user.etheriumAddress.address)
  ) {
    let requiredGasFee = await CALCULATE_ETH_GAS_FEE_FOR_NFT(
      transaction.name,
      transaction.description,
      transaction.fullUrl,
      1,
      user.etheriumAddress.address
    );

    let WalletGasBalance = await EthBalance(user.etheriumAddress.address);
    // ////console.log('requiredGasFee',requiredGasFee , 'WalletGasBalance', WalletGasBalance)

    if (requiredGasFee.success == 1) {
      ////console.log('we are at 306 ' , requiredGasFee)
      if (WalletGasBalance > requiredGasFee.gasPrice) {
        ////console.log('user have enogh balance ' ,WalletGasBalance )
        await dbSchema.NewFiles.updateOne(
          { _id: transaction._id },
          { $set: { eth_credit_status: true } }
        );
      } else {
        ////console.log('user wallet have only '+ WalletGasBalance +'admin have to send '+ requiredGasFee.gasPrice + ' gas fee')
        // if user have not gas fee in his wallet credit gas fee with  eth_transfer()
        //response for gasTransfer  { success: 1,status: 'success',receipt: {blockHash: '0x87200ffff1d85ffc8140317f3c4914e7b255e65b497a9abb11d2ccd8be31445d'}}
        let adminBalance = await EthBalance(
          process.env.ANRYTON_HOT_WALLET_ADDRESS
        );
        if (adminBalance > requiredGasFee.gasPrice) {
          let gasTransfer = await eth_transfer(
            decrypt(process.env.ANRYTON_PRIVATE_KEY),
            requiredGasFee.gasPrice,
            user.etheriumAddress.address
          );
          ////console.log('gasTransfer response' , gasTransfer)
          ////console.log('we have to update ' + transaction._id , gasTransfer.transactionHash)
          if ((gasTransfer.success = 1)) {
            await dbSchema.NewFiles.updateOne(
              { _id: transaction._id },
              {
                $set: {
                  eth_credit_status: true,
                  eth_credit_Hash: gasTransfer.transactionHash,
                },
              }
            );
          }
        } else {
          //console.log('admin don"t have sufficient fund ', adminBalance);
        }
      }
    }
    // if(WalletGasBalance == 0 ){

    // }
  } else {
    ////console.log('user ', ////console.log('invalid user address'))
  }
};

const CHECK_FOR_NFT_DEPLOY = async (transaction) => {
  let user = await dbSchema.User.findById(transaction.userId);

  // CHECK_FOR_NFT_DEPLOY
  let nftData = {
    name: transaction.name,
    description: transaction.description,
    image: transaction.fullUrl,
    price: transaction.price,
    privateKey: user.etheriumAddress.private_key,
    address: user.etheriumAddress.address,
  };
  let createNft = await CreateNft(nftData);
  console.log('createNft ' , createNft)
  if (createNft.success == 1) {
    await dbSchema.NewFiles.updateOne(
      { _id: transaction._id },
      {
        $set: {
          nft_deploy_status: true,
          nft_status: "DEPLOYED",
          nft_hash: createNft.receipt.transactionHash,
        },
      }
    );
  }

  // }
};

const check_pending_nft_transactions = async () => {
  // token_debit_status: false,
  // token_hash: '',
  // eth_credit_status: false,
  // eth_credit_Hash: '',
  // nft_hash: false,
  // nft_status: 'DRAFT',
  ////console.log('we are checking for pending transactions')
  // let pending_nfts= await dbSchema.NewFiles.find({eth_credit_hash : '0x52c0c081109be19e0d85dfad0cca4ad4dacb663d4d9c7297f5a06f50966cf3db'}).sort({"_id":-1}).limit(2);
  let pending_nfts = await dbSchema.NewFiles.find({
    nft_deploy_status: false,
    nft_status: "PENDING",
  })
    .sort({ _id: -1 })
    .limit(2);
  pending_nfts.forEach(function (value) {
    ////console.log('value ' , value._id)
    console.log('value ' , value.eth_credit_status)
    if (value.eth_credit_Hash == "" && value.eth_credit_status == false) {
      CHECK_FOR_ETH_BALANCE(value);
    } else if (value.nft_deploy_status == false) {
      ////console.log('we are inside for create nft')
      CHECK_FOR_NFT_DEPLOY(value);
    }
  });
};

const DEBIT_USER_TOKEN_FOR_NFT = async (user_id, price, nft_id) => {
  // ////console.log('its nft id' , nft_id)
  let user = await dbSchema.User.findById(user_id);
  if (
    user.etheriumAddress.address &&
    web3.utils.isAddress(user.etheriumAddress.address)
  ) {
    let userTokenBalance = await address_token_balance(
      user.etheriumAddress.address
    );
    if (userTokenBalance >= price) {
      let userGasBalance = await web3.eth.getBalance(
        user.etheriumAddress.address
      );
      ////console.log('user coin balance ' + userGasBalance,'user balance is ' + userTokenBalance + ' we have to debit ' + price + 'tokens')
      ////console.log('private key ' , user.etheriumAddress.private_key)

      // let tokenTransaction = await transfer_eth_token (
      //                             user.etheriumAddress.address ,
      //                             user.etheriumAddress.private_key.substring(2)  ,
      //                             process.env.ANRYTON_HOT_WALLET_ADDRESS ,
      //                             price ,
      //                             process.env.CONTRACT_ADDRESS ,
      //                             process.env.TOKEN_DECIMALS);
      // ////console.log('tokenTransaction',tokenTransaction)
      // await dbSchema.NewFiles.updateOne({_id: nft_id},{$set:{token_hash: tokenTransaction.receipt.transactionHash}});
    } else {
      ////console.log('user balance is ' + userTokenBalance + ' need to add tokens ' + price + 'tokens')
    }
  } else {
    ////console.log('inavlid ethereum address ' )
  }
};

const EthBalance = async (address) => {
  try {
    let balance = await web3.eth.getBalance(address);
    return web3.utils.fromWei(balance, "ether");
    // res.status(200).send({ success: 1,status : 'success',balance: balance});
  } catch (err) {
    ////console.log(err)
    return err;
    // res.status(200).send({ success: 0,status : 'fail',message: err});
  }
};

const eth_transfer = async (privateKey, amount, to) => {
  ////console.log('privateKey ' , privateKey)
  amount = web3.utils.toWei(amount.toString(), "milli");
  amount = amount * 1000;
  ////console.log('amount is  ' , amount)
  const signedTx = await web3.eth.accounts.signTransaction(
    {
      to: to,
      value: amount,
      gas: 21000,
      common: {
        customChain: {
          name: "BSC",
          chainId: parseInt(process.env.CHAIN_ID),
          networkId: parseInt(process.env.NETWORK_ID),
        },
      },
    },
    privateKey
  );
  const aa = web3.eth.sendSignedTransaction(
    signedTx.rawTransaction,
    function (error, hash) {
      if (!error) {
        let receipt = {
          blockHash: hash,
        };
        ////console.log({ success: 1,status : 'success' , receipt : receipt} ," The hash of your transaction is: ", hash);
        return { success: 1, status: "success", receipt: receipt };
      } else {
        ////console.log("❗Something went wrong while submitting your transaction:", error)
        return { success: 0, status: "fail", error: error };
      }
    }
  );
  return aa;
};



const anrySend = async (to,amount) => {
//   const contractAddress = process.env.CONTRACT_ADDRESS;
//   const contractABI = bep20AbiJson;
//   const erc20Contract = new web3.eth.Contract(contractABI, contractAddress);
//   const senderAddress = process.env.ANRYTON_HOT_WALLET_ADDRESS; // Replace with the sender's Ethereum address
// //  const toAddress = '0xF10eb0362f62f8Ba9c198930e1D8039D5b1057ee'; // Replace with the recipient's Ethereum address

//   const toAddress = data.address; // Replace with the recipient's Ethereum address
//   let transferAmount = data.amount; // Replace with the amount of tokens to transfer
//   console.log("contractAddress, senderAddress,transferAmount,toAddress",contractAddress, senderAddress,transferAmount,toAddress);
//   const decimals = 18;
//   transferAmount = (transferAmount * Math.pow(10, decimals)).toString();;
//   console.log('transferAmount  ' , transferAmount)
//   const privateKey =decrypt(process.env.ANRYTON_PRIVATE_KEY); // Replace with the private key of the sender
//   console.log('real private key ' , privateKey)
//   try{
//     const data = erc20Contract.methods.transfer(toAddress, transferAmount).encodeABI();
//     const signedTransaction = await web3.eth.accounts.signTransaction(
//       {
//         to: contractAddress,
//         data: data,
//         gas: 200000, // Replace with an appropriate gas limit
//         gasPrice: web3.utils.toWei('10', 'gwei'), // Replace with an appropriate gas price
//       },
//       privateKey
//     );
//     const transaction = await web3.eth.sendSignedTransaction(signedTransaction.rawTransaction);
//     console.log('Transaction Hash:', transaction.transactionHash);
//   }catch(err){
//     console.log('err is ' ,err)
//   } 

console.log("anrySend calling", to,amount)

const contractAddress = "0x6D368590d52e79845FA2809A029212Cc5F3F27B0";
const privateKey =decrypt(process.env.ANRYTON_PRIVATE_KEY);
const from = process.env.ANRYTON_HOT_WALLET_ADDRESS;
const abi = [{ "inputs": [{ "internalType": "address", "name": "initialOwner", "type": "address" }], "stateMutability": "nonpayable", "type": "constructor" }, { "inputs": [], "name": "ECDSAInvalidSignature", "type": "error" }, { "inputs": [{ "internalType": "uint256", "name": "length", "type": "uint256" }], "name": "ECDSAInvalidSignatureLength", "type": "error" }, { "inputs": [{ "internalType": "bytes32", "name": "s", "type": "bytes32" }], "name": "ECDSAInvalidSignatureS", "type": "error" }, { "inputs": [{ "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "allowance", "type": "uint256" }, { "internalType": "uint256", "name": "needed", "type": "uint256" }], "name": "ERC20InsufficientAllowance", "type": "error" }, { "inputs": [{ "internalType": "address", "name": "sender", "type": "address" }, { "internalType": "uint256", "name": "balance", "type": "uint256" }, { "internalType": "uint256", "name": "needed", "type": "uint256" }], "name": "ERC20InsufficientBalance", "type": "error" }, { "inputs": [{ "internalType": "address", "name": "approver", "type": "address" }], "name": "ERC20InvalidApprover", "type": "error" }, { "inputs": [{ "internalType": "address", "name": "receiver", "type": "address" }], "name": "ERC20InvalidReceiver", "type": "error" }, { "inputs": [{ "internalType": "address", "name": "sender", "type": "address" }], "name": "ERC20InvalidSender", "type": "error" }, { "inputs": [{ "internalType": "address", "name": "spender", "type": "address" }], "name": "ERC20InvalidSpender", "type": "error" }, { "inputs": [{ "internalType": "uint256", "name": "deadline", "type": "uint256" }], "name": "ERC2612ExpiredSignature", "type": "error" }, { "inputs": [{ "internalType": "address", "name": "signer", "type": "address" }, { "internalType": "address", "name": "owner", "type": "address" }], "name": "ERC2612InvalidSigner", "type": "error" }, { "inputs": [], "name": "EnforcedPause", "type": "error" }, { "inputs": [], "name": "ExpectedPause", "type": "error" }, { "inputs": [{ "internalType": "address", "name": "account", "type": "address" }, { "internalType": "uint256", "name": "currentNonce", "type": "uint256" }], "name": "InvalidAccountNonce", "type": "error" }, { "inputs": [], "name": "InvalidShortString", "type": "error" }, { "inputs": [{ "internalType": "address", "name": "owner", "type": "address" }], "name": "OwnableInvalidOwner", "type": "error" }, { "inputs": [{ "internalType": "address", "name": "account", "type": "address" }], "name": "OwnableUnauthorizedAccount", "type": "error" }, { "inputs": [{ "internalType": "string", "name": "str", "type": "string" }], "name": "StringTooLong", "type": "error" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "owner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "spender", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" }], "name": "Approval", "type": "event" }, { "anonymous": false, "inputs": [], "name": "EIP712DomainChanged", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "previousOwner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "newOwner", "type": "address" }], "name": "OwnershipTransferred", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "address", "name": "account", "type": "address" }], "name": "Paused", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "from", "type": "address" }, { "indexed": true, "internalType": "address", "name": "to", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" }], "name": "Transfer", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "address", "name": "account", "type": "address" }], "name": "Unpaused", "type": "event" }, { "inputs": [], "name": "DOMAIN_SEPARATOR", "outputs": [{ "internalType": "bytes32", "name": "", "type": "bytes32" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "owner", "type": "address" }, { "internalType": "address", "name": "spender", "type": "address" }], "name": "allowance", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "value", "type": "uint256" }], "name": "approve", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "account", "type": "address" }], "name": "balanceOf", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "decimals", "outputs": [{ "internalType": "uint8", "name": "", "type": "uint8" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "eip712Domain", "outputs": [{ "internalType": "bytes1", "name": "fields", "type": "bytes1" }, { "internalType": "string", "name": "name", "type": "string" }, { "internalType": "string", "name": "version", "type": "string" }, { "internalType": "uint256", "name": "chainId", "type": "uint256" }, { "internalType": "address", "name": "verifyingContract", "type": "address" }, { "internalType": "bytes32", "name": "salt", "type": "bytes32" }, { "internalType": "uint256[]", "name": "extensions", "type": "uint256[]" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "name", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "owner", "type": "address" }], "name": "nonces", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "owner", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "pause", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "paused", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "owner", "type": "address" }, { "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "value", "type": "uint256" }, { "internalType": "uint256", "name": "deadline", "type": "uint256" }, { "internalType": "uint8", "name": "v", "type": "uint8" }, { "internalType": "bytes32", "name": "r", "type": "bytes32" }, { "internalType": "bytes32", "name": "s", "type": "bytes32" }], "name": "permit", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "renounceOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "symbol", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "totalSupply", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "value", "type": "uint256" }], "name": "transfer", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "from", "type": "address" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "value", "type": "uint256" }], "name": "transferFrom", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "newOwner", "type": "address" }], "name": "transferOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "unpause", "outputs": [], "stateMutability": "nonpayable", "type": "function" }]

const contract = new web3.eth.Contract(abi, contractAddress);
amount = String(amount);
console.log("amount", amount);
const amountToSend = web3.utils.toWei(amount, 'ether');
console.log("amountToSend", amountToSend);
// Estimate gas
contract.methods.transfer(to, amountToSend).estimateGas({ from: from }).then((gasAmount) => {
    
    const gasLimit = String(gasAmount)// + BigInt(10000);
    console.log(gasAmount , ' gasLimit ' , gasLimit)
    // Fetch gas price
    web3.eth.getGasPrice().then((gasPrice) => {
        const data = contract.methods.transfer(to, amountToSend).encodeABI();

        web3.eth.accounts.signTransaction({
            from: from,
            to: contractAddress,
            data: data,
            gas: gasLimit,
            gasPrice: gasPrice,
        }, privateKey).then((signedTx) => {
            web3.eth.sendSignedTransaction(signedTx.rawTransaction)
                .on('receipt', (receipt) => {
                    console.log('Transaction receipt:', receipt);
                })
                .on('error', (error) => {
                    console.error('Transaction error:', error);
                });
        }).catch((error) => {
            console.error('Signing error:', error);
        });
    }).catch((error) => {
        console.error('Fetching gas price error:', error);
    });
}).catch((error) => {
    console.error('Estimating gas error:', error);
});


};


let CreateNftTest = async (data) => {
  console.log('CreateNftTest calling ' , data)
  let name = data.name;
  let description = data.description;
  let nftImage = data.image;
  let price = data.price;
  let privateKey = data.privateKey; //replace with user private key
  let WalletFrom = data.address; //replace with user Address
  let contractAddress = process.env.NFT_SMART_CONTRACT_ADDRESS;
  const BSC_MAIN = Common.forCustomChain(
    "mainnet",
    {
      name: "bnb",
      networkId: parseInt(process.env.NETWORK_ID),
      chainId: process.env.CHAIN_ID,
    },
    "petersburg"
  );
  var count = await web3.eth.getTransactionCount(WalletFrom);
  console.log("count", count);
  try {
    var contract = new web3.eth.Contract(nftContractAbi, contractAddress);
    //   let name =contract.methods.NFTcount();
   // console.log('contract name '  , contract)
    var dataVal = await contract.methods
      .createNft(name, description, nftImage, price)
      .encodeABI();
    try {
      var resultgas = await web3.eth.estimateGas({
        from: WalletFrom,
        to: contractAddress,
        data: dataVal,
      });
      console.log('near about ' ,resultgas )
    } catch (e) {
      console.log('eee ' , e)
    }

    // console.log(dataVal)
    console.log(' gas Limit ', resultgas);
    var block = await web3.eth.getBlock("latest");
    var gasLimit = block.gasLimit;
    console.log('gasLimit  ', gasLimit);
    var gasPrice = await web3.eth.getGasPrice(function (error, result) {
      console.log('gasPrice', result);
      return result;

      // var gasPriceInGwei = web3.utils.fromWei(result, 'gwei');
      // ////console.log(gasPriceInGwei);
    });

    const rawTransaction = {
      from: WalletFrom,
      nonce: "0x" + count.toString(16),
      to: contractAddress,
      gasLimit: web3.utils.toHex(resultgas),
      gasPrice: web3.utils.toHex(gasPrice),
      data: dataVal,
    };
    console.log('rrrr  ',rawTransaction);
    ////console.log('privateKey ' , privateKey)
    //privateKey = privateKey.substring(2);
    var tx = new Tx(rawTransaction, { common: BSC_MAIN });
    let privKey = Buffer.from(privateKey, "hex");
    console.log('privateKey ' , privKey)
    tx.sign(privKey);
    var serializedTx = tx.serialize();
    var rawTxHex = "0x" + serializedTx.toString("hex");
    try {
      let transactionResponse = await web3.eth
        .sendSignedTransaction(rawTxHex)
        .on("receipt", (receipt) => {
          ////console.log('recipt is ' ,receipt);
          // res.status(200).send({ success: 1,status : 'success',receipt: receipt});
          return { success: 1, status: "success", receipt: receipt };
        })
        .then((resp) => {
          ////console.log('inside success' , resp);
          return { success: 1, status: "success", receipt: resp };
          // res.status(200).send({ success: 1,status : 'success',receipt: resp});
          // success
        })
        .catch((err) => {
          console.log('fail 2 here ',err);
          return {
            success: 0,
            status: "fail",
            message: "insufficient funds for gas * price + value",
          };
          // res.status(200).send({ success: 0,status : 'fail',message: 'insufficient funds for gas * price + value'});
          // fail
        });
      return transactionResponse;
    } catch (err) {
      console.log('outter fail',err);
      // res.status(200).send({ success: 0,status : 'fail',message: 'insufficient funds for gas * price + value'});
      return { success: 0, status: "fail", message: err };
    }
  } catch (err) {
    console.log('contract error ' ,err)
    return { success: 0, status: "fail", message: err };
    // res.status(200).send({ success: 0,status : 'fail',message: 'insufficient funds for gas * price + value'});
  }
};

cron.schedule("* * * * *", () => {
  check_pending_nft_transactions();
  ////console.log('function called ',new Date())
});

let CreateNft = async (data) => {
  ////console.log('data ' , data)
  let name = data.name;
  let description = data.description;
  let nftImage = data.image;
  let price = data.price;
  let privateKey = data.privateKey; //replace with user private key
  let WalletFrom = data.address; //replace with user Address
  let contractAddress = process.env.NFT_SMART_CONTRACT_ADDRESS;
  const BSC_MAIN = Common.forCustomChain(
    "mainnet",
    {
      name: "bnb",
      networkId: parseInt(process.env.NETWORK_ID),
      chainId: parseInt(process.env.CHAIN_ID),
    },
    "petersburg"
  );
  var count = await web3.eth.getTransactionCount(WalletFrom);
  try {
    var contract = new web3.eth.Contract(nftContractAbi, contractAddress);
    //   let name =contract.methods.NFTcount();
    //   ////console.log('contract name '  , contract)
    var dataVal = await contract.methods
      .createNft(name, description, nftImage, price)
      .encodeABI();
    try {
      var resultgas = await web3.eth.estimateGas({
        from: WalletFrom,
        to: contractAddress,
        data: dataVal,
      });
      ////console.log('near about ' ,resultgas )
    } catch (e) {
      ////console.log('eee ' , e)
    }

    // ////console.log(dataVal)
    ////console.log(' gas Limit ', resultgas);
    var block = await web3.eth.getBlock("latest");
    var gasLimit = block.gasLimit;
    ////console.log('gasLimit  ', gasLimit);
    var gasPrice = await web3.eth.getGasPrice(function (error, result) {
      ////console.log('gasPrice', result);
      return result;

      // var gasPriceInGwei = web3.utils.fromWei(result, 'gwei');
      // ////console.log(gasPriceInGwei);
    });

    const rawTransaction = {
      from: WalletFrom,
      nonce: "0x" + count.toString(16),
      to: contractAddress,
      gasLimit: web3.utils.toHex(resultgas),
      gasPrice: web3.utils.toHex(gasPrice),
      data: dataVal,
    };
    ////console.log('rrrr  ',rawTransaction);
    ////console.log('privateKey ' , privateKey)
    privateKey = privateKey.substring(2);
    var tx = new Tx(rawTransaction, { common: BSC_MAIN });
    let privKey = Buffer.from(privateKey, "hex");
    ////console.log('privateKey ' , privKey)
    tx.sign(privKey);
    var serializedTx = tx.serialize();
    var rawTxHex = "0x" + serializedTx.toString("hex");
    try {
      let transactionResponse = await web3.eth
        .sendSignedTransaction(rawTxHex)
        .on("receipt", (receipt) => {
          ////console.log('recipt is ' ,receipt);
          // res.status(200).send({ success: 1,status : 'success',receipt: receipt});
          return { success: 1, status: "success", receipt: receipt };
        })
        .then((resp) => {
          ////console.log('inside success' , resp);
          return { success: 1, status: "success", receipt: resp };
          // res.status(200).send({ success: 1,status : 'success',receipt: resp});
          // success
        })
        .catch((err) => {
          ////console.log('fail 2 here ',err);
          return {
            success: 0,
            status: "fail",
            message: "insufficient funds for gas * price + value",
          };
          // res.status(200).send({ success: 0,status : 'fail',message: 'insufficient funds for gas * price + value'});
          // fail
        });
      return transactionResponse;
    } catch (err) {
      ////console.log('outter fail',err);
      // res.status(200).send({ success: 0,status : 'fail',message: 'insufficient funds for gas * price + value'});
      return { success: 0, status: "fail", message: err };
    }
  } catch (err) {
    ////console.log('contract error ' ,err)
    return { success: 0, status: "fail", message: err };
    // res.status(200).send({ success: 0,status : 'fail',message: 'insufficient funds for gas * price + value'});
  }
};


const request_url = async (url) => {
  // ////console.log('url ', url)
  return new Promise(function (resolve, reject) {
    request(url, function (error, res, body) {
      if (!error) {
        //&& res.statusCode == 200
        //console.log("requst body ", body);
        return resolve(body);
      } else {
        //console.log("url error ", error);
        return reject(error);
      }
    });
  });
};

let NFT_DETAILS = async (transactionHash) => {
  let transaction = await web3.eth.getTransaction(transactionHash);
  let transactionReceipt = await web3.eth.getTransactionReceipt(
    transactionHash
  );
  // ////console.log('transactionReceipt' , transactionReceipt)
  const decoder = new InputDataDecoder(nftContractAbi);
  const decodeRes = decoder.decodeData(transaction.input);
  let functionsMethods = [];
  for (k = 0; k < decodeRes.types.length; k++) {
    let paramName = decodeRes.names[k];
    let paramValue =
      decodeRes.names[k] == "_amount"
        ? JSON.parse(decodeRes.inputs[k])
        : decodeRes.inputs[k];
    functionsMethods.push({ name: paramName, value: paramValue });
  }
  // return { success: 1,functionsMethods : functionsMethods, decodeRes : decodeRes,transaction : transaction,transactionReceipt:transactionReceipt}
  return {
    success: 1,
    functionsMethods: functionsMethods,
    decodeRes: decodeRes,
  };
};

let signTransaction = async (
  userAddress,
  privateKey,
  fnSignature,
  estimateGas
) => {
  try {
    const signatureData = fnSignature;
    const txParams = Object.create({});
    txParams.from = userAddress;
    txParams.to = process.env.IPFS_SMART_CONTRACT;
    txParams.gas = await web3.utils.toHex(estimateGas);
    // txParams.gas = await this.web3.eth.getGasPrice();
    txParams.value = 0;
    txParams.data = signatureData; //////console.log(txParams, 'txParamstxParams');
    const signedTx = await web3.eth.accounts.signTransaction(
      txParams,
      privateKey //`0x${privateKey}`
    );
    return signedTx;
  } catch (error) {
    ////console.log(error, 'error Signtransaction');
    return {
      error: true,
      message: "Something went Wrong in SIGNTRANSCATION",
    };
  }
};

let sendSignedTransaction = async (signTransaction) => {
  try {
    const responseBlock = await web3.eth.sendSignedTransaction(
      signTransaction.rawTransaction,
      (error, txHash) => {
        ////console.log(error, 'error');
        if (error) {
          return {
            error: true,
            message: "Something went Wrong in sendSignedTransaction",
          };
        }
        ////console.log('txHash', txHash);
        return txHash;
      }
    );
    return responseBlock;
  } catch (error) {
    ////console.log(error, 'error Signtransaction');
    return {
      error: true,
      message: "Something went Wrong in SIGNTRANSCATION",
    };
  }
};

let WRITE_STRING = async (string) => {
  try {
    console.log("WRITE_STRING calling");
   const bytes = stringTo32Bytes(string);
        console.log('we are isnide '  ,string)
        const contractAddress = "0x2eD2c04da811199250c89EC56900301a204B483D";
        const from = "0x4F8fF1904B2252082d2cA6e74e70EAe73fa193b3";
        const privateKey = "39875ef769852acfbe5e085d800e63edeb4f6e2de15f1f12c0e57c9aaaa85d39";
        const abi = [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[],"name":"HashAlreadySaved","type":"error"},{"inputs":[],"name":"HashNotSaved","type":"error"},{"inputs":[],"name":"IncorrectHashId","type":"error"},{"inputs":[],"name":"NotOwner","type":"error"},{"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"OwnableInvalidOwner","type":"error"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"OwnableUnauthorizedAccount","type":"error"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"hashId","type":"uint256"},{"indexed":false,"internalType":"bytes32","name":"hash","type":"bytes32"}],"name":"HashSaved","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"inputs":[{"internalType":"string","name":"data1","type":"string"},{"internalType":"uint256","name":"data2","type":"uint256"}],"name":"getHashKeyByData","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"hashId","type":"uint256"}],"name":"getHashKeyById","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"hashIds","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"hash","type":"bytes32"}],"name":"isHashSaved","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"data1","type":"string"},{"internalType":"uint256","name":"data2","type":"uint256"}],"name":"isHashSavedByData","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"hash","type":"bytes32"}],"name":"saveHashKey","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"data1","type":"string"},{"internalType":"uint256","name":"data2","type":"uint256"}],"name":"saveHashKeyByData","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"}];

        const contract = new web3.eth.Contract(abi, contractAddress);
        const gasAmount = await contract.methods.saveHashKey(bytes).estimateGas({ from: from });
        const gasLimit = String(gasAmount) //+ String(10000);
        const gasPrice = await web3.eth.getGasPrice();
        // const adjustedGasPrice = gasPrice * String(2);
        const data = contract.methods.saveHashKey(bytes).encodeABI();
        try{
            const signedTx = await web3.eth.accounts.signTransaction({
                from: from,
                to: contractAddress,
                data: data,
                gas: gasLimit,
                gasPrice: gasPrice,
            }, privateKey);
    
            const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
            console.log('Transaction receiptWRITE_STRINGWRITE_STRINGWRITE_STRING:', receipt);
        }catch(e){
            console.log('Transaction error3:', e);
        }
       
    } catch (error) {
        console.error('Transaction error:', error);
    }
};

function stringTo32Bytes(str) {
  const hash = crypto.createHash('sha256');    
  hash.update(str);
  return Buffer.from(hash.digest(), 'hex');
}


module.exports = {
  SEND_ANRYTON_TOKEN: SEND_ANRYTON_TOKEN,
  CALCULATE_GAS_FEE_FOR_NFT: CALCULATE_GAS_FEE_FOR_NFT,
  NFT_DETAILS: NFT_DETAILS,
  WRITE_STRING: WRITE_STRING,
  CreateNftTest:CreateNftTest,
  anrySend:anrySend
};
