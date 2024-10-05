var mongoose = require('mongoose');
var ObjectId = require('mongoose').Types.ObjectId;
var Schema = mongoose.Schema;

var folder = new Schema({
      userId: {type: Schema.Types.ObjectId, ref: 'User'},
      folderName: { type: String,default:"" },
      id: { type: Schema.Types.ObjectId, ref: 'Folder' },
      insideFolderIds: [{ type: Schema.Types.ObjectId, ref: 'Folder' }],
      permissionId: { type: Schema.Types.ObjectId, ref: 'Permission' },
      sharedEmails: [{type: String}],
      directory: { type: String,default:"" },
      size: { type: String,default:"0" },
      count: { type: Number,default:0 },
      isMainFolder: { type: Number,default:0 },
      isDeleted: { type: Number,default:0 },
      createdOn: { type: Date, default: new Date() },
      updatedOn: { type: Date, default:  new Date() }
});

module.exports = mongoose.model('Folder', folder);
