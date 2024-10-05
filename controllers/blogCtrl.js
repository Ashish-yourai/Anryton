const dotenv = require('dotenv');
dotenv.config();

const dbSchema = require('../config/config'),

  mongoose = require('mongoose'),
  alertMessages = require('../config/alertMessages.js'), // Frontend alerts
  globalsFunctions = require('../config/globals'),
  co = require('co'),
  jwt = require('jsonwebtoken'),
  moment= require("moment"),
  request = require("request");
var crypto = require('crypto');


const smsHelper = require('../helpers/sms.helper');
const user = require('../models/user');
var BnBHelper = require("../bnbHelper.js");
const EmailHelper = require('../helpers/Email.helper.js');

module.exports = {
    getBlogs: async (req, res) => {
    co(function* () {

        let skip= parseInt(req.query.skip) || 0;
      let limit= parseInt(req.query.limit) || 10;

let criteria= {isDeleted:0};
      if( req.query.categoryId){
 criteria.categoryId= req.query.categoryId;
      }

      const existingBlog = yield dbSchema.Blog.find(criteria).sort({_id: -1}).skip(skip).limit(limit).populate({'model':"Category","path":"categoryId","select":{name:1}});
     let count= yield dbSchema.Blog.count(criteria);
       return res.status(200).json({ status: 1, message: "Success!", data: existingBlog, count:count });
     })
      .catch(function (err) {
        err = err && err.errorCode ? err : { errorCode: 500, errorMessage: err };
        return res.status(err.errorCode).json({ status: 0, message: err.errorMessage, data: [] });
      });
  },
  createBlog: async (req, res) => {
      co(function* () {
if (!(req.body.categoryId)) return res.status(200).json({ status: 0, message: "Bad Request!", data: [] });
if (req.body.categoryId !== "") return res.status(200).json({ status: 0, message: "CategoryId required!", data: [] });
      var reqObject = { title: req.body.title,isDeleted:0};
      const checkUser = yield dbSchema.Blog.findOne(reqObject).exec();
      if (checkUser) return res.status(200).json({ status: 0, message: "Blog already exist", data: {} });
      var newUser = new dbSchema.Blog(req.body);
      var user = yield newUser.save();   
return res.status(200).json({ status: 1, message: "Success!", data: [] });
})
      .catch(function (err) {
        err = err && err.errorCode ? err : { errorCode: 500, errorMessage: err };
        return res.status(err.errorCode).json({ status: 0, message: err.errorMessage, data: [] });
      });

  },

    updateBlog: async (req, res) => {
      co(function* () {
if (!(req.body.blogId)) return res.status(200).json({ status: 0, message: "Bad Request!", data: [] });

      var reqObject = { _id: req.body.blogId};
      delete req.body.blogId;
      const checkUser = yield dbSchema.Blog.updateOne(reqObject,{$set:req.body}).exec();  
return res.status(200).json({ status: 1, message: "Success!", data: [] });
})
      .catch(function (err) {
        err = err && err.errorCode ? err : { errorCode: 500, errorMessage: err };
        return res.status(err.errorCode).json({ status: 0, message: err.errorMessage, data: [] });
      });

  },


  deleteBlog: async (req, res) => {
        co(function* () {

if (!(req.body.id)) return res.status(200).json({ status: 0, message: "Bad Request!", data: [] });

      var reqObject = { _id: req.body.id};
      const checkUser = yield dbSchema.Blog.updateOne(reqObject,{$set:{isDeleted:1}}); 

return res.status(200).json({ status: 1, message: "Success!", data: [] });
})
      .catch(function (err) {
        err = err && err.errorCode ? err : { errorCode: 500, errorMessage: err };
        return res.status(err.errorCode).json({ status: 0, message: err.errorMessage, data: [] });
      });
  },

  enableDisablePayment: async (req, res) => {
    try {
      allUsers = await User.find({});

     const newPaymentStatus = allUsers.length > 0 ? (allUsers[0].paymentStatus == 0 ? 1: 0) : 1 ;

      const updatedUsers = await User.updateMany({},
        { $set: { paymentStatus: newPaymentStatus } }
      );
      const msg = newPaymentStatus === 1 ? "Payment Enabled" : "Payment Disabled";

      res.status(200).send({ 
        paymentStatus : 1,
        status : 1, 
      });
    } catch (error) {
      //console.log(error);
      res.status(500).send({
        status : 0,
        paymentStatus : 1,
        error,
      });
    }
  },
};
