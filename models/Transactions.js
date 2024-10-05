var mongoose = require('mongoose');
var ObjectId = require('mongoose').Types.ObjectId;
var Schema = mongoose.Schema;

var Transactions = new Schema({
      userId: {type: Schema.Types.ObjectId, ref: 'User'},
      amount: { type: Number,default:0 },  
      type: { type: String,default:"" },
      description: { type: String,default:"" },
      sender: { type: Number,default:0 },
      isDeleted: { type: Number,default:0 },
      createdOn: { type: Date, default: new Date() },
      updatedOn: { type: Date, default:  new Date() }
});

module.exports = mongoose.model('Transactions', Transactions);
