var mongoose = require('mongoose');
var ObjectId = require('mongoose').Types.ObjectId;
var Schema = mongoose.Schema;

var content = new Schema({
      howItWorkTitle: { type: String,default:"" },
      howItWorkText: { type: String,default:"" },
      howItWorkImage: { type: String,default:"" },
      createdOn: { type: Date, default: new Date() },
      updatedOn: { type: Date, default:  new Date() }
});

module.exports = mongoose.model('Content', content);