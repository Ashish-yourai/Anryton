let dbSchema= require('./../config/config')
const Joi = require('joi')
const requestIp = require('request-ip');
const validateIpAddress = async (req, res, next)  => {
    let ip = requestIp.getClientIp(req); 
    //console.log({ip :ip})
    let ipExists = await dbSchema.AuthorzationIps.findOne({ip :ip}); 
    if(ipExists){
      req.body.ip = ip
      next();
    }else{
      return res.status(200).send({ success : 0 ,message: "your IP "+ ip +" not whitelisted!" });
    }
    
}
const signupValidation = data => {
  const schema = Joi.object({
      email: Joi.string().pattern(new RegExp('@')).required(),
      password: Joi.string().min(6).max(15).required(),
      firstName: Joi.string().required(),
      // country_code: Joi.string().required(),
  }).unknown();
  return schema.validate(data);
}

const contactUsValidation = data => {
  const schema = Joi.object({
      email: Joi.string().pattern(new RegExp('@')).required(),
      name: Joi.string().min(2).max(50).required(),
      comment: Joi.string().required(),
  }).unknown();
  return schema.validate(data);
}

const saveIpvalidation = data => {
    const schema = Joi.object({
      ip: Joi.string().ip({
        version: ['ipv4']
      })
    });
    return schema.validate(data);
}
 
const emailOtpVerification = data => {
  const schema = Joi.object({
    email: Joi.string().pattern(new RegExp('@')).required(),
    otp: Joi.string().min(6).max(6).required(),
  }).unknown();
  return schema.validate(data);
}

const resendEmailValidation  = data => {
  const schema = Joi.object({
    email: Joi.string().pattern(new RegExp('@')).required(), 
  }).unknown();
  return schema.validate(data);
}
const fileReturnValidation = data => {
  const schema = Joi.object({
    file: Joi.string().required(), 
  }).unknown();
  return schema.validate(data);
}
module.exports = {
    validateIpAddress: validateIpAddress,
    contactUsValidation: contactUsValidation,
    saveIpvalidation: saveIpvalidation,
    signupValidation : signupValidation,
    emailOtpVerification : emailOtpVerification,
    resendEmailValidation : resendEmailValidation,
    fileReturnValidation : fileReturnValidation,
}