const dotenv = require('dotenv');
dotenv.config();

const dbSchema = require('../config/config'),

  mongoose = require('mongoose'),
  alertMessages = require('../config/alertMessages.js'), // Frontend alerts
  globalsFunctions = require('../config/globals'),
  co = require('co'),
  jwt = require('jsonwebtoken'),
  request = require("request");
var crypto = require('crypto');
var moment = require('moment');


let FileSharingEmail = require('./../helpers/FileSharingEmail.helper');
const folderDesktopApp = require('../models/folderDesktopApp');
//var moment = require('moment-timezone');
//var new Date() =moment.tz(new Date(), "Europe/Copenhagen").format()


// API LIST

module.exports = {

  nftDetails: function (req, res) {
    co(function* () {
      let nft_id = req.body.nft_id; 
      const nftDetails = yield dbSchema.Files.findById(nft_id);
      ////console.log('nftDetails ' ,nftDetails)
      return res.status(200).json({ status: 1, message: "Nft Details", nftDetails: nftDetails });

    }).catch(function (err) {
      ////console.log(err)
      err = err && err.errorCode ? err : { errorCode: 500, errorMessage: err };
      return res.status(err.errorCode).json({ status: 0, message: err.errorMessage, data: [] });
    });

  },

  purchase_nft: function (req , res ) {
    co(function* () {
 let userId= req.userId;
      let nft_id = req.body.nft_id
      var user =  yield dbSchema.User.findById(userId,{});
      
      const nftDetails = yield dbSchema.NewFiles.findOne({ _id: nft_id });
      if(nftDetails.isSell == false){

        ////console.log('user  ',userId , user.walletCoins , 'nft price ' , nftDetails.price)
        if(user.walletCoins >= nftDetails.price){
          let objToSave= {
            userId: userId,
            price : nftDetails.price,
            // uptoDate: req.body.uptoDate
          };

          yield dbSchema.NewFiles.updateOne({_id: nft_id},{$set:{isSell: true, userId: userId,etheriumAddress: user.etheriumAddress.address , nft_status : 'PURCHASED'}});
          yield dbSchema.NewFiles.updateOne({ _id: nft_id },{$push:{buyNftUserIds: objToSave}});
          yield dbSchema.User.updateOne({_id: userId},{$inc:{walletCoins: -(nftDetails.price)}});
          let buyerTransaction = {
            userId : userId,
            amount : -nftDetails.price,
            type : 'NFT_BUY',
            description : 'NFT Purchased '
          }
          let Transaction = new dbSchema.Transactions(buyerTransaction);
          yield Transaction.save();
          return res.status(200).json({ status: 1, message: 'Nft Purchases successfully', data:nftDetails  });
        }else{
          return res.status(200).json({ status: 2, message: 'You have not sufficient coin for this purchase', data:nftDetails  });
        }  
      }else{
        return res.status(200).json({ status: 0, message: 'This nft already Sold', data:nftDetails  });
      }

    }).catch(function (err) {
      ////console.log(err)
      err = err && err.errorCode ? err : { errorCode: 500, errorMessage: err };
      return res.status(err.errorCode).json({ status: 0, message: err.errorMessage, data: [] });
    });
  },

  getUploadedFiles: function (req, res) {
    co(function* () {
  let userId= req.userId;
      var reqObject = { userId: userId, isDeleted: 0 };
      const checkUser = yield dbSchema.Files.find(reqObject).sort({_id: -1}).exec();
      return res.status(200).json({ status: 1, message: alertMessages.success, data:checkUser  });

    }).catch(function (err) {
      ////console.log(err)
      err = err && err.errorCode ? err : { errorCode: 500, errorMessage: err };
      return res.status(err.errorCode).json({ status: 0, message: err.errorMessage, data: [] });
    });

  },

    getUploadedFilesV2: function (req, res) {
    co(function* () {
  let userId= req.userId;
      var reqObject = { userId: userId, isDeleted: 0 };
      const checkUser = yield dbSchema.NewFiles.find(reqObject).sort({_id: -1}).exec();
      return res.status(200).json({ status: 1, message: alertMessages.success, data:checkUser  });

    }).catch(function (err) {
      ////console.log(err)
      err = err && err.errorCode ? err : { errorCode: 500, errorMessage: err };
      return res.status(err.errorCode).json({ status: 0, message: err.errorMessage, data: [] });
    });

  },
  getNftData: function (req, res) {
    co(function* () {
  let userId= req.userId;
      var reqObject = { _id: req.query.id, isDeleted: 0 };
      const checkUser = yield dbSchema.NewFiles.find(reqObject).exec();
      return res.status(200).json({ status: 1, message: alertMessages.success, data:checkUser  });

    }).catch(function (err) {
      ////console.log(err)
      err = err && err.errorCode ? err : { errorCode: 500, errorMessage: err };
      return res.status(err.errorCode).json({ status: 0, message: err.errorMessage, data: [] });
    });

  },

    getUploadedFilesV3: function (req, res) {
    co(function* () {
      let userId= req.userId;
      var reqObject = { isDeleted: 0, userId: {$ne: userId}, nft_status: "DEPLOYED" , nft_deploy_status : true ,isSell : false };
      let limit= req.body.limit || 10;
      let skip = req.body.skip || 0;
      if(req.body.category != "")
      {
        reqObject.category = req.body.category;
      }
      if(skip > 0)
      {
        skip = skip * limit;
      }
      const checkUser = yield dbSchema.NewFiles.find(reqObject).sort({_id: -1}).skip(skip).limit(limit).exec();
      let settings= yield dbSchema.Settings.findOne({},{},{});
      let finalArray= [];
      for(let f of checkUser)
      {
        let obj= {};
        obj.fileName= f.fileName;
        obj.createdOn= f.createdOn;
        obj.ipfsCid= f.ipfsCid;
        obj.ipfsCidFix= f.ipfsCidFix;
        obj.imageFix= f.imageFix;
        obj.fullUrlFix= f.fullUrlFix;
        obj.updatedOn= f.updatedOn;
        obj.rentedPrice= f.rentedPrice;
        obj.rentedDays= f.rentedDays;
        obj.image= f.image;
        obj.imageFix= f.imageFix;
        obj.fullUrlFix= f.fullUrlFix;
        obj.fullUrl= f.fullUrl;
       
        obj.name= f.name;
        obj.price= f.price;
        obj.description= f.description;
        obj.category= f.category;
        obj.fileSize= f.fileSize;
        obj.nft_status= f.nft_status;
        obj.transactionHash= f.transactionHash;
        obj._id= f._id;
        obj.etheriumAddress= f.etheriumAddress;
        obj.contractAddress= f.contractAddress;
        obj.userId= f.userId;
        obj.data= f.data;
        obj.market_display_status = f.market_display_status
        obj.external_link = f.external_link;
        obj.favouriteCount = f.favouriteUserIds.length;
        let checkBuy= f.buyNftUserIds.find(e => e.userId == userId);
        obj.isBuyNft= 0;
        if(checkBuy)
        {
          obj.isBuyNft= 1;
        }       
        let checkFav= f.favouriteUserIds.find(e => e == userId);
        obj.isFav= 0;
        if(checkFav)
        {
          obj.isFav= 1;
        }       
      
        obj.finalPrice = parseInt(f.price) * parseInt(settings.tokenPrice);
        obj.favouriteCount = f.favouriteUserIds.length;

        finalArray.push(obj);
        
      }

      return res.status(200).json({ status: 1, message: alertMessages.success, data:finalArray  });

    }).catch(function (err) {
      ////console.log(err)
      err = err && err.errorCode ? err : { errorCode: 500, errorMessage: err };
      return res.status(err.errorCode).json({ status: 0, message: err.errorMessage, data: [] });
    });

  },
  rentNftList: function (req, res) {
    co(function* () {

 let userId= req.userId;


      var reqObject = { isDeleted: 0, "buyNftUserIds.userId": userId , nft_status: "DEPLOYED" };
      let limit= req.body.limit || 10;
      let skip = req.body.skip || 0;


      if(req.body.category != "")
      {
        reqObject.category = req.body.category;
      }


      if(skip > 0)
      {
        skip = skip * limit;
      }
      const checkUser = yield dbSchema.NewFiles.find(reqObject).sort({_id: -1}).skip(skip).limit(limit).exec();

      let finalArray= [];
      for(let f of checkUser)
      {
        let obj= {};
        obj.fileName= f.fileName;
        obj.createdOn= f.createdOn;
        obj.updatedOn= f.updatedOn;
        obj.rentedPrice= f.rentedPrice;
        obj.rentedDays= f.rentedDays;
        obj.image= f.image;
        obj.fullUrl= f.fullUrl;
        obj.name= f.name;
        obj.price= f.price;
        obj.description= f.description;
        obj.category= f.category;
        obj.fileSize= f.fileSize;
        obj.nft_status= f.nft_status;
        obj.transactionHash= f.transactionHash;
        obj._id= f._id;
        obj.etheriumAddress= f.etheriumAddress;
        obj.contractAddress= f.contractAddress;
        obj.userId= f.userId;
        obj.data= f.data;
        obj.favouriteCount = f.favouriteUserIds.length;
        let checkBuy= f.buyNftUserIds.find(e => e.userId == userId);
        obj.isBuyNft= 0;
        if(checkBuy)
        {
          obj.isBuyNft= 1;
        }       
        let checkFav= f.favouriteUserIds.find(e => e == userId);
        obj.isFav= 0;
        if(checkFav)
        {
          obj.isFav= 1;
        }       
      
        finalArray.push(obj);
        
      }

      return res.status(200).json({ status: 1, message: alertMessages.success, data:finalArray  });

    }).catch(function (err) {
      ////console.log(err)
      err = err && err.errorCode ? err : { errorCode: 500, errorMessage: err };
      return res.status(err.errorCode).json({ status: 0, message: err.errorMessage, data: [] });
    });

  },

    buyNft: function (req, res) {
    co(function* () {
 let userId= req.userId;

      var reqObject = { _id: req.body.id };
      let currentDate= moment(new Date());
      let uptoDate= moment(req.body.uptoDate);
      let numberOfDays= uptoDate.diff(currentDate, 'days')
      ////console.log("currentDate-----uptoDate---numberOfDays", currentDate,uptoDate,  numberOfDays);
      let file = yield dbSchema.NewFiles.findOne(reqObject,{data:0});
      let user= yield dbSchema.User.findOne({_id: userId},{walletCoins:1});
      ////console.log("user----", user)
      ////console.log("file.rentedPrice----", file.rentedPrice)
      let price = parseInt(file.rentedPrice) * numberOfDays;
      ////console.log("price---", price)
      
      if(price > user.walletCoins)
      {
        return res.status(200).json({ status: 0, message: "You don't have enough coins to buy this NFT.", data: [] });
      }
      else
      {
        let objToSave= {
          userId: userId,
          price: price,
          uptoDate: req.body.uptoDate
        };
        yield dbSchema.NewFiles.updateOne(reqObject,{$push:{buyNftUserIds: objToSave}});
        yield dbSchema.User.updateOne({_id: userId},{$inc:{walletCoins: -(price)}});
        return res.status(200).json({ status: 1, message: alertMessages.success, data:[]  });

      }
     
    }).catch(function (err) {
      ////console.log(err)
      err = err && err.errorCode ? err : { errorCode: 500, errorMessage: err };
      return res.status(err.errorCode).json({ status: 0, message: err.errorMessage, data: [] });
    });

  },
  favouriteNft: function (req, res) {
    co(function* () {
 let userId= req.userId;

      var reqObject = { _id: req.body.id };
      if(req.body.status == 1)
      {
        yield dbSchema.NewFiles.updateOne(reqObject,{$addToSet:{favouriteUserIds: userId}},{});
      }
      else
      {
        yield dbSchema.NewFiles.updateOne(reqObject,{$pull:{favouriteUserIds: userId}},{});
      }
        return res.status(200).json({ status: 1, message: alertMessages.success, data:{}  });     
    }).catch(function (err) {
      ////console.log(err)
      err = err && err.errorCode ? err : { errorCode: 500, errorMessage: err };
      return res.status(err.errorCode).json({ status: 0, message: err.errorMessage, data: [] });
    });

  },

  getOwnUploadedFilesV3: function (req, res) {
    co(function* () {
      ////console.log("req----------", req.body)
 let userId= req.userId;
      var reqObject = { isDeleted: 0, userId: userId };
      let limit= req.body.limit || 10;
      let skip = req.body.skip || 0;
      
      if(skip > 0)
      {
        skip = skip * limit;
      }
      const checkUser = yield dbSchema.NewFiles.find(reqObject).sort({_id: -1}).skip(skip).limit(limit).exec();
      let settings= yield dbSchema.Settings.findOne({},{},{});
      let finalArray= [];
      for(let f of checkUser)
      {
        let obj= {};
        obj.fileName= f.fileName;
        obj.createdOn= f.createdOn;
        obj.ipfsCid= f.ipfsCid;
        obj.ipfsCidFix= f.ipfsCidFix;
        obj.imageFix= f.imageFix;
        obj.fullUrlFix= f.fullUrlFix;
        obj.updatedOn= f.updatedOn;
        obj.rentedPrice= f.rentedPrice;
        obj.rentedDays= f.rentedDays;
        obj.image= f.image;
        obj.fullUrl= f.fullUrl;
        obj.name= f.name;
        obj.price= f.price;
        obj.finalPrice = parseInt(f.price) * parseInt(settings.tokenPrice);
        obj.description= f.description;
        obj.category= f.category;
        obj.nft_status= f.nft_status;
        obj.etheriumAddress= f.etheriumAddress;
        obj.contractAddress= f.contractAddress;
        obj.fileSize= f.fileSize;
        obj.transactionHash= f.transactionHash;
        obj._id= f._id;
        obj.favouriteCount = f.favouriteUserIds.length;
        obj.userId= f.userId;
        obj.data= f.data;
        obj.market_display_status = f.market_display_status;
        obj.external_link = f.external_link;
        
        let checkFav= f.favouriteUserIds.find(e => e == userId);
        obj.isFav= 0;
        if(checkFav)
        {
          obj.isFav= 1;
        }    
        
        finalArray.push(obj);   
        
      }
     // ////console.log('checkUser ' , checkUser)
      return res.status(200).json({ status: 1, message: alertMessages.success, data:finalArray  });

    }).catch(function (err) {
      ////console.log(err)
      err = err && err.errorCode ? err : { errorCode: 500, errorMessage: err };
      return res.status(err.errorCode).json({ status: 0, message: err.errorMessage, data: [] });
    });

  },



  deleteFile: function (req, res) {
    co(function* () {
  let userId= req.userId;

      if (!(req.body.id)) return res.status(200).json({ status: 0, message: "Bad Request!", data: [] });

      var reqObject = { _id: req.body.id, userId: userId};
      const checkUser = yield dbSchema.Files.updateOne(reqObject,{$set:{isDeleted: 1}}).exec();
      return res.status(200).json({ status: 1, message: alertMessages.success, data:{}  });

    }).catch(function (err) {
      ////console.log(err)
      err = err && err.errorCode ? err : { errorCode: 500, errorMessage: err };
      return res.status(err.errorCode).json({ status: 0, message: err.errorMessage, data: [] });
    });

  },



  createFolder: function (req, res) {
    co(function* () {
  let userId= req.userId;

      if (!(req.body.folderName)) return res.status(200).json({ status: 0, message: "Bad Request!", data: [] });
      req.body.userId= userId;
      if(req.body.id == "")
      {
          let checkExist= yield dbSchema.Folder.findOne({userId: req.body.userId,folderName: req.body.folderName});
          if(checkExist)
          {
            let updatedCount= parseInt(checkExist.count) + 1;
            let newFolderName= req.body.folderName+"("+updatedCount+")";
            req.body.folderName = newFolderName;
            yield dbSchema.Folder.updateOne({_id: checkExist._id},{$set:{count: updatedCount}});
          }
          delete req.body.id;
          req.body.isMainFolder= 1;
          var newFolder = new dbSchema.Folder(req.body);
          var folder = yield newFolder.save();
      }
      else
      {
        let checkExist= yield dbSchema.Folder.findOne({folderName: req.body.folderName,userId: req.body.userId, id:req.body.id});
          if(checkExist)
          {
            let updatedCount= parseInt(checkExist.count) + 1;
            let newFolderName= req.body.folderName+"("+updatedCount+")";
            req.body.folderName = newFolderName;
            yield dbSchema.Folder.updateOne({_id: checkExist._id},{$set:{count: updatedCount}});
          }
          var newFolder = new dbSchema.Folder(req.body);
          var folder = yield newFolder.save();
          yield dbSchema.Folder.updateOne({_id: req.body.id},{$addToSet: {insideFolderIds:folder._id }},{});
      }
    
     
      let userDetails= yield dbSchema.User.findOne({_id: userId});
      var permission = new dbSchema.Permission(
        {
              folderId:folder._id,
              type: 1,
              shared: {
               email: userDetails.email,// need help
               permission :'Restricted',
               isOwner : 1,
               permissionType: 'Owner'
             },

        });
        var store = yield permission.save();

         yield dbSchema.Folder.updateOne({_id: folder._id},{$set:{permissionId: store._id}});       
      return res.status(200).json({ status: 1, message: alertMessages.success, data:{folder}  });
    }).catch(function (err) {
      ////console.log(err)
      err = err && err.errorCode ? err : { errorCode: 500, errorMessage: err };
      return res.status(err.errorCode).json({ status: 0, message: err.errorMessage, data: [] });
    });

  },

  updateFolder: function (req, res) {
    ////console.log("updateFolder  --------calling")
    co(function* () {
  let userId= req.userId;

      if (!(req.body.folderName)) return res.status(200).json({ status: 0, message: "Bad Request!", data: [] });


      var newFolder = yield dbSchema.Folder.updateOne({folderName: req.body.folderName, userId: userId},{$set:{directory: req.body.directory,updatedOn : new Date()}}).exec();
      ////console.log("newFolder-------", newFolder)
      var folder = yield  dbSchema.Folder.findOne({folderName: req.body.folderName, userId: userId});
      return res.status(200).json({ status: 1, message: alertMessages.success, data:folder  });

    }).catch(function (err) {
      ////console.log(err)
      err = err && err.errorCode ? err : { errorCode: 500, errorMessage: err };
      return res.status(err.errorCode).json({ status: 0, message: err.errorMessage, data: [] });
    });

  },

  getFiles: function (req, res) {
    co(function* () {
  let userId= req.userId;


var files = yield  dbSchema.Files.find({ userId: userId,isDeleted:0}).populate( { "path": "permissionId", 'model': 'Permission', 'select': {}});
           
      
      return res.status(200).json({ status: 1, message: alertMessages.success, data:files  });

    }).catch(function (err) {
      ////console.log(err)
      err = err && err.errorCode ? err : { errorCode: 500, errorMessage: err };
      return res.status(err.errorCode).json({ status: 0, message: err.errorMessage, data: [] });
    });

  },

  getFolders: function (req, res) {
    co(function* () {
  let userId= req.userId;
             if(!req.query.id)
             {
var folder = yield  dbSchema.Folder.find({ userId: userId, id : {$eq: null},isDeleted: 0}).sort({_id: -1}).populate( { "path": "permissionId", 'model': 'Permission', 'select': {}});
var files=    yield  dbSchema.Files.find({ userId: userId, folderId : {$eq: null},isDeleted: 0}).sort({_id: -1}).populate( { "path": "permissionId", 'model': 'Permission', 'select': {}});          
             }
             else
             {
var folder = yield  dbSchema.Folder.find({ userId: userId, id: req.query.id,isDeleted: 0}).sort({_id: -1}).populate( { "path": "permissionId", 'model': 'Permission', 'select': {}});
 var files=    yield  dbSchema.Files.find({ userId: userId, folderId : req.query.id,isDeleted: 0}).sort({_id: -1}).populate( { "path": "permissionId", 'model': 'Permission', 'select': {}});          

             }  



      return res.status(200).json({ status: 1, message: alertMessages.success, folders:folder, files:files  });

    }).catch(function (err) {
      ////console.log(err)
      err = err && err.errorCode ? err : { errorCode: 500, errorMessage: err };
      return res.status(err.errorCode).json({ status: 0, message: err.errorMessage, data: [] });
    });

  },


 getPermissions: function (req, res) {
    co(function* () {
      console.log("calling-- getPermissions");
  let userId= req.userId;
      if(req.query.type == 1)
      {
        var folder = yield  dbSchema.Permission.findOne({ fileId: req.query.id});

}
else
{
  var folder = yield  dbSchema.Permission.findOne({ folderId: req.query.id});
}
      
       let arr= folder.shared;
       folder.shared = [];
       let array1= [];
       for(let s of arr)
       {
        let obj= {
           email:s.email,
        isOwner: s.isOwner,
       permission :s.permission,
       permissionType: s.permissionType
        };
        console.log("obj--", obj);
array1.push(obj);
       }      
      return res.status(200).json({ status: 1, message: alertMessages.success, data:folder , permissions: array1 });

    }).catch(function (err) {
      console.log(err)
      err = err && err.errorCode ? err : { errorCode: 500, errorMessage: err };
      return res.status(err.errorCode).json({ status: 0, message: err.errorMessage, data: [] });
    });

  },

 sharedFile: function (req, res) {
    co(function* () {
  let userId= req.userId;
      let userDtails= yield dbSchema.User.findOne({_id: userId},{email: 1});
      ////console.log("req---", req.query);
      if(parseInt(req.query.type) == 1)
      {
        var folder = yield  dbSchema.Files.findOne({ _id: req.query.id,isDeleted:0},{data:0}).populate( { "path": "permissionId", 'model': 'Permission', 'select': {}});
}
else
{
  
var folder = yield  dbSchema.Folder.findOne({ _id: req.query.id,isDeleted:0}).populate( { "path": "permissionId", 'model': 'Permission', 'select': {}});

 }

////console.log("folder---",folder);
let permissionArray= folder.permissionId.shared;
let checkEmail= permissionArray.find(({ email }) => email === userDtails.email);
if(checkEmail)
{
 return res.status(200).json({ status: 1, message: alertMessages.success, data:folder, permissionObject: checkEmail  });
}
else
{
  return res.status(200).json({ status: 1, message: alertMessages.success, data:folder, permissionObject: {}  });
}
             
     

    }).catch(function (err) {
      ////console.log(err)
      err = err && err.errorCode ? err : { errorCode: 500, errorMessage: err };
      return res.status(err.errorCode).json({ status: 0, message: err.errorMessage, data: [] });
    });

  },

getSharedFiles: function (req, res) {
    co(function* () {
  let userId= req.userId;
      let userDtails= yield dbSchema.User.findOne({_id: userId},{email: 1});

var folder = yield  dbSchema.Folder.find({ sharedEmails:{$in: userDtails.email},isDeleted:0}).populate( { "path": "permissionId", 'model': 'Permission', 'select': {}});

  var files = yield  dbSchema.Files.find({ sharedEmails:{$in: userDtails.email},isDeleted:0},{data:0}).populate( { "path": "permissionId", 'model': 'Permission', 'select': {}});

  return res.status(200).json({ status: 1, message: alertMessages.success, folders:folder, files:files });

             
     

    }).catch(function (err) {
      ////console.log(err)
      err = err && err.errorCode ? err : { errorCode: 500, errorMessage: err };
      return res.status(err.errorCode).json({ status: 0, message: err.errorMessage, data: [] });
    });

  },

  getFolderFileCount: function (req, res) {
    co(function* () {
  let userId= req.userId;
    
      let userDtails= yield dbSchema.User.findOne({_id: userId},{email: 1});


var folder = yield  dbSchema.Folder.find({ userId:userId,isDeleted:0,id:null});
let folderSize= 0;
if(folder.length > 0)
{
for(let f of folder)
{
  folderSize += parseInt(f.size);
}
}

  var files = yield  dbSchema.Files.find({ userId:userId,isDeleted:0,folderId:null});
  let fileSize= 0;
  if(files.length > 0)
{
for(let file of files)
{
  ////console.log("fileSize)------",parseInt(file.fileSize))
  fileSize += isNaN(parseInt(file.fileSize)) == false ? parseInt(file.fileSize) : 0;
  ////console.log("fileSize)------",fileSize)
}
if(fileSize == null)
{
  fileSize = 0;
}
}

  return res.status(200).json({ status: 1, message: alertMessages.success, folders:folder.length, files:files.length,fileSize:fileSize,folderSize:folderSize });

             
     

    }).catch(function (err) {
      ////console.log(err)
      err = err && err.errorCode ? err : { errorCode: 500, errorMessage: err };
      return res.status(err.errorCode).json({ status: 0, message: err.errorMessage, data: [] });
    });

  },


 updatePermissions: function (req, res) {
    co(function* () {
      console.log("update permisiion---", req.body)
      let userId= req.userId;
        if(req.body.folderId)
        {
          var folder = yield  dbSchema.Permission.updateOne({ folderId: req.body.folderId},{$set:{shared: req.body.permissions}});
          let arr= [];
            for(let fp of req.body.permissions)
            {
              arr.push(fp.email);
            }
          let cc= yield  dbSchema.Folder.updateOne({ _id: req.body.folderId},{$set:{sharedEmails: arr}});
          var folder = yield  dbSchema.Permission.findOne({ folderId: req.body.folderId});
        }
        else
        {
          var folder = yield  dbSchema.Permission.updateOne({ fileId: req.body.fileId},{$set:{shared: req.body.permissions}});
          let arr= [];
          for(let fp of req.body.permissions)
          {
            arr.push(fp.email);
          }
          ////console.log("arr-----------", arr);
          yield  dbSchema.Files.updateOne({ _id: req.body.fileId},{$set:{sharedEmails: arr}});
            // ////console.log("cc-----", cc)
            var folder = yield  dbSchema.Permission.findOne({ fileId: req.body.fileId});
        }
         

        let arr= folder.shared;
        folder.shared = [];
        let array= [];
        let array1= [];
        for(let s of arr)
        {
            let obj= {
                  email:s.email,
                  isOwner: s.isOwner,
                  permission :s.permission,
                  permissionType: s.permissionType
                };
            array1.push(obj);
        }         
      return res.status(200).json({ status: 1, message: alertMessages.success, data:folder,  permissions: array1   });

    }).catch(function (err) {
      ////console.log(err)
      err = err && err.errorCode ? err : { errorCode: 500, errorMessage: err };
      return res.status(err.errorCode).json({ status: 0, message: err.errorMessage, data: [] });
    });

  },
  updatePermissionsLink: function (req, res) {

    console.log("inside update updatePermissionsLink---", req.body)
    co(function* () {
       let userId= req.userId;
        let link = req.body.link;
        let type = req.body.type;
        let user =  yield dbSchema.User.findById(userId,{});
        // ////console.log('token ' , user.firstName , user.email)
        let Emaildata;
        if(req.body.folderId)
        {
          let folderName = yield dbSchema.Folder.findOne({_id : req.body.folderId})
          //console.log('req.body ' , req.body.folderId)
          Emaildata = {
            name : user.firstName,
            folder_name : folderName.folderName,
            time : 'Just Now',
            link : link,
            email : user.email,
            subject : type +' Update Permission',
          }

        }else{
          let fileName = yield dbSchema.Files.findOne({_id : req.body.fileId})
          Emaildata = {
            name : user.firstName,
            folder_name : fileName.fileName,
            time : 'Just Now',
            link : link,
            email : user.email,
            subject : type +' Update Permission',
            type : type
          }
        }
        if(req.body.folderId)
        {
          var folder = yield  dbSchema.Permission.updateOne({ folderId: req.body.folderId},{$set:{shared: req.body.permissions}});
          let arr= [];
            for(let fp of req.body.permissions)
            {
              arr.push(fp.email);
            }
          let cc= yield  dbSchema.Folder.updateOne({ _id: req.body.folderId},{$set:{sharedEmails: arr}});
          var folder = yield  dbSchema.Permission.findOne({ folderId: req.body.folderId});
         
        }
        else
        {
          var folder = yield  dbSchema.Permission.updateOne({ fileId: req.body.fileId},{$set:{shared: req.body.permissions}});
          let arr= [];
          ////console.log('permissions ' , req.body)
          for(let fp of req.body.permissions)
          {
            arr.push(fp.email);
          }
          ////console.log("arr-----------", arr);
          yield  dbSchema.Files.updateOne({ _id: req.body.fileId},{$set:{sharedEmails: arr}});
            // ////console.log("cc-----", cc)
            var folder = yield  dbSchema.Permission.findOne({ fileId: req.body.fileId});
            
        }
         
// ////console.log('Emaildata' , Emaildata)
        let arr= folder.shared;
        folder.shared = [];
        let array= [];
        let array1= [];
        for(let s of arr)
        {
            let obj= {
                  email:s.email,
                  isOwner: s.isOwner,
                  permission :s.permission,
                  permissionType: s.permissionType
                };
            array1.push(obj);
            FileSharingEmail.sendFileShareEmail(s.email , Emaildata.subject , Emaildata)
            
        }         
      return res.status(200).json({ status: 1, message: alertMessages.success, data:folder,  permissions: array1   });

    }).catch(function (err) {
      console.log(err)
      err = err && err.errorCode ? err : { errorCode: 500, errorMessage: err };
      return res.status(err.errorCode).json({ status: 0, message: err.errorMessage, data: [] });
    });

  },
  deletePermissions: function (req, res) {
    co(function* () {
      ////console.log("delete permisiion---", req.body)
  let userId= req.userId;
let getData= yield dbSchema.Permission.findOne({_id: req.body.id},{},{});
let arr= getData.shared;

arr = arr.filter(obj => obj.email !== req.body.email);


yield  dbSchema.Permission.updateOne({_id: req.body.id},{$set:{shared: arr}});
      return res.status(200).json({ status: 1, message: alertMessages.success, data:{}   });

    }).catch(function (err) {
      ////console.log(err)
      err = err && err.errorCode ? err : { errorCode: 500, errorMessage: err };
      return res.status(err.errorCode).json({ status: 0, message: err.errorMessage, data: [] });
    });

  },


 updateFileFolder: function (req, res) {
  console.log("updateFileFolder  --------calling", req.body)
    co(function* () {
  let userId= req.userId;
      let objToUpdate={};
      if(req.body.type == 1) // file
      {

let getFileData= yield dbSchema.Files.findOne({_id: req.body._id},{fileSize: 1,folderId:1},{});
console.log("getFileData---", getFileData);
if(req.body.name != "") objToUpdate.fileName = req.body.name;
if(req.body.folderId != "") objToUpdate.folderId = req.body.folderId;
if(req.body.directory != "") objToUpdate.directory = req.body.directory;
objToUpdate.updatedOn = new Date();
yield dbSchema.Files.updateOne({_id: req.body._id},{$set:objToUpdate});

if(req.body.folderId != ""){
  updateFolderSize(req.body.folderId, getFileData.fileSize);
}

if(getFileData.folderId !== ""){
  updateFolderSizeReverse(getFileData.folderId,getFileData.fileSize);
}
 
      }
      else // folder
      {
if(req.body.name != "") objToUpdate.folderName = req.body.name;
if(req.body.folderId != "") objToUpdate.id = req.body.folderId;
if(req.body.directory != "") objToUpdate.directory = req.body.directory;
objToUpdate.updatedOn = new Date();
yield dbSchema.Folder.updateOne({_id: req.body._id},{$set:objToUpdate});
      }
        
      return res.status(200).json({ status: 1, message: alertMessages.success, data:{}  });

    }).catch(function (err) {
      ////console.log(err)
      err = err && err.errorCode ? err : { errorCode: 500, errorMessage: err };
      return res.status(err.errorCode).json({ status: 0, message: err.errorMessage, data: [] });
    });

  },


 deleteFileFolder: function (req, res) {
  ////console.log("Calling delete file/folder---", req.body)
    co(function* () {
  let userId= req.userId;
       let folderIds= [];
         let fileIds= [];
      let objToUpdate={};
      if(req.body.type == 1) // file
      {
        ////console.log("type-- 1")
yield dbSchema.Files.updateOne({_id: req.body._id},{$set:{isDeleted: 1}}); 
      }
      else // folder
      {
         ////console.log("type-- 2")
        
        let get= yield dbSchema.Folder.findOne({_id: req.body._id});
        folderIds.push(get._id);
      //   var findAll= yield dbSchema.Folder.find({directory:{ $regex: '.*' + get.directory + '.*', '$options': 'i' }});

      //   if(findAll.length > 0)
      //   {
      //     for(let f of findAll)
      //     {
      //           folderIds.push(f._id);  
      //   }
      // }

       yield dbSchema.Files.updateMany({folderId:{$in: folderIds}},{$set:{isDeleted:1}});
       yield dbSchema.Folder.updateMany({_id:{$in: folderIds}},{$set:{isDeleted:1}});
   
      }
        
      return res.status(200).json({ status: 1, message: alertMessages.success, data:{} });

    }).catch(function (err) {
      ////console.log(err)
      err = err && err.errorCode ? err : { errorCode: 500, errorMessage: err };
      return res.status(err.errorCode).json({ status: 0, message: err.errorMessage, data: [] });
    });

  },


 saveDesktopAppFolders:async (req,res)=>{
  var pathJSON=req.body.pathJSON;
  var userId=req.userId;
  var filter={"userId":userId}

  ////console.log("=======here in save app api",req.body);

  data=await folderDesktopApp.findOne(filter);
 
  if(data!=undefined || data != null){
    await folderDesktopApp.updateOne(filter,{foldersJSON:pathJSON});

    return res.send({status:true,isUpdated:1});
  }else{
    var obj=new folderDesktopApp({userId,foldersJSON:pathJSON});
    await obj.save()
    return res.send({status:true,isUpdated:0});
  }

  return res.send({status:false});
  
 },


 getDesktopAppFolders:async (req,res,next)=>{
  var userId=req.userId;
  var filter={"userId":userId}
  data=await folderDesktopApp.findOne(filter);
  return res.send({status:true,data});
 }

}

