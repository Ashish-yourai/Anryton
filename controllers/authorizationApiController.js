let dbSchema = require("../config/config");
const {
  saveIpvalidation,
  signupValidation,
  emailOtpVerification,
  resendEmailValidation,
  fileReturnValidation,
} = require("./../middleware/validateIp");
let EmailHelper = require("./../helpers/Email.helper");
const jwt = require("jsonwebtoken");
let co = require("co");
let alertMessages = require("../config/alertMessages.js");
const aws = require("aws-sdk");
let anrytonHelper = require("../helpers/anryton.helper");
aws.config.setPromisesDependency();

aws.config.update({
  secretAccessKey: process.env.S3_SECRET_KEY,
  accessKeyId: process.env.S3_ACCESS_KEY,
  region: process.env.S3_REGION,
});
const s3 = new aws.S3();
const { create } = require("ipfs-http-client");
async function ipfsClient() {
  const ipfs = await create({
    host: "127.0.0.1",
    port: 5001,
    protocol: "http",
  });
  return ipfs;
}
let request = require("request");
const save_ip_address = async (req, res) => {
  const { error } = saveIpvalidation(req.body);
  if (error) {
    res.send({ success: 0, message: error.details[0].message });
  } else {
    try {
      let ip = req.body.ip;
      // console.log("data ", {
      //   ip: ip,
      // });

      const bucketName = "anryton-assets-dev";
      const directoryName = ip + "/sample.txt";
      s3.putObject(
        {
          Bucket: bucketName,
          Key: directoryName,
          Body: "",
        },
        (err, data) => {
          if (err) {
            console.error("Error creating directory:", err);
          } else {
            //console.log("Directory created successfully:", data);
          }
        }
      );
      await dbSchema.AuthorzationIps.create({
        ip: ip,
      });
      res.send({ success: 1, message: "IP Successfully Created" });
    } catch (err) {
      //console.log(err);
      res.send({ success: 0, message: "error" });
    }
  }
};

let whitelist_ips = async (req, res) => {
  let ips = await dbSchema.AuthorzationIps.find({}, { name: 1, ip: 1 });
  res.json({ status: 1, message: "data found ", ips: ips });
};

const signup = async (req, res) => {
  const { error } = signupValidation(req.body);
  if (error) {
    return res
      .status(200)
      .json({ status: 0, message: error.details[0].message, data: {} });
  } else {
    let user = await dbSchema.User.findOne({
      email: req.body.email.toLowerCase(),
    });
    if (!user) {
      let email = req.body.email.toLowerCase();
      let firstName = req.body.firstName;
      let emailVerificationToken = generateRandomNumber();
      let emailFactorAuth = req.body.email.toLowerCase();
      let password = req.body.password;
      var newUser = new dbSchema.User({
        email: email,
        emailFactorAuth: emailFactorAuth,
        emailVerificationToken: emailVerificationToken,
        firstName: firstName,
        password: password,
      });
      await newUser.save();
      EmailHelper.sendLiveEmail(emailVerificationToken, email);
      return res
        .status(200)
        .json({
          status: 1,
          message: "Please check your email to verify your account",
          data: { otp: req.body.emailVerificationToken },
        });
    } else {
      return res
        .status(200)
        .json({ status: 0, message: "Email already exist", data: {} });
    }
  }
};
const resend_email_verification = async (req, res) => {
  const { error } = resendEmailValidation(req.body);
  if (error) {
    return res
      .status(200)
      .json({ status: 0, message: error.details[0].message, data: {} });
  } else {
    let user = await dbSchema.User.findOne({
      email: req.body.email.toLowerCase(),
    });
    if (user) {
      let email = req.body.email.toLowerCase();
      let emailVerificationToken = generateRandomNumber();
      const updateUser = await dbSchema.User.updateOne(
        { _id: user._id },
        {
          $set: {
            emailVerificationToken: emailVerificationToken,
          },
        }
      ).exec();
      EmailHelper.sendLiveEmail(emailVerificationToken, email);
      return res
        .status(200)
        .json({ status: 1, message: "A One Time OTP sent on your email" });
    } else {
      return res
        .status(200)
        .json({ status: 0, message: "Invali Email", data: {} });
    }
  }
};
const email_verification = async (req, res) => {
  const { error } = emailOtpVerification(req.body);
  if (error) {
    return res
      .status(200)
      .json({ status: 0, message: error.details[0].message, data: {} });
  } else {
    let reqObject = {
      email: req.body.email.toLowerCase(),
      $or: [
        { emailVerificationToken: req.body.otp },
        { emailFactorAuth: req.body.otp },
      ],
    };
    var checkUser = await dbSchema.User.findOne(reqObject);
    if (checkUser) {
      var token = await createToken(checkUser._id);
      ////console.log(checkUser);
      const updateUser = await dbSchema.User.updateOne(
        { _id: checkUser._id },
        {
          $set: {
            userDeviceInfo: req.body.userDeviceInfo,
            isEmailFactorAuth: 0,
            isEmailVerified: 1,
            lastLoginDate: new Date(),
            emailVerificationToken: "",
          },
        }
      ).exec();
      var userNotification = new dbSchema.UserNotifications({
        userId: checkUser._id,
        title: "Login",
        description: "Account Login Successfully",
      });
      await userNotification.save();
      return res
        .status(200)
        .json({
          status: 1,
          message: alertMessages.success,
          data: { token: token },
        });
    } else {
      return res
        .status(200)
        .json({ status: 0, message: "Invalid otp!", data: [] });
    }
  }
};

