const dotenv = require('dotenv');
dotenv.config();

const dbSchema = require('../config/config'),

  mongoose = require('mongoose'),
  alertMessages = require('../config/alertMessages.js'), // Frontend alerts
  globalsFunctions = require('../config/globals'),
  co = require('co'),
  jwt = require('jsonwebtoken'),
  moment= require("moment"),
  request = require("request");
var crypto = require('crypto');

const tokenHeloper = require("../helpers/anryton.helper");
const bcrypt = require('bcrypt');
const saltRounds = 10;
const smsHelper = require('../helpers/sms.helper');
const user = require('../models/user');
var BnBHelper = require("../bnbHelper.js");
const EmailHelper = require('../helpers/Email.helper.js');

// API LIST

module.exports = {

  getTokenFromEmail: function (req, res) {
    co(function* () {

      if (!(req.body.email)) return res.status(200).json({ status: 0, message: "Bad Request!", data: [] });
        
        var reqObject = { email: req.body.email.toLowerCase(), isDeleted:0};
        var checkUser = yield dbSchema.User.findOne(reqObject).exec();
        if (!checkUser)
        {

        }
        else
        {
          reqObject = { email: req.body.email.toLowerCase()};
          checkUser = yield dbSchema.User.findOne(reqObject).exec();
          if (!checkUser) return res.status(200).json({ status: 0, message: "Invalid credentials!", data: [] });

          else if (checkUser.isEmailVerified == 0) return res.status(200).json({ status: 0, message: "Please verify your account first", data: [] });

          if(checkUser.isEmailFactorAuth == 1){

            let emailFactorAuth= generateRandomNumber();
            const updateUser = yield dbSchema.User.updateOne({ _id: checkUser._id }, { $set: { emailFactorAuth:emailFactorAuth, emailFactorAuthTime: moment(new Date()).add(10, "minutes").format("YYYY-MM-DD HH:mm:ss")} });
            //const updateUser = yield dbSchema.User.updateOne({ _id: checkUser._id }, { $set: { userDeviceInfo: req.body.userDeviceInfo,emailFactorAuth:emailFactorAuth , lastLoginDate: new Date() } });
            sendEmail(emailFactorAuth, req.body.email.toLowerCase());
            return res.status(200).json({ status: 1, message: "Please check your email to get otp"});
    
    
          }else{
            var token = yield globalsFunctions.createTokenUser(checkUser._id);
            return res.status(200).json({ status: 1, token: token});
          }
          
        }


        

		//return res.status(200).json({ status: 1, message: alertMessages.success, data: { user: checkUser, token: token } });

    }).catch(function (err) {
      ////console.log(err)
      err = err && err.errorCode ? err : { errorCode: 500, errorMessage: err };
      return res.status(err.errorCode).json({ status: 0, message: err.errorMessage, data: [] });
    });

  },

  userLogin: function (req, res) {
    co(function* () {
console.log("userLogin--", req.body)
      if (!(req.body.email) && !(req.body.password)) return res.status(200).json({ status: 0, message: "Bad Request!", data: {} });
        var reqObject = { email: req.body.email.toLowerCase(), isDeleted: 0};
        var checkUser = yield dbSchema.User.findOne(reqObject,{etheriumAddress:0}).exec();
        if (!checkUser)
        {
          return res.status(200).json({ status: 0, message: "Email not found", data: {} });
        }
        else
        {
          if (bcrypt.compareSync(req.body.password, checkUser.password) == false){
            return res.status(200).json({ status: 0, message: "Email or Password is incorrect.", data: {} });
          }
          else if (checkUser.isEmailVerified == 0) {
            return res.status(200).json({ status: 0, message: "Please verify your account first", data: {} });
          }
        else if(checkUser.isEmailFactorAuth == 1){
          let emailFactorAuth= generateRandomNumber();
          const updateUser = yield dbSchema.User.updateOne({ _id: checkUser._id }, { $set: { emailFactorAuth:emailFactorAuth,emailFactorAuthTime: moment(new Date()).add(10, "minutes").format("YYYY-MM-DD HH:mm:ss")} });
          //const updateUser = yield dbSchema.User.updateOne({ _id: checkUser._id }, { $set: { userDeviceInfo: req.body.userDeviceInfo,emailFactorAuth:emailFactorAuth , lastLoginDate: new Date() } });
          sendEmail(emailFactorAuth, req.body.email.toLowerCase());
          return res.status(200).json({ status: 1, message: "Please check your email to get otp"});   
        }else{
          var token = yield globalsFunctions.createTokenUser(checkUser._id);
          delete checkUser.password;
          return res.status(200).json({ status: 1,  message: alertMessages.success, user: checkUser, token: token });
        }
  }
    }).catch(function (err) {
      ////console.log(err)
      err = err && err.errorCode ? err : { errorCode: 500, errorMessage: err };
      return res.status(err.errorCode).json({ status: 0, message: err.errorMessage, data: {} });
    });

  },

  userDelete: function (req, res) {
    co(function* () {
      console.log("calling user delte", req.body, req.userId)
      let userId= req.userId;
      var reqObject = { _id:userId};
        var checkUser = yield dbSchema.User.updateOne(reqObject,{$set:{isDeleted:1, etheriumAddress:""}}).exec();
        return res.status(200).json({ status: 1, message: "Success"});  
    }).catch(function (err) {
      ////console.log(err)
      err = err && err.errorCode ? err : { errorCode: 500, errorMessage: err };
      return res.status(err.errorCode).json({ status: 0, message: err.errorMessage, data: {} });
    });

  },


 userOtpVerification: function (req, res) { 
    co(function* () {

      ////console.log(req.body,"========otp");
      if (!(req.body.email) && !(req.body.otp)) return res.status(200).json({ status: 0, message: "Bad Request!", data: {} });

    var reqObject = { email: req.body.email.toLowerCase(),$or:[ {emailVerificationToken: req.body.otp}, {emailFactorAuth: req.body.otp }]};
        var checkUser = yield dbSchema.User.findOne(reqObject,{password:0, etheriumAddress:0}).exec();
        if (!checkUser)  return res.status(200).json({ status: 0, message: "Invalid otp!", data:  {} });

//console.log(moment(new Date()).format("YYYY-MM-DD HH:mm:ss"));
//console.log(checkUser.emailFactorAuthTime,"checkUser.emailFactorAuthTime");
        if(moment(new Date()).format("YYYY-MM-DD HH:mm:ss") > checkUser.emailFactorAuthTime){
          return res.status(200).json({ status: 0, message: "Verification code has been expired!", data:  {} });
        }
        else{
          var token = yield globalsFunctions.createTokenUser(checkUser._id);
          ////console.log(checkUser);
      const updateUser = yield dbSchema.User.updateOne({ _id: checkUser._id }, { $set: { userDeviceInfo: req.body.userDeviceInfo,isEmailVerified:1 , emailFactorAuthTime:"", lastLoginDate: new Date() ,emailVerificationToken:""} }).exec();
      // welcomeEmail(req.body.email.toLowerCase());
      //notifiction for user 
      var userNotification = new dbSchema.UserNotifications(
            {userId:checkUser._id,title: 'Login',description: 'Account Login Successfully',});
        yield userNotification.save();
      return res.status(200).json({ status: 1, message: alertMessages.success, data: { user: checkUser, token: token } });
}

    }).catch(function (err) {
      ////console.log(err)
      err = err && err.errorCode ? err : { errorCode: 500, errorMessage: err };
      return res.status(err.errorCode).json({ status: 0, message: err.errorMessage, data:  {} });
    });

  },
  userPhoneEmailOtpVerification: function (req, res) {
    co(function* () {
      if (!(req.body.email) && !(req.body.otp)) return res.status(200).json({ status: 0, message: "Bad Request!", data: [] });
    var reqObject = { email: req.body.email.toLowerCase(),emailFactorAuth: req.body.emailOtp };
        var checkUser = yield dbSchema.User.findOne(reqObject,
              {
                email : 1 ,
                firstName : 1
              }).exec();
        if (!checkUser)  return res.status(200).json({ status: 0, message: "Invalid otp!", data: [] });
          var token = yield globalsFunctions.createTokenUser(checkUser._id);
      const updateUser = yield dbSchema.User.updateOne({ _id: checkUser._id }, { $set: { userDeviceInfo: req.body.userDeviceInfo,emailFactorAuth:0 , lastLoginDate: new Date() } });
      // welcomeEmail(req.body.email.toLowerCase());
      //notifiction for user 
      var userNotification = new dbSchema.UserNotifications(
            {userId:checkUser._id,title: 'Login',description: 'Account Login Successfully',});
        yield userNotification.save();
      return res.status(200).json({ status: 1, message: alertMessages.success, data: { email : checkUser.email , firstName : checkUser.firstName, token: token } });


    }).catch(function (err) {
      ////console.log(err)
      err = err && err.errorCode ? err : { errorCode: 500, errorMessage: err };
      return res.status(err.errorCode).json({ status: 0, message: err.errorMessage, data: [] });
    });

  },


  userSignUp: function (req, res) {
    co(function* () {
      if (!(req.body.email) || !(req.body.password) || !(req.body.firstName)) return res.status(200).json({ status: 0, message: "Bad Request!", data: [] });
      var reqObject = { email: req.body.email.toLowerCase(),isDeleted:0};
      const checkUser = yield dbSchema.User.findOne(reqObject).exec();
      if (checkUser) return res.status(200).json({ status: 0, message: "Email already exist", data: {} });
      req.body.email = req.body.email.toLowerCase();
      req.body.emailFactorAuth = req.body.email.toLowerCase();
      req.body.emailVerificationToken= generateRandomNumber();
      req.body.emailFactorAuthTime= moment(new Date()).add(10, "minutes").format("YYYY-MM-DD HH:mm:ss");
      let hash = bcrypt.hashSync(req.body.password, saltRounds);
      req.body.password= hash;
      var newUser = new dbSchema.User(req.body);
      var user = yield newUser.save();
      sendEmail(req.body.emailVerificationToken, req.body.email.toLowerCase());
      if (!user) return res.status(400).json({ status: 0, message: alertMessages.userSaveError, data: {} });
      return res.status(200).json({ status: 1, message: "Please check your email to verify your account", data: {} });
    })
      .catch(function (err) {
        err = err && err.errorCode ? err : { errorCode: 500, errorMessage: err };
        return res.status(err.errorCode).json({ status: 0, message: err.errorMessage, data: [] });
      });

  },

    userUpdateProfile: function (req, res) {
    co(function* () {
console.log("userUpdateProfile--", req.body);
      let userId= req.userId;
      var reqObject = { _id: userId};
      let objToUpdate={};
      if(req.body.profileImage)
      {
        objToUpdate.profileImage = req.body.profileImage;
      }
      if(req.body.filename)
      {
        objToUpdate.profileImage = req.body.filename;
      }

      
       if(req.body.firstName)
      {
        objToUpdate.firstName = req.body.firstName;
      }
       if(req.body.lastName)
      {
        objToUpdate.lastName = req.body.lastName;
      }
      const updateUser = yield dbSchema.User.updateOne(reqObject, { $set:objToUpdate });
      //notifiction for user 
      var userNotification = new dbSchema.UserNotifications(
      {userId:userId,title: 'Profile update',description: 'Profile Updated',});
      yield userNotification.save();
      return res.status(200).json({ status: 1, message: "Profile Updated Successfully" });
    })
      .catch(function (err) {
        ////console.log('err ' ,err)
        err = err && err.errorCode ? err : { errorCode: 500, errorMessage: err };
        return res.status(err.errorCode).json({ status: 0, message: err.errorMessage, data: [] });
      });

  },

  getProfile: function (req, res) {
    co(function* () {

      let userId= req.userId;
    
      const user = yield dbSchema.User.findOne({_id: userId}, {password: 0},{});

      return res.status(200).json({ status: 1, message: "Success", data:user });
    })
      .catch(function (err) {
        err = err && err.errorCode ? err : { errorCode: 500, errorMessage: err };
        return res.status(err.errorCode).json({ status: 0, message: err.errorMessage, data: [] });
      });

  },

  getTokens: function (req, res) {
    co(function* () {

      let userId= req.userId;
    
      const settings = yield dbSchema.Settings.findOne({});
      let price= req.query.tokens / settings.tokenPrice;
      ////console.log(" price-------", price)
      return res.status(200).json({ status: 1, message: "Success", data:price });
    })
      .catch(function (err) {
        err = err && err.errorCode ? err : { errorCode: 500, errorMessage: err };
        return res.status(err.errorCode).json({ status: 0, message: err.errorMessage, data: [] });
      });

  },

  getAuthProcess: function (req, res) {
    co(function* () {

      let userId= req.userId;
    
      const data = yield dbSchema.User.findOne({_id: userId},{emailFactorAuth:1, isEmailFactorAuth:1 , isPhoneFactorAuth:1 ,phoneFactorAuth:1 , bioMatricAuth: 1, isBioMatricAuth: 1});
     
      return res.status(200).json({ status: 1, message: "Success", data:data });
    })
      .catch(function (err) {
        err = err && err.errorCode ? err : { errorCode: 500, errorMessage: err };
        return res.status(err.errorCode).json({ status: 0, message: err.errorMessage, data: [] });
      });

  },

  updateAuthProcess: function (req, res) {
    co(function* () {
      ////console.log('we are inside updateAuthProcess ' , req.body)
      let userId= req.userId;
      let type = req.body.auth_type;
      if(type == 'email'){
        const data = yield dbSchema.User.updateOne({_id: userId},
          {
            $set:{
              emailFactorAuth:req.body.emailFactorAuth, //email(string) / 0
              isEmailFactorAuth:req.body.isEmailFactorAuth , //1-0 
            }
          });
          if(req.body.isEmailFactorAuth == 1){
            return res.status(200).json({ status: 1, message: "Email Authentication Enabled Successfully", data:{} });
          }else{
            return res.status(200).json({ status: 1, message: "Email Authentication Disbled Successfully", data:{} });
          }
      }
      else if(type == 'phone'){
        // let User = yield dbSchema.User.findById(userId).exec();
        // if(User.isPhoneFactorAuth == 1){
        //   if(req.body.isPhoneFactorAuth == 0){
        //     const data = yield dbSchema.User.updateOne({_id: userId},
        //       {
        //         $set:{
        //           phoneFactorAuth:req.body.phoneFactorAuth, //email(string) / 0
        //           isPhoneFactorAuth:req.body.isPhoneFactorAuth , //1-0 
        //         }
        //       });
        //        return res.status(200).json({ status: 1, message: "Phone Authentication Disbled Successfully", data:{} });
        //   }
        // }else{
          const data = yield dbSchema.User.updateOne({_id: userId},
            {
              $set:{
                phoneFactorAuth:req.body.phoneFactorAuth, //email(string) / 0
                isPhoneFactorAuth:req.body.isPhoneFactorAuth , //1-0 
              }
            });

          if(req.body.isPhoneFactorAuth == 1){
            
            // let otp = generateRandomNumber();
            // smsHelper.smsrequest(req.body.phoneFactorAuth, country_code = '+91', otp)
            return res.status(200).json({ status: 1, message: "Phone Authentication Enabled Successfully", data:{} });
          }else{
            return res.status(200).json({ status: 1, message: "Phone Authentication Disbled Successfully", data:{} });
          }
        // }
      }
      else if( type == 'biometric'){
        const data = yield dbSchema.User.updateOne({_id: userId},
          {
            $set:{ 
              bioMatricAuth: req.body.bioMatricAuth, // 1-0
              isBioMatricAuth: req.body.isBioMatricAuth //1-0
            }
          });
          if(req.body.isBioMatricAuth == 1){
            return res.status(200).json({ status: 1, message: "BioMetric Authentication Enabled Successfully", data:{} });
          }else{
            return res.status(200).json({ status: 1, message: "BioMetric Authentication Disbled Successfully", data:{} });
          }
      }else{
        return res.status(200).json({ status: 0, message: "Please pass Auth param", data:{} });
      }
    })
      .catch(function (err) {
        err = err && err.errorCode ? err : { errorCode: 500, errorMessage: err };
        return res.status(err.errorCode).json({ status: 0, message: err.errorMessage, data: [] });
      });

  },
  updatePhoneAuthProcess: function (req, res) {
    co(function* () {
      
      let userId= req.userId; 
      let otp = generateRandomNumber();
      smsHelper.smsrequest(phone, country_code = '+91', otp)

      ////console.log('we are inside updatePhoneAuthProcess ' , otp)
      return res.status(200).json({ status: 1, message: "One Time Password Send on Your Mobile Number", data:{otp : otp} });
    })
      .catch(function (err) {
        err = err && err.errorCode ? err : { errorCode: 500, errorMessage: err };
        return res.status(err.errorCode).json({ status: 0, message: err.errorMessage, data: [] });
      });

  },
  otp_resend: function (req, res) {
    co(function* () {
      let phone = req.body.phoneFactorAuth;
      let otp = generateRandomNumber();
      smsHelper.smsrequest(phone, country_code = '+91', otp)
      return res.status(200).json({ status: 1, message: "One Time Password Send on Your Mobile Number", data:{otp : otp} });

    })
      .catch(function (err) {
        err = err && err.errorCode ? err : { errorCode: 500, errorMessage: err };
        return res.status(err.errorCode).json({ status: 0, message: err.errorMessage, data: [] });
      });

  },
  userChangePassword: function (req, res) {
    co(function* () {
      let userId= req.userId;
      var reqObject = { _id: userId};
        const checkUser = yield dbSchema.User.findOne(reqObject).exec();

      let objToUpdate={};
      if(req.body.oldPassword == checkUser.password)
      {
         const updateUser = yield dbSchema.User.updateOne(reqObject, { $set:{password: req.body.newPassword} });



      return res.status(200).json({ status: 1, message: "Successfully, updated!", data: {} });
      }
      else
      {
return res.status(200).json({ status: 0, message: "Invalid old password!", data: {} });
      }

    })
      .catch(function (err) {
        err = err && err.errorCode ? err : { errorCode: 500, errorMessage: err };
        return res.status(err.errorCode).json({ status: 0, message: err.errorMessage, data: {} });
      });

  },
  resetPasswordPost: function (req, res) {
    co(function* () {
      var reqObject = { resetPasswordToken: req.body.token};
         const updateUser = yield dbSchema.User.updateOne(reqObject, { $set:{password: req.body.password, resetPasswordToken: ""} });
      return res.status(200).json({ status: 1, message: "Successfully updated!", data: { } });
    })
      .catch(function (err) {
        err = err && err.errorCode ? err : { errorCode: 500, errorMessage: err };
        return res.status(err.errorCode).json({ status: 0, message: err.errorMessage, data: [] });
      });

  },

  resetPassword: function (req, res) {
  res.render('resetPassword',{});
  },

    thankYouPage: function (req, res) {
  res.render('thankYouPage',{});
  },

      linkExpiredPage: function (req, res) {
  res.render('linkExpiredPage',{});
  },




resendEmailVerification: function (req, res) {
    co(function* () {
      let email = req.body.email.toLowerCase();
      let emailVerificationToken= generateRandomNumber();
      sendEmail(emailVerificationToken,email);
      const checkUser = yield dbSchema.User.updateOne({email: email},{$set:{emailVerificationToken:emailVerificationToken, emailFactorAuthTime: moment(new Date()).add(10, "minutes").format("YYYY-MM-DD HH:mm:ss")}}).exec();
      return res.status(200).json({ status: 1, message: "Please check your email to verify your account", data: {} });
  }).catch(function (err) {
        err = err && err.errorCode ? err : { errorCode: 500, errorMessage: err };
        return res.status(err.errorCode).json({ status: 0, message: err.errorMessage, data: [] });
      });

  },

resendEmailOtp: function (req, res) {
    co(function* () {
      let email = req.body.email.toLowerCase();
      let emailFactorAuth= generateRandomNumber();
      sendEmail(emailVerificationToken,email);
      const checkUser = yield dbSchema.User.updateOne({email: email},{$set:{emailFactorAuth:emailFactorAuth, emailFactorAuthTime: moment(new Date()).add(10, "minutes").format("YYYY-MM-DD HH:mm:ss")}}).exec();
      return res.status(200).json({ status: 1, message: "Please check your email to verify your account", data: {} });
  }).catch(function (err) {
        err = err && err.errorCode ? err : { errorCode: 500, errorMessage: err };
        return res.status(err.errorCode).json({ status: 0, message: err.errorMessage, data: [] });
      });

  },
  resendPhoneOtp :  function (req, res) {
    co(function* () {
       
      let phoneFactorAuth = generateRandomNumber();
      let phone = req.body.phone;
      
      let user = yield dbSchema.User.findOne({phoneFactorAuth : phone },{phoneFactorAuth:1});
      
      if(user){ 
        smsHelper.smsrequest(phone, country_code = '+91', phoneFactorAuth)
        // yield dbSchema.User.updateOne({phoneNumber : phone},{$set:{phoneFactorAuth :phoneFactorAuth}}).exec();
        return res.status(200).json({ status: 1, message: "Otp Sent on your Phone registered with this account", data: {phoneOtp : phoneFactorAuth} });
      }else{
        return res.status(200).json({ status: 0, message: "Invalid Phone", });
      }
      
  }).catch(function (err) {
        err = err && err.errorCode ? err : { errorCode: 500, errorMessage: err };
        return res.status(err.errorCode).json({ status: 0, message: err.errorMessage, data: [] });
      });
  
  },
phoneEmailOtp: function (req, res) {
  co(function* () {
    
    let email = req.body.email.toLowerCase();
    let emailFactorAuth= generateRandomNumber();
    let phoneFactorAuth = generateRandomNumber();
    let phone = req.body.phone;
    
    let user = yield dbSchema.User.findOne({email : email , phoneFactorAuth : phone },{email:1});
    
    if(user){ 
      sendEmail(phoneFactorAuth,email); 
      smsHelper.smsrequest(phone, country_code = '+91', phoneFactorAuth)
      const updateUser = yield dbSchema.User.updateOne({ _id: user._id }, { $set: { emailFactorAuth:emailFactorAuth, emailFactorAuthTime: moment(new Date()).add(10, "minutes").format("YYYY-MM-DD HH:mm:ss")} });
      // yield dbSchema.User.updateOne({email: email,phoneNumber : phone},{$set:{emailFactorAuth:emailFactorAuth,phoneFactorAuth :phoneFactorAuth}}).exec();
      return res.status(200).json({ status: 1, message: "Otp Sent on Email & Your Phone registered with this account", data: {emailOtp: emailFactorAuth , phoneOtp : phoneFactorAuth} });
    }else{
      return res.status(200).json({ status: 0, message: "Invalid Phone Or Email", });
    }
    
}).catch(function (err) {
      err = err && err.errorCode ? err : { errorCode: 500, errorMessage: err };
      return res.status(err.errorCode).json({ status: 0, message: err.errorMessage, data: [] });
    });

},




forgotPassword: function (req, res) {
    co(function* () {
      let email = req.body.email.toLowerCase();
      let resetPasswordToken= generateRandomString();
      let user= yield dbSchema.User.findOne({email: email},{firstName:1, lastName:1});
      let name= user.firstName +" "+user.lastName;
      // sendForgotPassword("https://api-bioaro.virtualittechnology.com/v1/resetPassword?token="+resetPasswordToken,email);
      EmailHelper.forgotPasswordEmail("https://api-bioaro.virtualittechnology.com/v1/resetPassword?token="+resetPasswordToken,email,name); 
      const checkUser = yield dbSchema.User.updateOne({email: email},{$set:{resetPasswordToken:resetPasswordToken, resetPasswordAuthTime: moment(new Date()).add(10, "minutes").format("YYYY-MM-DD HH:mm:ss")}}).exec();
      return res.status(200).json({ status: 1, message: "Please check your email to reset your password", data: { } });
  }).catch(function (err) {
        err = err && err.errorCode ? err : { errorCode: 500, errorMessage: err };
        return res.status(err.errorCode).json({ status: 0, message: err.errorMessage, data: [] });
      });

  },


  // EmailHelper.sendGiftEmail({email : '349kuldeep@gmail.com' , 'name' : 'kuldeep sharma'});
  emailVerification: function (req, res) {
    co(function* () {
      if (!(req.body.email)) return res.status(200).json({ status: 0, message: "Bad Request!", data: {} });

      var reqObject = { email: req.body.email.toLowerCase()};
      var getResult= yield dbSchema.User.findOne(reqObject);
      if(!getResult){
        return res.status(200).json({ status: 0, message: "Email not found", data: {} });
      }



      if(!(req.body.otp)){ 
      const checkUser = yield dbSchema.User.updateOne(reqObject,{$set:{isEmailVerified: 1,emailVerificationToken:"",emailFactorAuthTime:""}}).exec();       
      EmailHelper.welcomeEmail(req.body.email.toLowerCase());
        if(getResult.etheriumAddress &&  Object.keys(getResult.etheriumAddress).length > 0){

        }else{
          let walletData = yield BnBHelper.generateBnbAddress(); 
            yield dbSchema.User.updateOne(reqObject,{ $set: { etheriumAddress: {address:walletData.address , private_key:  Buffer.from(walletData.private_key).toString('base64')} } });
         
            yield tokenHeloper.anrySend(
             walletData.address,
             12
        );
         
            walletData.name = getResult.firstName + ' ' + getResult.lastName ;
            walletData.email = getResult.email;
            EmailHelper.sendWalletKeyMail(walletData); 
            EmailHelper.sendGiftEmail(walletData);
            let transactionData = {
              userId : getResult._id,
              amount : parseInt(12),
              type : 'BONUS_TOKENS',
              description : 'Registration bonus'
            }
            let Transaction = new dbSchema.Transactions(transactionData);
            yield Transaction.save(); 
            // //console.log('bonus token transactions ' , transactionData )
            yield dbSchema.User.updateOne(
                            {_id: getResult._id},
                            {
                              $inc:
                              {walletCoins: parseInt(12)}, 
                            });
        }

       

       var token = yield globalsFunctions.createTokenUser(getResult._id);
      if (checkUser) return res.status(200).json({ status: 200, message: "Email successfully verified! You can login now",token : token });
    }

    // if otp in the request
    else{
      if(req.body.otp != getResult.emailVerificationToken)
      {
  return res.status(200).json({ status: 0, message: "Invalid verification code.!" });
      }
      else if(moment(new Date()).format("YYYY-MM-DD HH:mm:ss") > getResult.emailFactorAuthTime){
return res.status(200).json({ status: 0, message: "Verification code has been expired!" });
      }
      else{
      const checkUser = yield dbSchema.User.updateOne(reqObject,{$set:{isEmailVerified: 1,emailVerificationToken:"",emailFactorAuthTime: ""}}).exec();       
      EmailHelper.welcomeEmail(req.body.email.toLowerCase());
        if(getResult.etheriumAddress &&  Object.keys(getResult.etheriumAddress).length > 0){

        }else{
          let walletData = yield BnBHelper.generateBnbAddress(); 
          yield dbSchema.User.updateOne(reqObject,{ $set: { etheriumAddress: {address: walletData.address , private_key:  Buffer.from(walletData.private_key).toString('base64')} } });

          yield tokenHeloper.anrySend(
             walletData.address,
             12
       );
            walletData.name = getResult.firstName + ' ' + getResult.lastName ;
            walletData.email = getResult.email;
            EmailHelper.sendWalletKeyMail(walletData); 
            EmailHelper.sendGiftEmail(walletData);
            let transactionData = {
              userId : getResult._id,
              amount : parseInt(12),
              type : 'BONUS_TOKENS',
              description : 'Registration bonus'
            }
            let Transaction = new dbSchema.Transactions(transactionData);
            yield Transaction.save(); 
            // //console.log('bonus token transactions ' , transactionData )
            yield dbSchema.User.updateOne(
                            {_id: getResult._id},
                            {
                              $inc:
                              {walletCoins: parseInt(12)}, 
                            });
        }

       

       var token = yield globalsFunctions.createTokenUser(getResult._id);
      if (checkUser) return res.status(200).json({ status: 200, message: "Email successfully verified! You can login now",token : token });

}

    }


      }).catch(function (err) {
        //console.log('err' ,err)
        err = err && err.errorCode ? err : { errorCode: 500, errorMessage: err };
        return res.status(err.errorCode).json({ status: 0, message: err.errorMessage, data: {} });
      });

  },

 


  checkResetPasswordWebToken: function (req, res) {
    co(function* () {
      var reqObject = { resetPasswordToken: req.body.token};
      var getResult= yield dbSchema.User.findOne(reqObject);
      if(!getResult){
        return res.status(200).json({ status: 0, message: "Email not found", data: {} });
      }
      //console.log("fffffffffffff", moment(new Date()).format("YYYY-MM-DD HH:mm:ss"), getResult.resetPasswordAuthTime)
      if(moment(new Date()).format("YYYY-MM-DD HH:mm:ss") > getResult.resetPasswordAuthTime){
return res.status(200).json({ status: 0, message: "Verification code has been expired!" });
      }
      else{
return res.status(200).json({ status: 1, message: "Success!" });
}

      }).catch(function (err) {
        //console.log('err' ,err)
        err = err && err.errorCode ? err : { errorCode: 500, errorMessage: err };
        return res.status(err.errorCode).json({ status: 0, message: err.errorMessage, data: {} });
      });

  },

  

  userLogout: function (req, res) {
    co(function* () {

       let userId= req.userId;

      var reqObject = { _id: userId };
      const checkUser = yield dbSchema.User.findOne(reqObject).exec();
      if (!checkUser) return res.status(200).json({ status: 0, message: alertMessages.NoAccount, data: [] });

      const updateUser = yield dbSchema.User.updateOne({ _id: checkUser._id }, { $set: { userDeviceInfo: [] } });

      return res.status(200).json({ status: 1, message: alertMessages.success });

    }).catch(function (err) {
      ////console.log(err)
      err = err && err.errorCode ? err : { errorCode: 500, errorMessage: err };
      return res.status(err.errorCode).json({ status: 0, message: err.errorMessage, data: [] });
    });

  },



  addContactUs: function (req, res) {
    //console.log("req----add contact us", req.body);
    co(function* () {
      let reqObj= req.body;
      if(reqObj.captchaSet == false){
         return res.status(200).json({ status: 0, message: "Captcha failed!" });
      }
      else{
        //console.log("else part", reqObj)
      delete reqObj.captchaSet;
      //console.log("reqObject-------", reqObj);
      let data= new dbSchema.ContactUs(reqObj); 
      yield data.save();
      contactEmailToUser(reqObj, reqObj.email.toLowerCase());
      contactEmailToAdmin(reqObj, "admin@anryton.com");
      return res.status(200).json({ status: 1, message: alertMessages.success });
}
    }).catch(function (err) {
      ////console.log(err)
      err = err && err.errorCode ? err : { errorCode: 500, errorMessage: err };
      return res.status(err.errorCode).json({ status: 0, message: err.errorMessage, data: [] });
    });

  },



} 