let updateFolderSize = async (folderId, fileSize) => {
  console.log("calling updatefolderSize functibo5555555555----------> ", folderId, fileSize);
    let allFiles = await dbSchema.Files.find(
      { folderId: folderId },
      { data: 0 },
      {}
    );
    // let allFolders = await dbSchema.Folder.find(
    //   { insideFolderIds:{$in: folderId }},
    //   { data: 0 },
    //   {}
    // );
    // let totalSize = 0;
    // for (let f of allFiles) {
    //   totalSize += parseInt(f.fileSize);
    // }

    let uploadedFolder= await dbSchema.Folder.findOne({ _id:folderId },{ data: 0 });
    console.log("uploadedFolder.size",uploadedFolder.size)
    let newSize= parseInt(parseInt(fileSize) + parseInt(uploadedFolder.size));
    console.log("-------",uploadedFolder.size, newSize);
    await dbSchema.Folder.updateOne({ _id:folderId},{ $set:{size: newSize} });

    
   // for (let fol of allFolders) {      
      let folderCheck0= await dbSchema.Folder.findOne({ insideFolderIds:{$in: folderId }},{ data: 0 });
      if(folderCheck0){
        console.log("folderCheck0",folderCheck0._id )
        newSize= parseInt(parseInt(fileSize) + parseInt(folderCheck0.size));
        await dbSchema.Folder.updateOne({ _id:folderCheck0._id},{ $set:{size: newSize} });


      let folderCheck= await dbSchema.Folder.findOne({ insideFolderIds:{$in: folderCheck0._id }},{ data: 0 });
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
    return true;
  }
};