function createToken(userId) {
  return new Promise(function (resolve, reject) {
    co(function* () {
      var token = jwt.sign(
        {
          id: userId,
          algorithm: "HS256",
          exp: 864000000000000,
        },
        dbSchema.SecurityKey
      );
      resolve(token);
    }).catch(function (err) {
      ////console.log(err)
      err = err && err.errorCode ? err : { errorCode: 500, errorMessage: err };
      reject(err);
    });
  });
}

function generateRandomNumber() {
  var minm = 100000;
  var maxm = 999999;
  var text = Math.floor(Math.random() * (maxm - minm + 1)) + minm;
  return text;
}

const upload_file = async (req, res) => {
  var file = req.files.myfile;
  let ip = req.body.ip;
  let fileName = Math.floor(Date.now() / 1000) + "___" + file.name;
  let userId = req.userId;
  //console.log("here is ip ", ip);
  var params = {
    Bucket: "anryton-assets-dev",
    Body: file.data,
    ContentType: file.mimetype,
    Key: ip + "/" + fileName,
    ACL: "public-read",
  };
  //console.log(ip, "params-------", params);

  s3.upload(params, async function (err, data) {
    if (err) {
      //console.log("Error occured while trying to upload to S3 bucket", err);
      res.json(err);
    } else {
      // //console.log(data.Location,'file uploaded properly now', file.size);
      data.fileSize = file.size;
      let obj = {
        fileName: data.Key,
        fullUrl: data.Key,
        directory: ip,
        fileSize: data.fileSize || "",
        userId: userId,
        data: [], //result
      };

      var newData = new dbSchema.Files(obj);
      await newData.save();
      res
        .status(200)
        .json({
          success: true,
          message: "file uploaded successfully",
          data: "https://secure.anryton.com/?file=" + data.Key,
        });
      //console.log(newData._id, "main location ", data.Location);
      updateNewNftData(data.Location, file._id);
    }
  });
};

let updateNewNftData = (link, nft_id) => {
  // //console.log({link : link , nft_id : nft_id ,version : version})
  request.get(link, async function (err, ress, body) {
    //console.log("=======> err", err);
    let options = {
      warpWithDirectory: false,
      progress: (prog) => console.log(`Saved :${prog}`),
    };
    let ipfs = await ipfsClient();
    let result = await ipfs.add(body, options);
    ////console.log("result----------", result)
    let stringResp = await anrytonHelper.WRITE_STRING(result.path);
    //console.log("stringResp", stringResp.transactionHash); //store this hash in files table
    let obj = { data: result };
    var newData = await dbSchema.Files.updateOne(
      { _id: nft_id },
      { $set: obj }
    );
  });
};
const uploaded_file = async (req, res) => {
  var params = {
    Bucket: "anryton-assets-dev",
    Prefix: "101.188.67.134",
  };
  try {
    s3.listObjectsV2(params, (err, data) => {
      if (err) {
        console.error("Error listing objects:", err);
        res.status(200).json({ success: false, message: err, files: [] });
      } else {
        //console.log("Files in the directory:", data.Contents);
        let files = [];
        let i = 0;
        for (let file of data.Contents) {
          // //console.log('f ' + JSON.parse(JSON.stringify(file)).Key)
          files.push({ path: JSON.parse(JSON.stringify(file)) });
          i++;
        }
        res
          .status(200)
          .json({ success: false, message: "files found", files: files });
      }
    });
    // return res.status(200).json(resp);
  } catch (e) {
    //console.log("its error ", e);
    return res.status(200).json({ status: 0, message: "failed", data: e });
  }
};

const uploaded_single_file = async (req, res) => {
  let ip = req.body.ip;
  const { error } = fileReturnValidation(req.body);
  if (error) {
    res.send({ success: 0, message: error.details[0].message });
  } else {
    let file_name = req.body.file_name;
    var params = {
      Bucket: "anryton-assets-dev",
      Key: ip + "/" + file_name,
    };
    try {
      s3.getObject(params, (err, data) => {
        if (err) {
          console.error("Error fetching S3 object:", err);
          res
            .status(500)
            .json({ status: 0, message: "Error while fetching Image" });
        } else {
          // Set appropriate headers and serve the object data
          res.set({
            "Content-Type": data.ContentType,
            "Content-Length": data.ContentLength,
          });
          res.send(data.Body);
        }
      });
    } catch (e) {
      //console.log("its error ", e);
      return res.status(200).json({ status: 0, message: "failed", data: e });
    }
  }
};
module.exports = {
  save_ip_address: save_ip_address,
  whitelist_ips: whitelist_ips,
  signup: signup,
  email_verification: email_verification,
  resend_email_verification: resend_email_verification,
  upload_file: upload_file,
  uploaded_file: uploaded_file,
  uploaded_single_file: uploaded_single_file,
};
