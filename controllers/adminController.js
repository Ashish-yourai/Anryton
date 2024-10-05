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


module.exports = {

  superAdminLogin: function (req, res) {
    ////console.log(req.body)
    co(function* () {
      var checkAdmin = yield dbSchema.SuperAdmin.findOne({ email: req.body.email, password: req.body.password });
     
      if (!checkAdmin) return res.json({ status: 201 });
       var token = yield globalsFunctions.createToken(checkAdmin._id,req.body.email);
      return res.json({ status: 200, token: token });
    }).catch(function (err) {
      ////console.log(err)
      err = err && err.errorCode ? err : { errorCode: 500, errorMessage: err };
      return res.status(err.errorCode).json({ status: 0, message: err.errorMessage, data: [] });
    });
  },

  getAllUsers: function (req, res) {
    co(function* () {
    
      let skip = req.body.start || 0;
      let limit = req.body.length || 10;
      if(skip > 0){
        skip = parseInt(skip * limit);
      }
      let userId = yield globalsFunctions.verifyToken(req.headers.authorization);
      if (userId == null) {
        return res.status(200).json({ status: 0, message: "Invalid token", data: [] });
      }

      let criteria= {};
    if (req.body.search && req.body.search.value !== "") {
        criteria = {
          ...criteria,
          $or:[
          {firstName: {$regex: '.*' + req.body.search.value + '.*', '$options': 'i' }},
          {lastName: {$regex: '.*' + req.body.search.value + '.*', '$options': 'i' }},
            {email: {$regex: '.*' + req.body.search.value + '.*', '$options': 'i' }}
          ]
    };
  }

    let data = [];
    let finalArray= [];
    let count = 0;
    data = yield dbSchema.User.find(criteria, {}, {sort:{_id : -1}}).skip(skip).limit(limit);
    ////console.log("data---", data.length)
    if(data.length > 0){
      for(let u of data){
        ////console.log("u---", u.firstName)
        let obj= {};
        obj.firstName= u.firstName;
        obj.lastName= u.lastName;
        obj._id= u._id;
        obj.profileImage= u.profileImage;
        obj.email= u.email;
        obj.status= u.isActive;
        obj.foldersCount = yield dbSchema.Folder.count({userId: u._id, isDeleted : 0});
        finalArray.push(obj);
      }
    }
    count = yield dbSchema.User.count(criteria);
////console.log("count---", count)
      res.json({ status: 200, data: finalArray ,count: count });
    
    }).catch(function (err) {
      ////console.log(err)
      err = err && err.errorCode ? err : { errorCode: 500, errorMessage: err };
      return res.status(err.errorCode).json({ status: 0, message: err.errorMessage, data: [] });
    });
  },

  getAllUsersList: function (req, res) {
    co(function* () {
    
     
      let criteria= {};
  
    let data = [];
    let finalArray= [];
    let count = 0;
    data = yield dbSchema.User.find(criteria, {_id:1,firstName:1, lastName:1}, {sort:{_id : -1}});

      res.json({ status: 200, data: data });
    
    }).catch(function (err) {
      ////console.log(err)
      err = err && err.errorCode ? err : { errorCode: 500, errorMessage: err };
      return res.status(err.errorCode).json({ status: 0, message: err.errorMessage, data: [] });
    });
  },


  getUserDetails: function (req, res) {
    co(function* () {
    
      let userId = yield globalsFunctions.verifyToken(req.headers.authorization);
      if (userId == null) {
        return res.status(200).json({ status: 0, message: "Invalid token", data: [] });
      }

      let criteria= {};
   criteria._id = req.body._id;

    let data = [];
    let finalArray= [];
    let count = 0;
    data = yield dbSchema.User.find(criteria, {}, {sort:{_id : -1}});
    ////console.log("data---", data.length)
    if(data.length > 0){
      for(let u of data){
        ////console.log("u---", u.firstName)
        let obj= {};
        obj.firstName= u.firstName;
        obj.lastName= u.lastName;
        obj._id= u._id;
        obj.profileImage= u.profileImage;
        obj.email= u.email;
        obj.status= u.isActive;
        obj.foldersCount = yield dbSchema.Folder.count({userId: u._id,isDeleted : 0});
         obj.filesCount = yield dbSchema.Files.count({userId: u._id,isDeleted : 0, folderId: {$ne: null}});
          obj.nftCount = yield dbSchema.NewFiles.count({userId: u._id,isDeleted : 0});
        finalArray.push(obj);
      }
    }

      res.json({ status: 200, data: finalArray  });
    
    }).catch(function (err) {
      ////console.log(err)
      err = err && err.errorCode ? err : { errorCode: 500, errorMessage: err };
      return res.status(err.errorCode).json({ status: 0, message: err.errorMessage, data: [] });
    });
  },

  getUsersById: function (req, res) {
   
    co(function* () {
      let userId = yield globalsFunctions.verifyToken(req.headers.authorization);
      if (userId == null) {
        return res.status(200).json({ status: 0, message: "Invalid token", data: [] });
      }
      // ////console.log("req.params.id",req.params.id)
      var checkUsers = yield dbSchema.User.aggregate([
        { $match: { _id: mongoose.Types.ObjectId(req.params.id) } },
        {
          "$lookup": {
            "from": "folders",
            "localField": "_id",
            "foreignField": "userId",
            "as": "orders_list"
          }
        },
        {
          "$lookup": {
            "from": "files",
            "localField": "_id",
            "foreignField": "userId",
            "as": "filess_list"
          }
        },{
          "$lookup": {
            "from": "newfiles",
            "localField": "_id",
            "foreignField": "userId",
            "as": "nfts_list"
          }
        }
        
      ])
    
      if (!checkUsers) res.json({ status: 201 });
      res.json({ status: 200, data: checkUsers });
    
    }).catch(function (err) {
      ////console.log(err)
      err = err && err.errorCode ? err : { errorCode: 500, errorMessage: err };
      return res.status(err.errorCode).json({ status: 0, message: err.errorMessage, data: [] });
    });
  },
  getAllTransections: function (req, res) {
    co(function* () {
      let skip = req.body.start || 0;
      let limit = req.body.length || 10;
      if(skip > 0){
        skip = parseInt(skip * limit);
      }
      let userId = yield globalsFunctions.verifyToken(req.headers.authorization);
      if (userId == null) {
        return res.status(200).json({ status: 0, message: "Invalid token", data: [] });
      }

      let criteria= {};
    
  if (req.body.search && req.body.search.value !== "") {
        criteria = {
          ...criteria,
          $or:[
          {description: {$regex: '.*' + req.body.search.value + '.*', '$options': 'i' }},
          {type: {$regex: '.*' + req.body.search.value + '.*', '$options': 'i' }}
          ]
    };
  }

    if (req.body.userId && req.body.userId !== "") {
criteria.userId= req.body.userId;
    }

    let data = [];
    let finalArray= [];
    let count = 0;
    data = yield dbSchema.Transactions.find(criteria, {}, {sort:{_id : -1}}).populate({ "path": "userId", 'model': 'User', 'select': { firstName: 1, lastName: 1 } }).skip(skip).limit(limit);
  
    count = yield dbSchema.Transactions.count(criteria);
////console.log("count---", count)
      res.json({ status: 200, data: data ,count: count });
    
    }).catch(function (err) {
      ////console.log(err)
      err = err && err.errorCode ? err : { errorCode: 500, errorMessage: err };
      return res.status(err.errorCode).json({ status: 0, message: err.errorMessage, data: [] });
    }).catch(function (err) {
      ////console.log(err)
      err = err && err.errorCode ? err : { errorCode: 500, errorMessage: err };
      return res.status(err.errorCode).json({ status: 0, message: err.errorMessage, data: [] });
    });
  },
  deactivateUser: function (req, res) {
    co(function* () {
      let userId = yield globalsFunctions.verifyToken(req.headers.authorization);
      if (userId == null) {
        return res.status(200).json({ status: 0, message: "Invalid token", data: [] });
      }

      var checkUsers = yield dbSchema.User.findOne({ _id: req.body._id });
      if (!checkUsers) res.json({ status: 201 });
      var deactivate = yield dbSchema.User.updateOne({ _id: req.body._id }, { $set: { isActive: req.body.status } });
      res.json({ status: 200, data: deactivate });

    }).catch(function (err) {
      ////console.log(err)
      err = err && err.errorCode ? err : { errorCode: 500, errorMessage: err };
      return res.status(err.errorCode).json({ status: 0, message: err.errorMessage, data: [] });
    });
  },
  getContent: function (req, res) {
    co(function* () {
      let skip = req.body.start || 0;
      let limit = req.body.length || 10;
      if(skip > 0){
        skip = parseInt(skip * limit);
      }
      let userId = yield globalsFunctions.verifyToken(req.headers.authorization);
      if (userId == null) {
        return res.status(200).json({ status: 0, message: "Invalid token", data: [] });
      }

      let criteria= {};
    
    if (req.body.search && req.body.search.value !== "") {
        criteria = {
          ...criteria,
          $or:[
          {howItWorkTitle: {$regex: '.*' + req.body.search.value + '.*', '$options': 'i' }},
          {howItWorkText: {$regex: '.*' + req.body.search.value + '.*', '$options': 'i' }}
          ]
    };
  }

    let data = [];
    let finalArray= [];
    let count = 0;
    data = yield dbSchema.Content.find(criteria, {}, {sort:{_id : -1}}).skip(skip).limit(limit);
  
    count = yield dbSchema.Content.count(criteria);
////console.log("count---", count)
      res.json({ status: 200, data: data ,count: count });
    
    }).catch(function (err) {
      ////console.log(err)
      err = err && err.errorCode ? err : { errorCode: 500, errorMessage: err };
      return res.status(err.errorCode).json({ status: 0, message: err.errorMessage, data: [] });
    }).catch(function (err) {
      ////console.log(err)
      err = err && err.errorCode ? err : { errorCode: 500, errorMessage: err };
      return res.status(err.errorCode).json({ status: 0, message: err.errorMessage, data: [] });
    });
  },

    getContentDetails: function (req, res) {
    co(function* () {
     
      let userId = yield globalsFunctions.verifyToken(req.headers.authorization);
      if (userId == null) {
        return res.status(200).json({ status: 0, message: "Invalid token", data: [] });
      }

      let criteria= {};
    
    criteria._id = req.body._id;
    let data = [];
    let finalArray= [];
    let count = 0;
    data = yield dbSchema.Content.find(criteria, {}, {sort:{_id : -1}});
  
      res.json({ status: 200, data: data });
    
    }).catch(function (err) {
      ////console.log(err)
      err = err && err.errorCode ? err : { errorCode: 500, errorMessage: err };
      return res.status(err.errorCode).json({ status: 0, message: err.errorMessage, data: [] });
    }).catch(function (err) {
      ////console.log(err)
      err = err && err.errorCode ? err : { errorCode: 500, errorMessage: err };
      return res.status(err.errorCode).json({ status: 0, message: err.errorMessage, data: [] });
    });
  },
  updateContent: function (req, res) {
    co(function* () {
      let userId = yield globalsFunctions.verifyToken(req.headers.authorization);
      if (userId == null) {
        return res.status(200).json({ status: 0, message: "Invalid token", data: [] });
      }

      let objToUpdate = {};
      if (req.body.howItWorkTitle) {
        objToUpdate.howItWorkTitle = req.body.howItWorkTitle;
      }
      if (req.body.howItWorkText) {
        objToUpdate.howItWorkText = req.body.howItWorkText;
      }
      if (req.body.howItWorkImage) {
        objToUpdate.howItWorkImage = req.body.howItWorkImage;
      }
      var checkUsers = yield dbSchema.Content.updateOne({ _id: req.body._id }, { $set: objToUpdate });
      if (!checkUsers) res.json({ status: 201 });
      res.json({ status: 200, data: {} });

    }).catch(function (err) {
      ////console.log(err)
      err = err && err.errorCode ? err : { errorCode: 500, errorMessage: err };
      return res.status(err.errorCode).json({ status: 0, message: err.errorMessage, data: [] });
    });
  },
  deleteContent:  function (req, res) {
    co(function* () {
      let userId = yield globalsFunctions.verifyToken(req.headers.authorization);
      if (userId == null) {
        return res.status(200).json({ status: 0, message: "Invalid token", data: [] });
      }
 yield dbSchema.Content.remove({ _id: req.body._id });
      //  if (!checkUsers) res.json({ status: 201 });
      res.json({ status: 200, data: {} });

    }).catch(function (err) {
      ////console.log(err)
      err = err && err.errorCode ? err : { errorCode: 500, errorMessage: err };
      return res.status(err.errorCode).json({ status: 0, message: err.errorMessage, data: [] });
    });
  },


  addContent: function (req, res) {
    co(function* () {
      let userId = yield globalsFunctions.verifyToken(req.headers.authorization);
      if (userId == null) {
        return res.status(200).json({ status: 0, message: "Invalid token", data: [] });
      }

      var newContent = new dbSchema.Content(req.body);
      var saveContent = yield newContent.save();
      res.json({ status: 200, data: {} });

    }).catch(function (err) {
      ////console.log(err)
      err = err && err.errorCode ? err : { errorCode: 500, errorMessage: err };
      return res.status(err.errorCode).json({ status: 0, message: err.errorMessage, data: [] });
    });
  },
  getServices: function (req, res) {
    co(function* () {

      let skip = req.body.start || 0;
      let limit = req.body.length || 10;
      if(skip > 0){
        skip = parseInt(skip * limit);
      }
      let userId = yield globalsFunctions.verifyToken(req.headers.authorization);
      if (userId == null) {
        return res.status(200).json({ status: 0, message: "Invalid token", data: [] });
      }

      let criteria= {};
    
    if (req.body.search && req.body.search.value !== "") {
        criteria = {
          ...criteria,
          $or:[
          {title: {$regex: '.*' + req.body.search.value + '.*', '$options': 'i' }},
          {description: {$regex: '.*' + req.body.search.value + '.*', '$options': 'i' }}
          ]
    };
  }

    let data = [];
    let finalArray= [];
    let count = 0;
    data = yield dbSchema.Services.find(criteria, {}, {sort:{_id : -1}}).skip(skip).limit(limit);
  
    count = yield dbSchema.Services.count(criteria);
////console.log("count---", count)
      res.json({ status: 200, data: data ,count: count });

    }).catch(function (err) {
      ////console.log(err)
      err = err && err.errorCode ? err : { errorCode: 500, errorMessage: err };
      return res.status(err.errorCode).json({ status: 0, message: err.errorMessage, data: [] });
    });
  },

  
  getServiceDetails: function (req, res) {
    co(function* () {
     
      let userId = yield globalsFunctions.verifyToken(req.headers.authorization);
      if (userId == null) {
        return res.status(200).json({ status: 0, message: "Invalid token", data: [] });
      }

      let criteria= {};
    
    criteria._id = req.body._id;
    let data = [];
    let finalArray= [];
    let count = 0;
    data = yield dbSchema.Services.find(criteria, {}, {sort:{_id : -1}});
  
      res.json({ status: 200, data: data });
    
    }).catch(function (err) {
      ////console.log(err)
      err = err && err.errorCode ? err : { errorCode: 500, errorMessage: err };
      return res.status(err.errorCode).json({ status: 0, message: err.errorMessage, data: [] });
    }).catch(function (err) {
      ////console.log(err)
      err = err && err.errorCode ? err : { errorCode: 500, errorMessage: err };
      return res.status(err.errorCode).json({ status: 0, message: err.errorMessage, data: [] });
    });
  },


  addServices: function (req, res) {
    co(function* () {
      let userId = yield globalsFunctions.verifyToken(req.headers.authorization);
      if (userId == null) {
        return res.status(200).json({ status: 0, message: "Invalid token", data: [] });
      }

      var newUser = new dbSchema.Services(req.body);
      var user = yield newUser.save();
      res.json({ status: 200, data: {} });

    }).catch(function (err) {
      ////console.log(err)
      err = err && err.errorCode ? err : { errorCode: 500, errorMessage: err };
      return res.status(err.errorCode).json({ status: 0, message: err.errorMessage, data: [] });
    });
  },

  deleteService:  function (req, res) {
    co(function* () {
      let userId = yield globalsFunctions.verifyToken(req.headers.authorization);
      if (userId == null) {
        return res.status(200).json({ status: 0, message: "Invalid token", data: [] });
      }
       yield dbSchema.Services.remove({ _id: req.body._id });
      //  if (!checkUsers) res.json({ status: 201 });
      res.json({ status: 200, data: {} });

    }).catch(function (err) {
      ////console.log(err)
      err = err && err.errorCode ? err : { errorCode: 500, errorMessage: err };
      return res.status(err.errorCode).json({ status: 0, message: err.errorMessage, data: [] });
    });
  },


  updateServices: function (req, res) {
    co(function* () {
      let userId = yield globalsFunctions.verifyToken(req.headers.authorization);
      if (userId == null) {
        return res.status(200).json({ status: 0, message: "Invalid token", data: [] });
      }

      let objToUpdate = {};
      if (req.body.title) {
        objToUpdate.title = req.body.title;
      }
      if (req.body.image) {
        objToUpdate.image = req.body.image;
      }
      if (req.body.description) {
        objToUpdate.description = req.body.description;
      }
      var checkUsers = yield dbSchema.Services.updateOne({ _id: req.body._id }, { $set: objToUpdate });
      //  if (!checkUsers) res.json({ status: 201 });
      res.json({ status: 200, data: {} });

    }).catch(function (err) {
      ////console.log(err)
      err = err && err.errorCode ? err : { errorCode: 500, errorMessage: err };
      return res.status(err.errorCode).json({ status: 0, message: err.errorMessage, data: [] });
    });
  },




  
  getBanners: function (req, res) {
    co(function* () {

      let skip = req.body.start || 0;
      let limit = req.body.length || 10;
      if(skip > 0){
        skip = parseInt(skip * limit);
      }
      let userId = yield globalsFunctions.verifyToken(req.headers.authorization);
      if (userId == null) {
        return res.status(200).json({ status: 0, message: "Invalid token", data: [] });
      }

      let criteria= {};
    
    if (req.body.search && req.body.search.value !== "") {
        criteria = {
          ...criteria,
          $or:[
          {title: {$regex: '.*' + req.body.search.value + '.*', '$options': 'i' }},
          {url: {$regex: '.*' + req.body.search.value + '.*', '$options': 'i' }}
          ]
    };
  }

    let data = [];
    let finalArray= [];
    let count = 0;
    data = yield dbSchema.Banners.find(criteria, {}, {sort:{_id : -1}}).skip(skip).limit(limit);
  
    count = yield dbSchema.Banners.count(criteria);
////console.log("count---", count)
      res.json({ status: 200, data: data ,count: count });

    }).catch(function (err) {
      ////console.log(err)
      err = err && err.errorCode ? err : { errorCode: 500, errorMessage: err };
      return res.status(err.errorCode).json({ status: 0, message: err.errorMessage, data: [] });
    });
  },

  
  getBannerDetails: function (req, res) {
    co(function* () {
     
      let userId = yield globalsFunctions.verifyToken(req.headers.authorization);
      if (userId == null) {
        return res.status(200).json({ status: 0, message: "Invalid token", data: [] });
      }

      let criteria= {};
    
    criteria._id = req.body._id;
    let data = [];
    let finalArray= [];
    let count = 0;
    data = yield dbSchema.Banners.find(criteria, {}, {sort:{_id : -1}});
  
      res.json({ status: 200, data: data });
    
    }).catch(function (err) {
      ////console.log(err)
      err = err && err.errorCode ? err : { errorCode: 500, errorMessage: err };
      return res.status(err.errorCode).json({ status: 0, message: err.errorMessage, data: [] });
    }).catch(function (err) {
      ////console.log(err)
      err = err && err.errorCode ? err : { errorCode: 500, errorMessage: err };
      return res.status(err.errorCode).json({ status: 0, message: err.errorMessage, data: [] });
    });
  },


  addBanners: function (req, res) {
    co(function* () {
      let userId = yield globalsFunctions.verifyToken(req.headers.authorization);
      if (userId == null) {
        return res.status(200).json({ status: 0, message: "Invalid token", data: [] });
      }

      var newUser = new dbSchema.Banners(req.body);
      var user = yield newUser.save();
      res.json({ status: 200, data: {} });

    }).catch(function (err) {
      ////console.log(err)
      err = err && err.errorCode ? err : { errorCode: 500, errorMessage: err };
      return res.status(err.errorCode).json({ status: 0, message: err.errorMessage, data: [] });
    });
  },

  deleteBanner:  function (req, res) {
    co(function* () {
      let userId = yield globalsFunctions.verifyToken(req.headers.authorization);
      if (userId == null) {
        return res.status(200).json({ status: 0, message: "Invalid token", data: [] });
      }
 yield dbSchema.Banners.remove({ _id: req.body._id });
      //  if (!checkUsers) res.json({ status: 201 });
      res.json({ status: 200, data: {} });

    }).catch(function (err) {
      ////console.log(err)
      err = err && err.errorCode ? err : { errorCode: 500, errorMessage: err };
      return res.status(err.errorCode).json({ status: 0, message: err.errorMessage, data: [] });
    });
  },


  updateBanners: function (req, res) {
    co(function* () {
      let userId = yield globalsFunctions.verifyToken(req.headers.authorization);
      if (userId == null) {
        return res.status(200).json({ status: 0, message: "Invalid token", data: [] });
      }

      let objToUpdate = {};
      if (req.body.title) {
        objToUpdate.title = req.body.title;
      }
      if (req.body.image) {
        objToUpdate.image = req.body.image;
      }
      if (req.body.url) {
        objToUpdate.url = req.body.url;
      }
      var checkUsers = yield dbSchema.Banners.updateOne({ _id: req.body._id }, { $set: objToUpdate });
      //  if (!checkUsers) res.json({ status: 201 });
      res.json({ status: 200, data: {} });

    }).catch(function (err) {
      ////console.log(err)
      err = err && err.errorCode ? err : { errorCode: 500, errorMessage: err };
      return res.status(err.errorCode).json({ status: 0, message: err.errorMessage, data: [] });
    });
  },


  updateTokenPrice: function (req, res) {
    co(function* () {
      let userId = yield globalsFunctions.verifyToken(req.headers.authorization);
      if (userId == null) {
        return res.status(200).json({ status: 0, message: "Invalid token", data: [] });
      }

      var checkUsers = yield dbSchema.Settings.updateOne({ _id: req.body._id }, { $set: { tokenPrice: parseInt(req.body.tokenPrice) } });
      res.json({ status: 200, data: {} });
    }).catch(function (err) {
      ////console.log(err)
      err = err && err.errorCode ? err : { errorCode: 500, errorMessage: err };
      return res.status(err.errorCode).json({ status: 0, message: err.errorMessage, data: [] });
    });
  },
  getSettings: function (req, res) {
    co(function* () {
      let userId = yield globalsFunctions.verifyToken(req.headers.authorization);
      if (userId == null) {
        return res.status(200).json({ status: 0, message: "Invalid token", data: [] });
      }

      var checkUsers = yield dbSchema.Settings.find({});
      res.json({ status: 200, data: checkUsers });
    }).catch(function (err) {
      ////console.log(err)
      err = err && err.errorCode ? err : { errorCode: 500, errorMessage: err };
      return res.status(err.errorCode).json({ status: 0, message: err.errorMessage, data: [] });
    });
  },

  getSettingDetails:   function (req, res) {
    co(function* () {
      let userId = yield globalsFunctions.verifyToken(req.headers.authorization);
      if (userId == null) {
        return res.status(200).json({ status: 0, message: "Invalid token", data: [] });
      }

      var checkUsers = yield dbSchema.Settings.find({_id: req.body._id});
      res.json({ status: 200, data: checkUsers });
    }).catch(function (err) {
      ////console.log(err)
      err = err && err.errorCode ? err : { errorCode: 500, errorMessage: err };
      return res.status(err.errorCode).json({ status: 0, message: err.errorMessage, data: [] });
    });
  },

  getPlans: function (req, res) {
    co(function* () {
      let userId = yield globalsFunctions.verifyToken(req.headers.authorization);
      if (userId == null) {
        return res.status(200).json({ status: 0, message: "Invalid token", data: [] });
      }

      var checkUsers = yield dbSchema.Plans.find({ isDeleted: 0 }).sort({ _id: -1 });
      res.json({ status: 200, data: checkUsers });

    }).catch(function (err) {
      ////console.log(err)
      err = err && err.errorCode ? err : { errorCode: 500, errorMessage: err };
      return res.status(err.errorCode).json({ status: 0, message: err.errorMessage, data: [] });
    });
  },
  addPlan: function (req, res) {
    co(function* () {
      let userId = yield globalsFunctions.verifyToken(req.headers.authorization);
      if (userId == null) {
        return res.status(200).json({ status: 0, message: "Invalid token", data: [] });
      }

      var newUser = new dbSchema.Plans(req.body);
      var user = yield newUser.save();
      res.json({ status: 200, data: {} });

    }).catch(function (err) {
      ////console.log(err)
      err = err && err.errorCode ? err : { errorCode: 500, errorMessage: err };
      return res.status(err.errorCode).json({ status: 0, message: err.errorMessage, data: [] });
    });
  },
  updatePlan: function (req, res) {
    co(function* () {
      let userId = yield globalsFunctions.verifyToken(req.headers.authorization);
      if (userId == null) {
        return res.status(200).json({ status: 0, message: "Invalid token", data: [] });
      }

      let objToUpdate = {};
      if (req.body.name) {
        objToUpdate.name = req.body.name;
      }
      if (req.body.image) {
        objToUpdate.image = req.body.image;
      }
      if (req.body.price) {
        objToUpdate.price = req.body.price;
      }
      if (req.body.size) {
        objToUpdate.size = req.body.size;
      }
      var checkUsers = yield dbSchema.Plans.updateOne({ _id: req.body.id }, { $set: objToUpdate });
      //  if (!checkUsers) res.json({ status: 201 });
      res.json({ status: 200, data: {} });

    }).catch(function (err) {
      ////console.log(err)
      err = err && err.errorCode ? err : { errorCode: 500, errorMessage: err };
      return res.status(err.errorCode).json({ status: 0, message: err.errorMessage, data: [] });
    });
  },
  deletePlan: function (req, res) {
    co(function* () {
      let userId = yield globalsFunctions.verifyToken(req.headers.authorization);
      if (userId == null) {
        return res.status(200).json({ status: 0, message: "Invalid token", data: [] });
      }

      let objToUpdate = {};
      var checkUsers = yield dbSchema.Plans.updateOne({ _id: req.body.id }, { $set: { isDeleted: 1 } });
      //  if (!checkUsers) res.json({ status: 201 });
      res.json({ status: 200, data: {} });

    }).catch(function (err) {
      ////console.log(err)
      err = err && err.errorCode ? err : { errorCode: 500, errorMessage: err };
      return res.status(err.errorCode).json({ status: 0, message: err.errorMessage, data: [] });
    });
  },
  counts: function (req, res) {
    co(function* () {

      var checkUsers = yield dbSchema.User.count({});
      var checkFiles = yield dbSchema.Files.count({isDeleted:0});
      var checkNewfiles = yield dbSchema.NewFiles.count({isDeleted:0});
      var checkFolders = yield dbSchema.Folder.count({isDeleted:0});

      let allNewFiles= yield dbSchema.Files.find({isDeleted: 0});
      let totalSize=0;
      for(let f of allNewFiles){
        if(f.fileSize !== undefined){
        ////console.log("f---", f.fileSize)
        totalSize += parseInt(f.fileSize / 1000000);
        ////console.log("totalSize---", totalSize) 
        }
      }
      //  if (!checkUsers) res.json({ status: 201 });
      res.json({ status: 200, data: { users: checkUsers, files: checkFiles, nft: checkNewfiles, folders: checkFolders,totalSize:totalSize } });

    }).catch(function (err) {
      ////console.log(err)
      err = err && err.errorCode ? err : { errorCode: 500, errorMessage: err };
      return res.status(err.errorCode).json({ status: 0, message: err.errorMessage, data: [] });
    });
  },

  saveNotification: function (req, res) {
    co(function* () {
      let userId = yield globalsFunctions.verifyToken(req.headers.authorization);
      if (userId == null) {
        return res.status(200).json({ status: 0, message: "Invalid token", data: [] });
      }

      let objToSave = {
        notificationText: req.body.notificationText,

        //users: req.body.users,
        notificationTitle: req.body.notificationTitle
      };
      var newContent = new dbSchema.Notifications(objToSave);
      var saveContent = yield newContent.save();
      res.json({ status: 200, data: {} });

    }).catch(function (err) {
      ////console.log(err)
      err = err && err.errorCode ? err : { errorCode: 500, errorMessage: err };
      return res.status(err.errorCode).json({ status: 0, message: err.errorMessage, data: [] });
    });
  },

  getNotification: function (req, res) {
      co(function* () {
      let skip = req.body.start || 0;
      let limit = req.body.length || 10;
      if(skip > 0){
        skip = parseInt(skip * limit);
      }
      let userId = yield globalsFunctions.verifyToken(req.headers.authorization);
      if (userId == null) {
        return res.status(200).json({ status: 0, message: "Invalid token", data: [] });
      }

      let criteria= {};

      criteria.isActive= 1;
    
    if (req.body.search && req.body.search.value !== "") {
        criteria = {
          ...criteria,
          $or:[
          {notificationText: {$regex: '.*' + req.body.search.value + '.*', '$options': 'i' }},
          {notificationTitle: {$regex: '.*' + req.body.search.value + '.*', '$options': 'i' }}
          ]
    };
  }

    let data = [];
    let finalArray= [];
    let count = 0;
    ////console.log("count---", criteria, skip, limit)
    data = yield dbSchema.Notifications.find(criteria, {}, {sort:{_id : -1}}).skip(skip).limit(limit);
  
    count = yield dbSchema.Notifications.count(criteria);
////console.log("count---", count)
      res.json({ status: 200, data: data ,count: count });
    
    }).catch(function (err) {
      ////console.log(err)
      err = err && err.errorCode ? err : { errorCode: 500, errorMessage: err };
      return res.status(err.errorCode).json({ status: 0, message: err.errorMessage, data: [] });
    }).catch(function (err) {
      ////console.log(err)
      err = err && err.errorCode ? err : { errorCode: 500, errorMessage: err };
      return res.status(err.errorCode).json({ status: 0, message: err.errorMessage, data: [] });
    });
  },


getNotificationDetails: function (req, res) {
      co(function* () {
      let skip = req.body.start || 0;
      let limit = req.body.length || 10;
      if(skip > 0){
        skip = parseInt(skip * limit);
      }
      let userId = yield globalsFunctions.verifyToken(req.headers.authorization);
      if (userId == null) {
        return res.status(200).json({ status: 0, message: "Invalid token", data: [] });
      }

      let criteria= {};

      criteria._id= req.body._id;
    

    let data = [];
    let finalArray= [];
    let count = 0;
    ////console.log("count---", criteria, skip, limit)
    data = yield dbSchema.Notifications.find(criteria, {}, {sort:{_id : -1}}).skip(skip).limit(limit);
  
   
      res.json({ status: 200, data: data  });
    
    }).catch(function (err) {
      ////console.log(err)
      err = err && err.errorCode ? err : { errorCode: 500, errorMessage: err };
      return res.status(err.errorCode).json({ status: 0, message: err.errorMessage, data: [] });
    }).catch(function (err) {
      ////console.log(err)
      err = err && err.errorCode ? err : { errorCode: 500, errorMessage: err };
      return res.status(err.errorCode).json({ status: 0, message: err.errorMessage, data: [] });
    });
  },

  updateNotification: function (req, res) {
    co(function* () {
      let userId = yield globalsFunctions.verifyToken(req.headers.authorization);
      if (userId == null) {
        return res.status(200).json({ status: 0, message: "Invalid token", data: [] });
      }
      var checkNotification = yield dbSchema.Notifications.findOne({ _id: req.body._id });
      if (!checkNotification) {
        res.json({ status: 201, data: {} });
      }
      else {
        let objToSave = {
          notificationText: req.body.notificationText,
         // users: req.body.users,
          notificationTitle: req.body.notificationTitle
        };
        var updateContent = yield dbSchema.Notifications.updateOne({ _id: req.body._id }, { $set: objToSave });
        res.json({ status: 200, data: {} });
      }

    }).catch(function (err) {
      ////console.log(err)
      err = err && err.errorCode ? err : { errorCode: 500, errorMessage: err };
      return res.status(err.errorCode).json({ status: 0, message: err.errorMessage, data: [] });
    });
  },
  deleteNotification: function (req, res) {
    co(function* () {
      let userId = yield globalsFunctions.verifyToken(req.headers.authorization);
      if (userId == null) {
        return res.status(200).json({ status: 0, message: "Invalid token", data: [] });
      }

        var updateContent = yield dbSchema.Notifications.updateOne({ _id: req.body._id }, { $set: {isActive: 0} });
        res.json({ status: 200, data: {} });
  

    }).catch(function (err) {
      ////console.log(err)
      err = err && err.errorCode ? err : { errorCode: 500, errorMessage: err };
      return res.status(err.errorCode).json({ status: 0, message: err.errorMessage, data: [] });
    });
  },
}


