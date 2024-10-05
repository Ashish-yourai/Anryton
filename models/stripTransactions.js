var mongoose = require('mongoose');
var ObjectId = require('mongoose').Types.ObjectId;
var Schema = mongoose.Schema;

var Transactions = new Schema({
      userId: {type: Schema.Types.ObjectId, ref: 'User'},
      amount: { type: Number,default:0 },
      token:{type:Number},  
      productId:{type:String,default:""},
      trasactionId:{type:String,default:""},
      transactionJSON:{type:String,default:""},
      transactionSessionId:{type:String,default:""},
      status:{type:String,default:"init"},
      type: { type: String,default:"" },
      description: { type: String,default:"" },
      isDeleted: { type: Number,default:0 },
      createdOn: { type: Date, default: new Date() },
      updatedOn: { type: Date, default:  new Date() }
});

module.exports = mongoose.model('stripTransactions', Transactions);
