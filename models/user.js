var mongoose     = require('mongoose');
var ObjectId = require('mongoose').Types.ObjectId;
var Schema       = mongoose.Schema;


var userSchema   = new Schema({
      firstName: {type: String, default:""},
      lastName: {type: String, default:""},
      email: {type: String, required: true},
      phoneNumber: {type: String, default:""},
      profileImage: {type: String, default:""},
      password: {type: String, default:""},
      zipCode: {type: String, default:""},        
      subscribeToNewsLetter : {type: Number, default: 0},
      acceptPrivacyTerms : {type: Number, default: 0},
       userDeviceInfo: [{
        token: {type:String},
        deviceType: {type: String, possibleValues: ['iphone','android']}        
      }],
      stripeCustomerId: {type: String, default:""},
      etheriumAddress: {type: Object, default: {}},
      googleOrApplePay: {type: String, default:""},
      signUpDate: {type: Date, default: new Date()},
      lastLoginDate :{type: Date, default: new Date()}, 
      LastUpdate: {type: Date, default: new Date()},
      isActive : {type: Number, default: 1},
      isDeleted : {type: Number, default: 0},
      walletCoins : {type: Number, default: 0},
       transactions:[{
            createdAt: {type: Date, default: Date.now},
            orderId:  {type: String, default:""},
            transactionId:  {type: String, default:""},
            transactionHash:  {type: String, default:""}
      }],
      isEmailVerified : {type: Number, default: 0},

      // Auth process
      emailFactorAuth : {type: String, default: ""},
      emailFactorAuthTime : {type: String, default: ""},
      isEmailFactorAuth : {type: Number, default: 1},
      phoneFactorAuth : {type: String, default: ""},
      isPhoneFactorAuth : {type: Number, default: 0},
      bioMatricAuth : {type: String, default: ""},
      isBioMatricAuth : {type: Number, default: 0},
      // Auth Proces

      emailVerificationToken : {type: String, default: ""},
      authProcess : [{type: String, default: ""}],
      resetPasswordToken : {type: String, default: ""},
       resetPasswordAuthTime : {type: String, default: ""},
      socialId : {type: String, default: ""},
	providerName : {type: String, possibleValues: ['apple','google', 'facebook', 'email'], default:"email"}, 
	country : {type: String, possibleValues: ['Denmark','Norway', 'Sweden'], default:"Denmark"}
});

module.exports = mongoose.model('User', userSchema);