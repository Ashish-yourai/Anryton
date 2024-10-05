var mongoose = require('mongoose');
var ObjectId = require('mongoose').Types.ObjectId;
var Schema = mongoose.Schema;

var folder = new Schema({
      userId: {type: Schema.Types.ObjectId, ref: 'User'},
      foldersJSON: { type: String,default:"" },
      isDeleted: { type: Number,default:0 },
      createdOn: { type: Date, default: new Date() },
      updatedOn: { type: Date, default:  new Date() }
});

module.exports = mongoose.model('FolderDesktopApp', folder);