function generateRandomString()
{
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

  for (var i = 0; i < 16; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  return text;
}



function generateRandomNumber()
{
   var minm = 100000;
    var maxm = 999999;
  var text=  Math.floor(Math
    .random() * (maxm - minm + 1)) + minm;
    return text;
}





function contactEmailToUser(data , emailAddress){
  var postmark = require("postmark");
  var client = new postmark.ServerClient(process.env.POSTMARK_TOKEN);
  let template = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Thank You for Reaching Out to Anryton</title>
</head>
<body>
  <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
    <!-- Company Logo -->
    <img src="https://anryton-assets-dev.s3.amazonaws.com/logo.jpg" alt="Anryton Logo" style="max-width: 100%; height: auto;">

    <!-- Email Content -->
    <h2>Thank You for Reaching Out to Anryton</h2>
    <p>Dear ${data.name},</p>
    <p>Thank you for contacting Anryton. We appreciate you taking the time to reach out, and we’re here to assist you with any questions, concerns, or feedback you might have. Your satisfaction and support are our top priorities, and we're committed to providing you with the best service possible.</p>
    <p>We have received your inquiry and are currently reviewing the details you provided. A member of our customer support team will be in touch with you shortly (typically within 24 hours) to provide a personalized response and assist further.</p>
    <p>While you await our response, you can visit our FAQ page for answers to common questions about our products, services, ANRY token, and more.</p>
    <p>If your inquiry is urgent or you prefer to speak directly with our customer service team, you can reach us at:</p>
    <ul>
      <li>Email: support@anryton.com</li>
    </ul>
    <p>Thank you for choosing Anryton. We're looking forward to assisting you and ensuring your experience with us is nothing short of excellent.</p>
    <p>Warm regards,</p>
    <p>Customer Support Team<br>Anryton<br><a href="https://anryton.com">Anryton.com</a> | support@anryton.com</p>
  </div>
</body>
</html>`;
    client.sendEmail({
      "From": 'support@anryton.com',
      "To": emailAddress,
      "Subject": "Thank You for Reaching Out to Anryton",
      "HtmlBody": template, 
    }).then((resp) => {}).catch((error) => console.log("error" , error));
 
}


function contactEmailToAdmin(data , emailAddress){
  var postmark = require("postmark");
  var client = new postmark.ServerClient(process.env.POSTMARK_TOKEN);
  let template = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Contact Form Submission</title>
</head>
<body>
  <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
   <img src="https://anryton-assets-dev.s3.amazonaws.com/logo.jpg" alt="Anryton Logo" style="max-width: 100%; height: auto;">

    <!-- Email Content -->

    <h2>New Contact Form Submission</h2>
    <p><strong>Name:</strong> ${data.name}</p>
    <p><strong>Email:</strong>  ${data.email}</p>
    <p><strong>Comment:</strong><br> ${data.comment}</p>
    <p>
Please review the inquiry and assign it to the appropriate team or individual for a prompt response. If further information is needed, consider reaching out to the customer directly through the provided email address.
</p> <br>

<p>Ensure to follow up on this inquiry within our standard response time to maintain our commitment to excellent customer service. For tracking purposes, this submission has been logged in our system under the reference number: ${data.id}.
</p> <br>


    <p>Thank you for your attention to this matter.</p> <br>

    <p> Best regards,
</p>
Team Anryton
  </div>
</body>
</html>`;
    client.sendEmail({
      "From": 'support@anryton.com',
      "To": emailAddress,
      "Subject": "New Contact Form Submission",
      "HtmlBody": template,
    }).then((resp) => {}).catch((error) => console.log("error" , error));
 
}

function sendEmail(link , emailAddress){
  var postmark = require("postmark");
  var client = new postmark.ServerClient(process.env.POSTMARK_TOKEN);
  let template = `<html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Activate  Your Email</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet"
            integrity="sha384-GLhlTQ8iRABdZLl6O3oVMWSktQOp6b7In1Zl3/Jr59b6EGGoI1aFkw7cmDA6j6gD" crossorigin="anonymous">
        <style type="text/css">
            @media only screen and (max-width: 480px) {
                table {
                    display: block !important;
                    width: 100% !important;
                }

                td {
                    width: 480px !important;
                }
            }
        </style>
    </head>
    <body>
      <div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
        <div style="margin:50px auto;width:70%;padding:20px 0">
          <div style="border-bottom:1px solid #eee">
            <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">
            <img width="200" src="https://anryton-assets-dev.s3.amazonaws.com/logo.jpg" title="logo" alt="logo">
            </a>
          </div>
          <p style="font-size:1.1em">Hi,</p>
          <p>Thank you for choosing Anryton. Use the following Verification Code to complete your Sign Up procedures. Verification  is valid for 10 minutes</p>
          <h2 style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;" >${link}</h2>
          If you didn't request this, you can ignore this email or let us know.
          <p style="font-size:0.9em;">Regards,<br />Team Anryton</p>
          <hr style="border:none;border-top:1px solid #eee" />
            <div class="social" style="text-align: center;">
              <a style="-webkit-border-radius:50%; border-radius:50%; display:inline-block; height:35px; margin:0 0.215em; width:35px;"
                onmouseover="this.style.backgroundColor='#CEBCA7'"
                onmouseout="this.style.backgroundColor='#C7B39A'"
                href="https://www.facebook.com/profile.php?id=100086026382486">
                <img src="https://cdn-icons-png.flaticon.com/512/20/20673.png" style="width:100%">
                
              </a>
              <a style="-webkit-border-radius:50%; border-radius:50%; display:inline-block; height:35px; margin:0 0.215em; width:35px;"
                onmouseover="this.style.backgroundColor='#CEBCA7'"
                onmouseout="this.style.backgroundColor='#C7B39A'"
                href="hhttps://twitter.com/Anry_ton">
                <img src="https://cdn-icons-png.flaticon.com/512/2168/2168336.png" style="width:100%">
                
              </a>
              <a style="-webkit-border-radius:50%; border-radius:50%; display:inline-block; height:35px; margin:0 0.215em; width:35px;"
                onmouseover="this.style.backgroundColor='#CEBCA7'"
                onmouseout="this.style.backgroundColor='#C7B39A'"
                href="https://in.pinterest.com/anryton/">
                <img src="https://cdn-icons-png.flaticon.com/128/2175/2175205.png" style="width:100%">
              </a>

              <a style="-webkit-border-radius:50%; border-radius:50%; display:inline-block; height:35px; margin:0 0.215em; width:35px;"
                onmouseover="this.style.backgroundColor='#CEBCA7'"
                onmouseout="this.style.backgroundColor='#C7B39A'"
                href="https://ae.linkedin.com/company/anryton">
                <img src="https://cdn-icons-png.flaticon.com/128/3669/3669739.png" style="width:100%">
              </a>
              
            </div>
           
          </div>
        </div>
      </body>
      <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js"integrity="sha384-w76AqPfDkMBDXo30jS1Sgez6pr3x5MlQ1ZAGC+nuZB+EYdgRZgiwxhTBTkF7CXvN" crossorigin="anonymous"></script>
    </html>`;
    client.sendEmail({
      "From": 'support@anryton.com',
      "To": emailAddress,
      "Subject": "Email Verification",
      "HtmlBody": template,
    }).then((resp) => {}).catch((error) => console.log("error" , error));
 
}




