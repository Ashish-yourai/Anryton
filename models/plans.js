var mongoose = require('mongoose');
var ObjectId = require('mongoose').Types.ObjectId;
var Schema = mongoose.Schema;

var plan = new Schema({
      name: { type: String,default:"" },
      image: { type: String,default:"" },
      price: { type: String,default:"" },
      size: { type: String,default:"" },
      isDeleted: { type: Number,default:0 },
      createdOn: { type: Date, default: new Date() },
      updatedOn: { type: Date, default:  new Date() }
});

module.exports = mongoose.model('Plans', plan);
