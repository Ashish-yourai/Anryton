var mongoose = require('mongoose');
var ObjectId = require('mongoose').Types.ObjectId;
var Schema = mongoose.Schema;

var AuthorzationIps = new Schema({
      name: { type: String,default:"" },
      ip: { type: String,default:"" }, 
      isDeleted: { type: Number,default:0 },
      createdOn: { type: Date, default: new Date() },
      updatedOn: { type: Date, default:  new Date() }
});

module.exports = mongoose.model('AuthorzationIps', AuthorzationIps);


//eh dekho mongo ch table nhi aa reha h/  did you hit the apihn /  connection string check krna
//shi h mai check kr lia print krke compass ch v same nal hi dobara add kita h

