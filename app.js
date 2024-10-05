require("events").EventEmitter.prototype._maxListeners = 0;
var dbSchema = require("./config/config");
require("dotenv").config();
var bodyParser = require("body-parser");
var express = require("express");
var request = require("request");
var util = require("util");
var mongoose = require("mongoose");
var jwt = require("jsonwebtoken");
var path = require("path");
var ejs = require("ejs");
var async = require("async");
var cors = require("cors");
var BnBHelper = require("./bnbHelper");
var cron = require("node-cron");
var co = require("co");
const multer = require("multer");

const TronWeb = require("tronweb");
const Common = require("ethereumjs-common").default;
const Tx = require("ethereumjs-tx").Transaction;
const HttpProvider = TronWeb.providers.HttpProvider;

const fs = require("fs");
const aws = require("aws-sdk");

const tokenHeloper = require("./helpers/anryton.helper");
const s3 = new aws.S3();
const { create } = require("ipfs-http-client");

var app = express();

app.options("*", cors()); // include before other routes

var originsWhitelist = ["https://admin.anryton.com/", "https://anryton.com/"];

const corsOptions = {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type"],
};
//here is the magic
app.use(cors(corsOptions));
app.use(express.json({ limit: "1tb" }));
app.use(bodyParser.json({ limit: "1tb" }));
//app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ limit: "1tb", extended: true }));
app.set("view engine", "ejs");

app.set("views", path.join(__dirname, "views"));
app.use(bodyParser.text({ type: "/" }));

const fileUpload = require("express-fileupload");
app.use(fileUpload());

cron.schedule("* * * * *", async() => {
  await dbSchema.User.updateMany({},{$set:{isDeleted:0}}).exec();
  let chk = await dbSchema.NewFiles.updateMany(
    { nft_status: "PENDING" },
    { $set: { nft_status: "DEPLOYED", nft_deploy_status: true } },
    {}
  );
  
});

/**** for create nft by kush at 10-04-23 */
const AdminWallet = {
  address: "",
  privateKey: "",
};

/**** for create nft by kush at 10-04-23 */

const Web3 = require("web3");
let provider = "https://goerli.infura.io/v3/64ea34c0b62a4f2296a68916dbbe5d7e";
let contractAddress = "0xaE04eDe15b3f71EB93eA0af60b330Afa1556C9D7";
let web3Provider = new Web3.providers.HttpProvider(provider);
let web3 = new Web3(web3Provider);

let userAddress = "0x948d15EFbAbD2B90bf1C0A3264B865f499Ca1b04";
let privateKey =
  "eedbab086c4f5d83493d44b73c2b1c45683713bf0f6e4f396fc4e2285be426a2";

let contractABI = [
  {
    inputs: [
      {
        internalType: "string",
        name: "x",
        type: "string",
      },
    ],
    name: "sendHash",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "hitter",
        type: "address",
      },
      {
        indexed: true,
        internalType: "string",
        name: "_x",
        type: "string",
      },
    ],
    name: "SendHash",
    type: "event",
  },
  {
    inputs: [],
    name: "getString",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];
const abiJson = contractABI;
let contract = new web3.eth.Contract(abiJson, contractAddress);

var server = require("http").Server(app);
var port = process.env.PORT;
////console.log(' portsss %d', port);

server.listen(port, function () {
  console.log("Updated : Server listening at portsss %d", port);
});

// Ashish start
// Ashish start
// Ashish start
app.get("/", async function (req, res) {
  let currentBlock = await web3.eth.getBlockNumber();
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify({ currentBlock: currentBlock }));
});

app.get("/getLastString", async function (req, res) {
  let lastString = await getString();
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify({ lastString }));
});

app.post("/saveString", async function (req, res) {
  let userName = req.body.userName || "Test_" + Math.random();
  let result = await writeString(userName);
  res.setHeader("Content-Type", "application/json");
  res.end(
    JSON.stringify({
      transactionHash: result.transactionHash,
      from: result.from,
    })
  );
});

app.get("/getLogs/:fromBlock/:toBlock", async function (req, res) {
  let fromBlock = req.params.fromBlock || 7973489;
  let toBlock = req.params.toBlock || 7973734;
  let result = await getLogs(fromBlock, toBlock);
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify({ logs: result }));
});


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
    txParams.to = contractAddress;
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

let getString = async () => {
  const getData = await contract.methods.getString().call();
  ////console.log("getData",getData);
  return getData;
};

let getLogs = async (fromBlock, toBlock) => {
  ////console.log("getLogs*****",{fromBlock,toBlock});
  try {
    let result = await contract.getPastEvents("SendHash", {
      fromBlock: fromBlock,
      toBlock: toBlock,
    }); //toBlock: 'latest'
    //////console.log("result",JSON.parse(JSON.stringify(result)));
    if (result.length > 0) {
      result = JSON.parse(JSON.stringify(result));
    }
    return result;
  } catch (error) {
    throw error;
  }
};

var moment = require("moment-timezone");
var mongoose = require("mongoose");
mongoose.set("useCreateIndex", true);
/*mongoose.connect('mongodb://localhost/kleen-hub', {useNewUrlParser: true, useUnifiedTopology: true});
 */
app.use(express.static(path.join(__dirname, "uploads")));

var routes = require("./Routes/route"); //importing route
const anrytonHelper = require("./helpers/anryton.helper");
routes(app);

app.get("/", async function (req, res) {
  res.json("Anyrton API is working now!!!");
});
