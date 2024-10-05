let dbSchema = require("../config/config");
let newFiles = dbSchema.NewFiles;
let Authips = dbSchema.AuthIps;
let { validateNftDetails } = require("../middleware/validateNftRoutes");
let anrytonHelper = require("../helpers/anryton.helper");
var BnBHelper = require("../bnbHelper.js");
let request = require("request");
const { create } = require("ipfs-http-client");
async function ipfsClient() {
  const ipfs = await create({
    host: "127.0.0.1",
    port: 5001,
    protocol: "http",
  });
  return ipfs;
}
var cron = require("node-cron");

const check_new_transfer = async() => {
  const Web3 = require('web3');
  const web3 = new Web3(process.env.RPC_URL);
  const tokenContractABI = [{"inputs":[{"internalType":"string","name":"_tokenName","type":"string"},{"internalType":"string","name":"_tokenSymbol","type":"string"},{"internalType":"address","name":"_owner","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"allowance","type":"uint256"},{"internalType":"uint256","name":"needed","type":"uint256"}],"name":"ERC20InsufficientAllowance","type":"error"},{"inputs":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"uint256","name":"balance","type":"uint256"},{"internalType":"uint256","name":"needed","type":"uint256"}],"name":"ERC20InsufficientBalance","type":"error"},{"inputs":[{"internalType":"address","name":"approver","type":"address"}],"name":"ERC20InvalidApprover","type":"error"},{"inputs":[{"internalType":"address","name":"receiver","type":"address"}],"name":"ERC20InvalidReceiver","type":"error"},{"inputs":[{"internalType":"address","name":"sender","type":"address"}],"name":"ERC20InvalidSender","type":"error"},{"inputs":[{"internalType":"address","name":"spender","type":"address"}],"name":"ERC20InvalidSpender","type":"error"},{"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"OwnableInvalidOwner","type":"error"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"OwnableUnauthorizedAccount","type":"error"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"string","name":"sale","type":"string"},{"indexed":true,"internalType":"uint256","name":"supply","type":"uint256"},{"indexed":true,"internalType":"address","name":"walletAddress","type":"address"}],"name":"MintedWalletSuupply","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint8","name":"saleId","type":"uint8"},{"internalType":"address","name":"saleAddress","type":"address"}],"name":"changeMintedSaleAddress","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"saleName","type":"string"}],"name":"getAssignedWalletAndSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getLatestSale","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getMaxSupply","outputs":[{"internalType":"uint160","name":"","type":"uint160"}],"stateMutability":"pure","type":"function"},{"inputs":[],"name":"mint","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"mintedSale","outputs":[{"internalType":"string","name":"name","type":"string"},{"internalType":"uint160","name":"supply","type":"uint160"},{"internalType":"address","name":"walletAddress","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"mintingCounter","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"}]
  const tokenContract = new web3.eth.Contract(tokenContractABI, process.env.CONTRACT_ADDRESS);
  tokenContract.getPastEvents('Transfer', {
      filter: {
          $or: [
              { from: process.env.ANRYTON_HOT_WALLET_ADDRESS },
              { to: process.env.ANRYTON_HOT_WALLET_ADDRESS }
          ]
      },
      fromBlock: 0,
      toBlock: 'latest'
  })
  .then((events) => {
      // Print the list of ERC-20 token transfer events
      //console.log('ERC-20 Token Transfer Events:');
      events.forEach((event) => {
        check_new_deposit_transaction(event)
          // //console.log('Transaction Hash:', event);
          // //console.log('Transaction Hash:', event.transactionHash);
          // //console.log('From:', event.returnValues.from);
          // //console.log('To:', event.returnValues.to);
          // //console.log('Value:', event.returnValues.value);
          //console.log('------------------------');
          // if(event.returnValues.from == process.env.ANRYTON_HOT_WALLET_ADDRESS){

          // }
      });
  })
  .catch((error) => {
      console.error('Error fetching ERC-20 token transactions:', error.message || error);
  });

}
       
let check_new_deposit_transaction = async(event) => {
  //console.log('we are checking this transaction' , event)
  let ExistTransaction = await dbSchema.TokenTransaction.findOne({transactionHash : event.transactionHash})
   
  if(ExistTransaction){
    //console.log('this transaction already exits ' , ExistTransaction.transactionHash)
  }else{
    //console.log('new transaction ' , event.transactionHash)

      let depositData = new dbSchema.TokenTransaction({
        addressaddress:event.returnValues.from,
        blockHash:event.blockHash,
        from:event.returnValues.from,
        to:event.returnValues.to,
        value : event.returnValues.value,
        transactionHash : event.transactionHash,
      })

    let TokenTransaction = new dbSchema.TokenTransaction(depositData); 
    
    let localAddress = await dbSchema.User.findOne({'etheriumAddress.address' : event.returnValues.to},{email : 1 })
    if(localAddress){
      //console.log('we have to credit tokens' , localAddress);
      let transactionData = {
        userId : localAddress._id, 
        amount : parseFloat(event.returnValues.value / 1000000000000000000),
        type : 'BONUS_TOKENS',
        description : 'Registration bonus'
      } 
      TokenTransaction.save();
      let Transaction = new dbSchema.Transactions(transactionData);
      await Transaction.save(); 
      // //console.log('bonus token transactions ' , transactionData )
      await dbSchema.User.updateOne(
                      {_id: localAddress._id},
                      {
                        $inc:
                        {walletCoins: parseFloat(event.returnValues.value / 1000000000000000000)}, 
                      });
    }
    
  }
}
// check_new_transfer();
cron.schedule("* * * * *", () => { 
  check_new_transfer(); 
});
const nftDetails = async (req, res) => {
  const { error } = validateNftDetails(req.body);
  if (error) {
    res.send({ success: 0, message: error.details[0].message });
  } else {
    try {
      let f = await newFiles.findById(req.body.nft_id);
      if (f) {
        let settings = await dbSchema.Settings.findOne({}, {}, {});
        let obj = {};
        obj.fileName = f.fileName;
        obj.ipfsCid = f.ipfsCid;
        obj.ipfsCidFix = f.ipfsCidFix;
        obj.imageFix= f.imageFix;
        obj.fullUrlFix= f.fullUrlFix;
        obj.createdOn = f.createdOn;
        obj.updatedOn = f.updatedOn;
        obj.rentedPrice = f.rentedPrice;
        obj.rentedDays = f.rentedDays;
        obj.image = f.image;
        obj.fullUrl = f.fullUrl;
        obj.name = f.name;
        obj.price = f.price;
        obj.finalPrice = parseInt(f.price) * parseInt(settings.tokenPrice);
        obj.description = f.description;
        obj.category = f.category;
        obj.nft_status = f.nft_status;
        obj.etheriumAddress = f.etheriumAddress;
        obj.contractAddress = f.contractAddress;
        obj.fileSize = f.fileSize;
        obj.transactionHash = f.transactionHash;
        obj._id = f._id;
        obj.favouriteCount = f.favouriteUserIds.length;
        obj.userId = f.userId;
        obj.data = f.data;
        obj.external_link = f.external_link;
        obj.market_display_status = f.market_display_status;
        let checkFav = f.favouriteUserIds.find((e) => e == req.userId);
        obj.isFav = 0;
        if (checkFav) {
          obj.isFav = 1;
        }
        if (obj.nft_deploy_status) {
          let nftDetails = await anrytonHelper.NFT_DETAILS(obj.nft_hash);
          // ////console.log('nft details ' , nftDetails);

          res.send({
            success: "1",
            message: "success",
            nftData: obj,
            nftDetails: nftDetails,
          });
        } else {
          res.send({ success: "1", message: "success", nftData: obj });
        }
      } else {
        res.send({ success: "0", message: "invalid nft id" });
      }
    } catch (err) {
      ////console.log('error', err);
      res.send({ success: "0", message: "error" });
    }
  }
};
const updateHash = async (req, res) => {
  // request.get(req.body.link,async function (err, ress, body) {
  //     let options = {
  //       warpWithDirectory: false,
  //       progress: (prog) => ////console.log(`Saved :${prog}`)
  //     }
  //     let ipfs = await ipfsClient();
  //     let result = await ipfs.add(body, options);
  //     ////console.log("result----------", result)

  //     await anrytonHelper.SEND_ANRYTON_TOKEN(result.path)
  let userId = req.userId;
  let fileName = req.body.link.split("/").pop();
  fileName = fileName.split("___")[1];
  let userDetail = await dbSchema.User.findOne(
    { _id: userId },
    { etheriumAddress: 1 },
    {}
  );
  let obj = {
    fileName: fileName,
    fullUrl: req.body.link,
    ipfsCid: req.body.ipfsCid,
    //ipfsCid: req.body.ipfsCid,
    description: req.body.description,
    price: req.body.price,
    image: req.body.image,
    name: req.body.name,
    category: req.body.category,
    fileSize: req.body.fileSize || "",
    etheriumAddress: userDetail.etheriumAddress.address || "",
    contractAddress: process.env.NFT_SMART_CONTRACT_ADDRESS || "",
    rentedPrice: req.body.rented_price,
    rentedDays: req.body.rented_days,
    userId: userId,
    nft_status: "PENDING",
    market_display_status: req.body.market_display_status
      ? req.body.market_display_status
      : false,
    external_link: req.body.external_link,
    data: [], //result
  };

  let tokenPrice = await dbSchema.Settings.findOne();
  let userAddress = await dbSchema.User.findById(userId);
  let GASFEE = await anrytonHelper.CALCULATE_GAS_FEE_FOR_NFT(
    obj.name,
    obj.description,
    obj.fullUrl,
    obj.price,
    tokenPrice.tokenPrice,
   userAddress.etheriumAddress.address
  );
  ////console.log('GASFEE ' ,GASFEE)
  if (GASFEE.success == 1) {
    ////console.log("GASFEE.anryton_charges--", GASFEE.anryton_charges)

    // if(GASFEE.user_token_balance >= GASFEE.anryton_charges){

    ////console.log(" userAddress.walletCoins * tokenPrice.tokenPrice---",  (userAddress.walletCoins * tokenPrice.tokenPrice))
    //0 * 2  >= 0.0000184153
    if (
      userAddress.walletCoins * tokenPrice.tokenPrice >=
      GASFEE.gas_usd_charges
    ) {
      ////console.log("savedd----in cond")
      obj.nft_status = "PENDING";
      ////console.log('we are first inside pending ' ,{_id: req.body.id}, obj)
      var newData = await dbSchema.NewFiles.updateOne(
        { _id: req.body.id },
        { $set: obj }
      );

      ////console.log("new files updated")
      ////console.log("new files updated")
      ////console.log("new files updated")
      ////console.log("GASFEE.anryton_chargesn--", GASFEE.anryton_charges)
      let buyerTransaction = {
        userId: userId,
        amount: GASFEE.anryton_charges,
        type: "NFT_UPDATED",
        description: "NFT Updated ",
      };
      let Transaction = new dbSchema.Transactions(buyerTransaction);
      Transaction.save();

      let chk = await dbSchema.User.updateOne(
        { _id: userId },
        { $inc: { walletCoins: -GASFEE.anryton_charges } }
      );
      // let chk= await dbSchema.User.updateOne({_id: userId},{$inc:{walletCoins: - ( 3)}});
      ////console.log("chk wallet deduction--", chk)
      res.json({
        status: 1,
        message: "congratulations your request for nft creation is submitted,",
      });
    } else {
      obj.nft_status = "DRAFT";
      ////console.log('we are inside DRAFT ' ,{_id: req.body.id}, obj)
      var newData = await dbSchema.NewFiles.updateOne(
        { _id: req.body.id },
        { $set: obj }
      );

      res.json({
        status: 0,
        message:
          "You Need " + GASFEE.anryton_charges + " token to create this nft",
      });
    }
  } else {
    res.json({ status: 0, message: GASFEE.message });
  }
  // });
};
const nftSortedList = async (req, res) => {
  let limit = req.body.limit ? parseInt(req.body.limit) : 20;
  let skip = req.body.page ? parseInt(req.body.page) : 0;
  let sort_param = req.body.sort_param;
  let sortValue = req.body.sort_value ? req.body.sort_value : "desc";
  let userId = req.userId;
  if (sortValue == "asc") {
    sortValue = "1";
  } else {
    sortValue = "-1";
  }
  let sortParam;
  if (sort_param == "pricelowtohigh") {
    sortValue = "-1";
    sortParam = "price";
  } else if (sort_param == "pricehightolow") {
    sortValue = "1";
    sortParam = "price";
  } else if (sort_param == "createdon") {
    sortParam = "createdOn";
  } else if (sort_param == "modified") {
    sortParam = "updatedOn";
  } else if (sort_param == "atoz") {
    sortParam = "name";
    sortValue = 1;
  } else if (sort_param == "ztoa") {
    sortParam = "name";
    sortValue = "-1";
  } else if (sort_param == "lastyear") {
  } else if (sort_param == "thisyear") {
  } else if (sort_param == "sizelowtohigh") {
    sortParam = "fileSize";
    sortValue = 1;
  } else if (sort_param == "sizehightolow") {
    sortParam = "fileSize";
    sortValue = "-1";
  }

  let categories = req.body.categories;
  let where = {
    nft_status: "DEPLOYED",
    nft_deploy_status: true,
    isSell: false,
  };
  if (!categories == "") {
    where = {
      category: { $in: categories.split(",") },
      nft_status: "DEPLOYED",
      nft_deploy_status: true,
      isSell: false,
      isDeleted: 0,
    };
  }
  if (sort_param == "lastyear") {
    where = {
      category: { $in: ["KKK"] },
      nft_status: "DEPLOYED",
      nft_deploy_status: true,
      isSell: false,
      isDeleted: 0,
    };
  }
  ////console.log('sort param is ' ,sortParam)
  let sort = {};
  sort[sortParam] = sortValue;
  ////console.log(req.body,'where ' , where ,'sort ' , sort , 'limit ' , limit , 'skip' , skip )
  let nftlist = await dbSchema.NewFiles.find(where)
    .sort(sort)
    .limit(limit)
    .skip(skip);
  let settings = await dbSchema.Settings.findOne({}, {}, {});
  let finalArray = [];
  for (let f of nftlist) {
    let obj = {};
    obj.fileName = f.fileName;
    obj.createdOn = f.createdOn;
    obj.updatedOn = f.updatedOn;
    obj.rentedPrice = f.rentedPrice;
    obj.rentedDays = f.rentedDays;
    obj.image = f.image;
    obj.fullUrl = f.fullUrl;
    obj.name = f.name;
    obj.price = f.price;
    obj.description = f.description;
    obj.category = f.category;
    obj.fileSize = f.fileSize;
    obj.nft_status = f.nft_status;
    obj.transactionHash = f.transactionHash;
    obj._id = f._id;
    obj.etheriumAddress = f.etheriumAddress;
    obj.contractAddress = f.contractAddress;
    obj.userId = f.userId;
    obj.data = f.data;
    obj.favouriteCount = f.favouriteUserIds.length;
    obj.external_link = f.external_link;
    obj.market_display_status = f.market_display_status;
    let checkBuy = f.buyNftUserIds.find((e) => e.userId == userId);
    obj.isBuyNft = 0;
    if (checkBuy) {
      obj.isBuyNft = 1;
    }
    let checkFav = f.favouriteUserIds.find((e) => e == userId);
    obj.isFav = 0;
    if (checkFav) {
      obj.isFav = 1;
    }

    obj.finalPrice = parseInt(f.price) * parseInt(settings.tokenPrice);
    obj.favouriteCount = f.favouriteUserIds.length;

    finalArray.push(obj);
  }

  let nftCount = await dbSchema.NewFiles.find(where, {
    name: 1,
    createdOn: 1,
    category: 1,
  }).countDocuments();

  res.json({
    status: 1,
    message: "data found ",
    nftCount: nftCount,
    data: finalArray,
  });
};
const wallet_transactions = async (req, res) => {
  let limit = req.body.limit ? parseInt(req.body.limit) : 20;
  let skip = req.body.page ? parseInt(req.body.page) : 0;
  let transactionList = await dbSchema.Transactions.find({ userId: req.userId })
    .sort("-1")
    .limit(limit)
    .skip(skip);
  let transactionCount = await dbSchema.Transactions.find({
    userId: req.userId,
  }).count();
  res.json({
    status: 1,
    message: "data found ",
    transactionCount: transactionCount,
    data: transactionList,
  });
};
const getHash = async (req, res) => {
  console.log("now v2/getHash called from nftController.js", req.body);
  let userId = req.userId;
  let fileName = req.body.fileName;
  let userDetail = await dbSchema.User.findOne(
    { _id: userId },
    { etheriumAddress: 1 },
    {}
  );
  let nft_id = req.body.nft_id;
  let obj = {
    fileName: fileName,
    fullUrl: req.body.link,
    fullUrlFix: req.body.link,
    ipfsCid: req.body.ipfsCid || "",
    ipfsCidFix: req.body.ipfsCid || "",
    description: req.body.description,
    price: req.body.price,
    image: req.body.image,
    imageFix: req.body.image,
    name: req.body.name,
    category: req.body.category,
    fileSize: req.body.fileSize || "",
    etheriumAddress: userDetail.etheriumAddress.address || "",
    contractAddress: process.env.NFT_SMART_CONTRACT_ADDRESS || "",
    rentedPrice: req.body.rented_price,
    rentedDays: req.body.rented_days,
    userId: userId,
    nft_deploy_status: false,
    nft_status: "PENDING",
    market_display_status: req.body.market_display_status,
    external_link: req.body.external_link,
    // data:
  };

  let tokenPrice = await dbSchema.Settings.findOne();
  let userAddress = await dbSchema.User.findById(userId);
  let GASFEE = await anrytonHelper.CALCULATE_GAS_FEE_FOR_NFT(
    obj.name,
    obj.description,
    obj.fullUrl,
    obj.price,
    tokenPrice.tokenPrice,
   userAddress.etheriumAddress.address
  );
  console.log("GASFEE ", GASFEE);
  if (GASFEE.success == 1) {
    if (
      userAddress.walletCoins * tokenPrice.tokenPrice >=
      GASFEE.gas_usd_charges
    ) {
      ////console.log("savedd----in cond")
      obj.nft_status = "PENDING";
      if (nft_id == "") {
        var newData = new dbSchema.NewFiles(obj);
        var user = newData.save();
      } else {
        var newData = await dbSchema.NewFiles.updateOne(
          { _id: req.body.nft_id },
          { $set: obj }
        );
      }
      let buyerTransaction = {
        userId: userId,
        amount: GASFEE.anryton_charges,
        type: "NFT_CREATION",
        description: "NFT Created ",
      };
      let Transaction = new dbSchema.Transactions(buyerTransaction);
      Transaction.save();
      let chk = await dbSchema.User.updateOne(
        { _id: userId },
        { $inc: { walletCoins: -GASFEE.anryton_charges } }
      );

      //notifiction for user
      var userNotification = new dbSchema.UserNotifications({
        userId: chk._id,
        title: "Profile update",
        description: "Profile Updated",
      });
      await userNotification.save();
      await anrytonHelper.WRITE_STRING(req.body.link);
      res.json({
        status: 1,
        message: "congratulations your request for nft creation is submitted",
      });
    } else {
      obj.nft_status = "DRAFT";

      if (nft_id == "") {
        var newData = new dbSchema.NewFiles(obj);
        var user = newData.save();
        nft_id = user._id;
      } else {
        var newData = await dbSchema.NewFiles.updateOne(
          { _id: req.body.nft_id },
          { $set: obj }
        );
      }
      await anrytonHelper.WRITE_STRING(req.body.link);
      res.json({
        status: 0,
        message:
          "You Need " + GASFEE.anryton_charges + " token to create this nft",
      });
    
    }
  } else {
    obj.nft_status = "DRAFT";

    if (nft_id == "") {
      var newData = new dbSchema.NewFiles(obj);
      var user = newData.save();
      nft_id = user._id;
    } else {
      var newData = await dbSchema.NewFiles.updateOne(
        { _id: req.body.nft_id },
        { $set: obj }
      );
    }
    await anrytonHelper.WRITE_STRING(req.body.link);
    res.json({ status: 0, message: "You Need tokens to create this nft" });
  }
};


let v1getHash = async (req, res) => {
  console.log('now v1/getHash called from nftController.js', req.body)
  let userId = req.userId;
  let userDetails = await dbSchema.User.findOne({ _id: userId });
  let obj = {
    fileName: req.body.fileName,
    fileNames:  req.body.fileName,
    fullUrl: req.body.link || "",
    directory: req.body.directory,
    fileSize: req.body.fileSize || "",
    userId: userId,
    data: [], //result
  };

  if (req.body.folderId) obj.folderId = req.body.folderId;

  var newData = new dbSchema.Files(obj);
  var file = await newData.save();

  let objj = {
    fileId: file._id,
    type: 2,
    shared: {
      email: userDetails.email, // need help
      permission: "Restricted",
      isOwner: 1,
      permissionType: "Owner",
    },
  };
  if (req.body.folderId) objj.folderId = req.body.folderId;

  if (req.body.folderId){
  await updateFolderSize(req.body.folderId, req.body.fileSize);
  }
  

  var permission = new dbSchema.Permission(objj);
  var store = await permission.save();
  ////console.log("store---", store)
  await dbSchema.Files.updateOne(
    { _id: file._id },
    { $set: { permissionId: store._id } }
  );
   await anrytonHelper.WRITE_STRING(req.body.link);
 
  return res.status(200).json({ status: 1, message: "Sucess!", data:[]});
};


let uploadFileV1 = async (req, res) => {
  console.log("uploadFileV1-calling--", req.files)
  var file = req.files.myfile;
    let fileName = Math.floor(Date.now() / 1000) + "___" + file.name;
    //console.log("fileName--", fileName);
    var options = {
      'method': 'POST',
      'url': 'https://encryption.anryton.com/compress',
      'headers': {
      },
      formData: {
        'file': {
          'value': file.data,
          'options': {
            'filename': fileName,
            'contentType': null
          }
        }
      }
    };
    request(options, function (error, response) {
      if (error){
        console.log("eroor---", error);
        return res.status(400).json({ status: 0, message: "Error!", data: [] });
      } 
      else{
        //console.log("response----v1 upload", JSON.parse(response.body));
        return res.status(200).json({ status: 1, message: "Sucess!", data:JSON.parse(response.body)});
      }
    });
};


let updateFolderSize = async (folderId, fileSize) => {
  console.log("calling updatefolderSize functibo----------> ", folderId, fileSize);
  if (folderId !== "") {
    let allFiles = await dbSchema.Files.find(
      { folderId: folderId },
      { data: 0 },
      {}
    );
    let allFolders = await dbSchema.Folder.find(
      { insideFolderIds:{$in: folderId }},
      { data: 0 },
      {}
    );
    let totalSize = 0;
    // for (let f of allFiles) {
    //   totalSize += parseInt(f.fileSize);
    // }

    //await dbSchema.Folder.updateOne({ _id:folderId},{ $set:{size: totalSize} });
    let uploadedFolder= await dbSchema.Folder.findOne({ _id:folderId },{ data: 0 });
    let newSize= parseInt(parseInt(fileSize) + parseInt(uploadedFolder.size));
    console.log("-------",uploadedFolder.size, newSize);
    await dbSchema.Folder.updateOne({ _id:folderId},{ $set:{size: newSize} });
   
    for (let fol of allFolders) {          
      let folderCheck0= await dbSchema.Folder.findOne({ insideFolderIds:{$in: folderId}},{ data: 0 });
      if(folderCheck0){
        console.log("folderCheck0",folderCheck0._id )
         newSize= parseInt(parseInt(fileSize) + parseInt(folderCheck0.size));
        await dbSchema.Folder.updateOne({ _id:folderCheck0._id},{ $set:{size: newSize} });


      let folderCheck= await dbSchema.Folder.findOne({ insideFolderIds:{$in: fol._id }},{ data: 0 });
      if(folderCheck){
        console.log("folderCheck",folderCheck._id )
         newSize= parseInt(parseInt(fileSize) + parseInt(folderCheck.size));
        await dbSchema.Folder.updateOne({ _id:folderCheck._id},{ $set:{size: newSize} });

        let folderCheck1= await dbSchema.Folder.findOne({ insideFolderIds:{$in: folderCheck._id }},{ data: 0 });
        if(folderCheck1){
          console.log("folderCheck111",folderCheck1._id )
           newSize= parseInt(parseInt(fileSize) + parseInt(folderCheck1.size));
          await dbSchema.Folder.updateOne({ _id:folderCheck1._id},{ $set:{size: newSize} });

          let folderCheck2= await dbSchema.Folder.findOne({ insideFolderIds:{$in: folderCheck1._id }},{ data: 0 });
          if(folderCheck2){
            console.log("folderCheck222",folderCheck2._id )
             newSize= parseInt(parseInt(fileSize) + parseInt(folderCheck2.size));
            await dbSchema.Folder.updateOne({ _id:folderCheck2._id},{ $set:{size: newSize} });

            let folderCheck3= await dbSchema.Folder.findOne({ insideFolderIds:{$in: folderCheck2._id }},{ data: 0 });
            if(folderCheck3){
              console.log("folderCheck333",folderCheck3._id )
               newSize= parseInt(parseInt(fileSize) + parseInt(folderCheck3.size));
              await dbSchema.Folder.updateOne({ _id:folderCheck3._id},{ $set:{size: newSize} });

              let folderCheck4= await dbSchema.Folder.findOne({ insideFolderIds:{$in: folderCheck3._id }},{ data: 0 });
              if(folderCheck4){
                console.log("folderCheck444",folderCheck4._id )
                 newSize= parseInt(parseInt(fileSize) + parseInt(folderCheck4.size));
                await dbSchema.Folder.updateOne({ _id:folderCheck4._id},{ $set:{size: newSize} });
              }
      }
    }
  }
  }
}

    }

    return true;
  }
};
let upadate_nft_market_display_status = async (req, res) => {
  let nft_id = req.body.nft_id;
  ////console.log('data ' , req.userId)
  try {
    let nft = await dbSchema.NewFiles.findOne({
      user_id: req.UserId,
      _id: nft_id,
    });
    let obj = { market_display_status: req.body.status };
    let updateResponse = await dbSchema.NewFiles.updateOne(
      { _id: nft_id },
      { $set: obj }
    );
    res.json({ status: 1, message: "Display status updated Successfully" });
  } catch (err) {
    ////console.log('err ' ,err)
    res.json({ status: 0, message: "Error while updating status" });
  }
};

let delete_nft = async (req, res) => {
  let nft_id = req.body.nft_id;
  ////console.log('data ' , req.userId)
  try {
    let nft = await dbSchema.NewFiles.findOne({
      user_id: req.UserId,
      _id: nft_id,
    });
    let obj = { isDeleted: 1 };
    let updateResponse = await dbSchema.NewFiles.updateOne(
      { _id: nft_id },
      { $set: obj }
    );
    res.json({ status: 1, message: "nft Deleted Successfully" });
  } catch (err) {
    ////console.log('err ' ,err)
    res.json({ status: 0, message: "Error while updating status" });
  }
};

const get_fav_nft_list = async (req, res) => {
  let limit = req.body.limit ? parseInt(req.body.limit) : 20;
  let skip = req.body.page ? parseInt(req.body.page) : 0;
  let userId = req.userId;
  let nftlist = await dbSchema.NewFiles.find({
    favouriteUserIds: { $in: [req.userId] },
  })
    .sort({ _id: "-1" })
    .limit(limit)
    .skip(skip);
  let settings = await dbSchema.Settings.findOne({}, {}, {});
  let finalArray = [];
  for (let f of nftlist) {
    let obj = {};
    obj.fileName = f.fileName;
    obj.createdOn = f.createdOn;
    obj.updatedOn = f.updatedOn;
    obj.rentedPrice = f.rentedPrice;
    obj.ipfsCid= f.ipfsCid;
    obj.ipfsCidFix= f.ipfsCidFix;
    obj.imageFix= f.imageFix;
    obj.fullUrlFix= f.fullUrlFix;
    obj.rentedDays = f.rentedDays;
    obj.image = f.image;
    obj.fullUrl = f.fullUrl;
    obj.name = f.name;
    obj.price = f.price;
    obj.description = f.description;
    obj.category = f.category;
    obj.fileSize = f.fileSize;
    obj.nft_status = f.nft_status;
    obj.transactionHash = f.transactionHash;
    obj._id = f._id;
    obj.etheriumAddress = f.etheriumAddress;
    obj.contractAddress = f.contractAddress;
    obj.userId = f.userId;
    obj.data = f.data;
    obj.favouriteCount = f.favouriteUserIds.length;
    obj.external_link = f.external_link;
    obj.market_display_status = f.market_display_status;
    let checkBuy = f.buyNftUserIds.find((e) => e.userId == userId);
    obj.isBuyNft = 0;
    if (checkBuy) {
      obj.isBuyNft = 1;
    }
    let checkFav = f.favouriteUserIds.find((e) => e == userId);
    obj.isFav = 0;
    if (checkFav) {
      obj.isFav = 1;
    }

    obj.finalPrice = parseInt(f.price) * parseInt(settings.tokenPrice);
    obj.favouriteCount = f.favouriteUserIds.length;

    finalArray.push(obj);
  }

  let nftCount = await dbSchema.NewFiles.find(
    { favouriteUserIds: { $in: [req.userId] } },
    { name: 1, createdOn: 1, category: 1 }
  ).countDocuments();

  res.json({
    status: 1,
    message: "data found ",
    nftCount: nftCount,
    data: finalArray,
  });
};

const user_notification_list = async (req, res) => {
  let limit = req.body.limit ? parseInt(req.body.limit) : 20;
  let skip = req.body.page ? parseInt(req.body.page) : 0;
  skip = skip * limit;
  let userId = req.userId;
  ////console.log('cureent user id  ' , userId)
  let notification_list = await dbSchema.UserNotifications.find({
    userId: userId,
  })
    .sort({ _id: "-1" })
    .limit(limit)
    .skip(skip);
  let notification_count = await dbSchema.UserNotifications.find({
    userId: userId,
  }).countDocuments();
  res.json({
    status: 1,
    message: "data found ",
    notification_list: notification_list,
    notification_count: notification_count,
  });
};

const get_file_icon = async (ext) => {
  let icons = {
    MOV: "https://cdn-icons-png.flaticon.com/128/28/28848.png",
    mov: "https://cdn-icons-png.flaticon.com/128/28/28848.png",
    PNG: "https://cdn-icons-png.flaticon.com/512/337/337948.png",
    png: "https://cdn-icons-png.flaticon.com/512/337/337948.png",
    JPEG: "https://cdn-icons-png.flaticon.com/128/2656/2656444.png",
    jpeg: "https://cdn-icons-png.flaticon.com/128/2656/2656444.png",
    JPG: "https://cdn-icons-png.flaticon.com/128/29/29264.png",
    jpg: "https://cdn-icons-png.flaticon.com/128/29/29264.png",
    MP4: "https://cdn-icons-png.flaticon.com/128/29/29530.png",
    mp4: "https://cdn-icons-png.flaticon.com/128/29/29530.png",
    PDF: "https://cdn-icons-png.flaticon.com/128/482/482216.png",
    pdf: "https://cdn-icons-png.flaticon.com/128/482/482216.png",
  };
  if (icons[ext]) {
    return icons[ext];
  } else {
    return "https://cdn-icons-png.flaticon.com/128/10701/10701484.png";
  }
};

const file_folder_search = async (req, res) => {
  let text = req.body.text;
  let userId = req.userId;
  if (text) {
    var folder = await dbSchema.Folder.find({
      folderName: { $regex: text, $options: "i" },
      isDeleted: 0,
      userId: userId,
    })
      .sort({ _id: -1 })
      .populate({ path: "permissionId", model: "Permission", select: {} });
    var files = await dbSchema.Files.find({
      fileName: { $regex: text, $options: "i" },
      isDeleted: 0,
      userId: userId,
    })
      .sort({ _id: -1 })
      .populate({ path: "permissionId", model: "Permission", select: {} });
    let fileData = [];
    let i = 0;
    let fileInfo = {};
    for (i; i < files.length; i++) {
      fileInfo.icone = await get_file_icon(files[i].fileName.split(".").pop());
      fileInfo.fileName = files[i].fileName;
      fileInfo.fileSize = files[i].fileSize;
      fileInfo.sharedEmails = files[i].sharedEmails;
      fileInfo.fullUrl = files[i].fullUrl;
      fileInfo.isDeleted = files[i].isDeleted;
      fileInfo.directory = files[i].directory;
      fileInfo.createdOn = files[i].createdOn;
      fileInfo.updatedOn = files[i].updatedOn;
      fileInfo._id = files[i]._id;
      fileInfo.userId = files[i].userId;
      fileInfo.__v = files[i].__v;
      fileInfo.data = files[i].data;
      fileInfo.permissionId = files[i].permissionId;
      fileData.push(fileInfo);
    }
    res.json({
      status: 1,
      message: "data found ",
      folders: folder,
      files: fileData,
    });
  } else {
    return res.status(200).json({
      status: 0,
      message: "Please Type an Keyword",
      folders: [],
      files: [],
    });
  }
};

const getRemainingSizeToUpload= async(req,res)=>{
  
  let userId = req.userId;
  let allFiles = await dbSchema.Files.find(
    { userId: userId },
    { data: 0 },
    {}
  );
  let allFolders = await dbSchema.Folder.find(
    { userId:userId},
    { data: 0 },
    {}
  );


  let userDetails= await dbSchema.User.findOne({_id: userId},{walletCoins:1});

  let sizeConsumed= 0;

  for (let fol of allFolders) {  
    if(fol.size){
    if(isNaN(fol.size) == false){        
    sizeConsumed += parseInt(fol.size);
    }
  }
}

for (let fol of allFiles) { 
  if(fol.fileSize){         
  if(isNaN(fol.fileSize) == false){        
    sizeConsumed += parseInt(fol.fileSize);
    }
  }
}

let allowedSize= 0;
let freePercentage= 0;
if(userDetails.walletCoins >= 10 && userDetails.walletCoins < 15){
  allowedSize= "1073741824";
}
if(userDetails.walletCoins >= 15 && userDetails.walletCoins < 25){
  allowedSize= "10737418240";
}
if(userDetails.walletCoins >= 25 && userDetails.walletCoins < 35){
  allowedSize= "107374182400";
}

sizeConsumed = parseInt(allowedSize) - parseInt(sizeConsumed);
freePercentage = parseInt(parseInt(sizeConsumed) / parseInt(allowedSize) * 100)


return res.status(200).json({ status: 1, message: "Success", sizePending: sizeConsumed ,freePercentage:freePercentage});
};

const getWalletCoins = async (req, res) => {  
  let userId = req.userId;
  let check = await dbSchema.User.findOne(
    { _id: userId },
    { walletCoins: 1 }
  );
  return res.status(200).json({ status: 1, message: "Success", data: check });
};

const saveTransaction = async (req, res) => {  
  let userId = req.userId;
  let user = await dbSchema.User.findById(userId);
  let tokenData = await tokenHeloper.SEND_ANRYTON_TOKEN(
    userAddress.etheriumAddress.address,
    req.body.coins
  );
  let TransactionDetails = {
    orderId: req.body.orderId,
    transactionId: req.body.transactionId,
    transactionHash: tokenData.hash || "",
  };
  ////console.log('rr ' ,TransactionDetails)
  let transactionData = {
    userId: userId,
    amount: parseInt(req.body.coins),
    type: "TOKEN_BUY",
    description: "Token Purchased " + req.body.orderId,
  };
  let Transaction = new dbSchema.Transactions(transactionData);
  await Transaction.save();
  let abc = await dbSchema.User.updateOne(
    { _id: userId },
    {
      $inc: { walletCoins: parseInt(req.body.coins) },
      $push: {
        transactions: TransactionDetails,
      },
    }
  );
  ////console.log("abs---", abc)
  return res.status(200).json({ status: 1, message: "Success", data: {} });
};

const createOrder = async (req, res) => {  
  let userId = req.userId;
  let amount = req.body.amount;
  let currency = req.body.currency;
  let receipt = "recepoet##1233232";
  let notes = {
    description: "dfsdfdsfds",
    language: "dfsdfs",
  };

  // STEP 2:
  razorpayInstance.orders.create(
    { amount, currency, receipt, notes },
    (err, order) => {
      //STEP 3 & 4:
      if (!err)
        return res
          .status(200)
          .json({ status: 1, message: "Success", data: order });
      else res.send(err);
    }
  );
};

const transferTokens = async (req, res) => {  
  let userId = req.userId;
  let check = await dbSchema.User.findOne(
    { _id: userId },
    { etheriumAddress: 1 }
  );
  let otherUserId = await dbSchema.User.findOne(
    { _id: req.body.userId },
    { etheriumAddress: 1 }
  );

  if (
    check.etheriumAddress &&
    Object.keys(check.etheriumAddress).length > 0 &&
    otherUserId.etheriumAddress &&
    Object.keys(otherUserId.etheriumAddress).length > 0
  ) {
    let privateKey = check.etheriumAddress.private_key;
    let walletFrom = check.etheriumAddress.address;
    let reciverAddress = otherUserId.etheriumAddress.address;
    let amount = req.body.amount;
    let decimals = 18;

    let data = BnBHelper.bep_token_transfer(
      privateKey,
      walletFrom,
      reciverAddress,
      amount,
      decimals
    );

    return res
      .status(200)
      .json({ status: 1, message: "Success", data: data });
  } else {
    return res
      .status(200)
      .json({ status: 0, message: "Address not found", data: [] });
  }
};

const checkBnbBalance = async (req, res) => {  
  let userId = req.userId;
  let check = await dbSchema.User.findOne(
    { _id: userId },
    { etheriumAddress: 1 }
  );
  let balance = 0;
  if (
    check.etheriumAddress &&
    Object.keys(check.etheriumAddress).length > 0
  ) {
    balance = await BnBHelper.bnbBalance(check.etheriumAddress.address);
  }

  return res
    .status(200)
    .json({ status: 1, message: "Success", data: balance });
};

const getAddress = async (req, res) => {  
  let userId = req.userId;
  let check = await dbSchema.User.findOne(
    { _id: userId },
    { etheriumAddress: 1 }
  );
  let data = {};
  ////console.log("check.etheriumAddress---------", check.etheriumAddress)
  if (
    check.etheriumAddress &&
    Object.keys(check.etheriumAddress).length > 0
  ) {
    ////console.log("yesss")
    data = check.etheriumAddress;
  } else {
    ////console.log("noo")
    data = await BnBHelper.generateBnbAddress();

    await dbSchema.User.updateOne(
      { _id: userId },
      { $set: { etheriumAddress: data } }
    );
  }
  return res.status(200).json({ status: 1, message: "Success", data: data });
};



module.exports = {
  nftDetails: nftDetails,
  updateHash: updateHash,
  nftSortedList: nftSortedList,
  uploadFileV1:uploadFileV1,
  wallet_transactions: wallet_transactions,
  getHash: getHash, //its v2/getHash
  v1getHash: v1getHash, // it's for v1/gethase and v3/gethash
  upadate_nft_market_display_status: upadate_nft_market_display_status,
  delete_nft: delete_nft,
  get_fav_nft_list: get_fav_nft_list,
  user_notification_list: user_notification_list,
  file_folder_search: file_folder_search,
  getWalletCoins:getWalletCoins,
  getAddress:getAddress,
  checkBnbBalance:checkBnbBalance,
  transferTokens:transferTokens,
  createOrder:createOrder,
  saveTransaction:saveTransaction,
  getRemainingSizeToUpload:getRemainingSizeToUpload
  
};

//delete nft
