var mongoose = require('mongoose');
var ObjectId = require('mongoose').Types.ObjectId;
var Schema = mongoose.Schema;

var notifi = new Schema({
      notificationTitle: { type: String,default:"" },
      notificationText: { type: String,default:"" },
      users: [{type: Schema.Types.ObjectId, ref: 'User'}],
      createdOn: { type: Date, default: new Date() },
      updatedOn: { type: Date, default:  new Date() },
      isActive : {type: Number, default: 1},
      status : {type: Number, default: 1},
});

module.exports = mongoose.model('Notification', notifi);