var mongoose = require('mongoose');
var ObjectId = require('mongoose').Types.ObjectId;
var Schema = mongoose.Schema;

var tokenTransaction = new Schema({
      address: {type: String, default: ""},
      blockHash: { type: String,default:"" }, 
      from: { type: String,default:"" }, 
      to: { type: String,default:"" }, 
      value: { type: String,default:"" }, 
      transactionHash: { type: String,default:"" }, 
      createdOn: { type: Date, default: new Date() },
      updatedOn: { type: Date, default:  new Date() }
});

module.exports = mongoose.model('tokenTransaction', tokenTransaction);
