var mongoose = require('mongoose');
var ObjectId = require('mongoose').Types.ObjectId;
var Schema = mongoose.Schema;

var userNotification = new Schema({
      userId: {type: Schema.Types.ObjectId, ref: 'User'},
      title: { type: String,default:"" },
      description: { type: String,default:"" }, 
      createdOn: { type: Date, default: new Date() },
      updatedOn: { type: Date, default:  new Date() },
      isActive : {type: Number, default: 1},
      status : {type: Number, default: 1},
});

module.exports = mongoose.model('userNotification', userNotification);