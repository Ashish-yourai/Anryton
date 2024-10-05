var mongoose = require('mongoose');
var ObjectId = require('mongoose').Types.ObjectId;
var Schema = mongoose.Schema;

var contactUs = new Schema({
      email: { type: String,default:"" },
      name: { type: String,default:"" },
      comment: { type: String,default:"" },
      createdOn: { type: Date, default: new Date() },
      updatedOn: { type: Date, default:  new Date() },
      status : {type: Number, default: 1}
});

module.exports = mongoose.model('ContactUs', contactUs);