var mongoose = require('mongoose');
var ObjectId = require('mongoose').Types.ObjectId;
var Schema = mongoose.Schema;


var service = new Schema({
      title: { type: String,default:"" },
      description: { type: String,default:"" },
      image: [{ type: String,default:"" }],
      createdOn: { type: Date, default: new Date() },
      updatedOn: { type: Date, default:  new Date() }
});

module.exports = mongoose.model('Service', service);