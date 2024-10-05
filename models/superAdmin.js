var mongoose = require('mongoose');
var ObjectId = require('mongoose').Types.ObjectId;
var Schema = mongoose.Schema;

var superAdminSchema = new Schema({
      email: { type: String, required: true },
      password: { type: String },
      androidVersion: { type: String },
      iOSVersion: { type: String },
      createdOn: { type: Date, default: new Date() },
      updatedOn: { type: Date, default:  new Date() }
});

module.exports = mongoose.model('SuperAdmin', superAdminSchema);