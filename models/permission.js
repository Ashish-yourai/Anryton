var mongoose = require('mongoose');
var ObjectId = require('mongoose').Types.ObjectId;
var Schema = mongoose.Schema;

var permission = new Schema({
      userId: {type: Schema.Types.ObjectId, ref: 'User'},
      folderId: {type: Schema.Types.ObjectId, ref: 'Folder'},
      fileId: {type: Schema.Types.ObjectId, ref: 'File'},
      type: {type : Number , default:1},// 1 in case of folder , 2 in case of file
      shared: [{
       email: {type:String},
        isOwner: {type : Number , default:0},
       permission :{type:String, default:""},
       permissionType: {type: String, default:""}
     }],
      createdOn: { type: Date, default: new Date() },
      updatedOn: { type: Date, default:  new Date() }
});

module.exports = mongoose.model('Permission', permission);