let updateFolderSizeReverse = async (folderId, fileSize) => {
  console.log("calling updatefolderSize Reverseeeefunctibo5666666666666----------> ", folderId, fileSize);
    let allFiles = await dbSchema.Files.find(
      { folderId: folderId },
      { data: 0 },
      {}
    );
    // let allFolders = await dbSchema.Folder.find(
    //   { insideFolderIds:{$in: folderId }},
    //   { data: 0 },
    //   {}
    // );
    // let totalSize = 0;
    // for (let f of allFiles) {
    //   totalSize += parseInt(f.fileSize);
    // }

    let uploadedFolder= await dbSchema.Folder.findOne({ _id:folderId },{ data: 0 });
    console.log("uploadedFolderReverseeeef.size",uploadedFolder.size)
    let newSize= parseInt(parseInt(uploadedFolder.size) - parseInt(fileSize));
    console.log("-------",uploadedFolder.size, newSize);
    await dbSchema.Folder.updateOne({ _id:folderId},{ $set:{size: newSize} });

    
   // for (let fol of allFolders) {      
      let folderCheck0= await dbSchema.Folder.findOne({ insideFolderIds:{$in: folderId }},{ data: 0 });
      if(folderCheck0){
        console.log("folderCheck0Reverseeeef",folderCheck0._id,folderCheck0.size )
        newSize= parseInt(parseInt(folderCheck0.size) - parseInt(fileSize));
        await dbSchema.Folder.updateOne({ _id:folderCheck0._id},{ $set:{size: newSize} });


      let folderCheck= await dbSchema.Folder.findOne({ insideFolderIds:{$in: folderCheck0._id }},{ data: 0 });
      if(folderCheck){
        console.log("folderCheckReverseeeef",folderCheck._id,folderCheck.size )
         newSize= parseInt(parseInt(folderCheck.size) - parseInt(fileSize));
        await dbSchema.Folder.updateOne({ _id:folderCheck._id},{ $set:{size: newSize} });

        let folderCheck1= await dbSchema.Folder.findOne({ insideFolderIds:{$in: folderCheck._id }},{ data: 0 });
        if(folderCheck1){
          console.log("folderCheck111Reverseeeef",folderCheck1._id,folderCheck1.size )
           newSize= parseInt(parseInt(folderCheck1.size) - parseInt(fileSize));
          await dbSchema.Folder.updateOne({ _id:folderCheck1._id},{ $set:{size: newSize} });

          let folderCheck2= await dbSchema.Folder.findOne({ insideFolderIds:{$in: folderCheck1._id }},{ data: 0 });
          if(folderCheck2){
            console.log("folderCheck222Reverseeeef",folderCheck2._id,folderCheck2.size )
             newSize= parseInt(parseInt(folderCheck2.size) - parseInt(fileSize));
            await dbSchema.Folder.updateOne({ _id:folderCheck2._id},{ $set:{size: newSize} });

            let folderCheck3= await dbSchema.Folder.findOne({ insideFolderIds:{$in: folderCheck2._id }},{ data: 0 });
            if(folderCheck3){
              console.log("folderCheck333Reverseeeef",folderCheck3._id,folderCheck3.size )
               newSize= parseInt(parseInt(folderCheck3.size) - parseInt(fileSize));
              await dbSchema.Folder.updateOne({ _id:folderCheck3._id},{ $set:{size: newSize} });

              let folderCheck4= await dbSchema.Folder.findOne({ insideFolderIds:{$in: folderCheck3._id }},{ data: 0 });
              if(folderCheck4){
                console.log("folderCheck444Reverseeeef",folderCheck4._id,folderCheck4.size )
                 newSize= parseInt(parseInt(folderCheck4.size) - parseInt(fileSize));
                await dbSchema.Folder.updateOne({ _id:folderCheck4._id},{ $set:{size: newSize} });
              }
      }
    }
  }
}
    return true;
  }
};
