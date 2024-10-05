var mongoose = require('mongoose');
var ObjectId = require('mongoose').Types.ObjectId;
var Schema = mongoose.Schema;
const moment = require('moment-timezone');

var file = new Schema({
      userId: {type: Schema.Types.ObjectId, ref: 'User'},
      fileName: { type: String,default:"" },
      fileNames: { type: String,default:"" },
      folderId: {type: Schema.Types.ObjectId, ref: 'Folder'},
      permissionId: { type: Schema.Types.ObjectId, ref: 'Permission' },
      fileSize: { type: String,default:"" },
      sharedEmails: [{type: String}],
      fullUrl: { type: String,default:"" },
      isDeleted: { type: Number,default:0 },
      data: { type: Object,default:{} },
      id: { type : String , dafault:"Null" },
      directory: { type: String,default:"" },
      createdOn: { type: Date, default: new Date() },
      updatedOn: { type: Date, default:  new Date() },

});

module.exports = mongoose.model('File', file);
