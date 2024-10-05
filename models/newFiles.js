var mongoose = require('mongoose');
var ObjectId = require('mongoose').Types.ObjectId;
var Schema = mongoose.Schema;

var newFile = new Schema({
      userId: {type: Schema.Types.ObjectId, ref: 'User'},
      fileName: { type: String,default:"" },
      ipfsCid: { type: String,default:"" },
      ipfsCidFix: { type: String,default:"" },
      image: { type: String,default:"" },
      imageFix: { type: String,default:"" },
      fullUrl: { type: String,default:"" },
      fullUrlFix: { type: String,default:"" },
      name: { type: String,default:"" },
      buyNftUserIds:[{
            userId: {type: Schema.Types.ObjectId, ref: 'User'},
            uptoDate:  {type: String, default:""},
            price: { type: String,default:"" },
      }],
      price: { type: String,default:"" },
      rentedPrice: { type: String,default:"1" },
      rentedDays: { type: Number,default:1 },
      description: { type: String,default:"" },
      category: { type: String,default:"" },
      isDeleted: { type: Number,default:0 },
      fileSize: { type: Number,default:"" },
      token_debit_status : {type: Boolean, default: false},
      token_hash : {type: String,default:""},
      eth_credit_status : {type: Boolean, default: false},
      eth_credit_Hash : {type: String,default:""},
      nft_hash : {type: String, default: ""},
      nft_status : {type: String,
            enum: [{DRAFT : 'DRAFT' , PENDING : 'PENDING' ,DEPLOYED : 'DEPLOYED' , PURCHASED : 'PURCHASED'}],
            default: 'DRAFT'
      },
      nft_deploy_status :  {type: Boolean, default: false},
      nft_buy_status :  {type: Boolean, default: false},
      data: { type: Object,default:{} },
      transactionHash: { type: String,default:"" },
      isSell: { type: Boolean, default: false },
      // Added by Baljinder
      market_display_status : {type: Boolean, default: false}, // added by kush
      external_link : {type: String,default:""},     //added by kush
      etheriumAddress : {type: String,default:""},
      contractAddress : {type: String,default:""},
      favouriteUserIds:[{type: Schema.Types.ObjectId, ref: 'User'}],
      createdOn: { type: Date, default: new Date() },
      updatedOn: { type: Date, default:  new Date() }
});
 
module.exports = mongoose.model('NewFile', newFile);