var loginSignupController = require("../controllers/loginSignupController.js");
var folderFile = require("../controllers/folderFilesController.js");
var admin = require("../controllers/adminController.js");
let nftControler = require("../controllers/nftController.js");
let stripeControler = require("../controllers/stripePayments.js");
let authorizationController = require("../controllers/authorizationApiController.js");
const { headerValidate, authJwt, ValidateIp } = require("../middleware");

const blogApi = require("../controllers/blogCtrl.js");
const category = require("../controllers/categoryCtrl.js");
module.exports = function (app) {
  // Admin API Routes
  app.route("/v1/createCategory").post(headerValidate.checkHeader,authJwt.verifyToken,category.createCategory);
  app.route("/v1/getCategories").get(headerValidate.checkHeader,authJwt.verifyToken,category.getCategories);
  app.route("/v1/getCategoriesV1").get(category.getCategories);
  app.route("/v1/updateCategory").put(headerValidate.checkHeader,authJwt.verifyToken,category.updateCategory);
  app.route("/v1/deleteCategory").delete(headerValidate.checkHeader,authJwt.verifyToken,category.deleteCategory);
  app.route("/v1/enableDisablePayment").get(headerValidate.checkHeader,authJwt.verifyToken,category.enableDisablePayment);

  app.route("/v1/createBlog").post(headerValidate.checkHeader,authJwt.verifyToken,blogApi.createBlog);
  app.route("/v1/getBlogs").get(headerValidate.checkHeader,authJwt.verifyToken,blogApi.getBlogs);
  app.route("/v1/getBlogsV1").get(blogApi.getBlogs);
  app.route("/v1/updateBlog").put(headerValidate.checkHeader,authJwt.verifyToken,blogApi.updateBlog);
  app.route("/v1/deleteBlog").delete(headerValidate.checkHeader,authJwt.verifyToken,blogApi.deleteBlog);

  app.route("/v1/superAdminLogin").post(authJwt.verifyToken,admin.superAdminLogin);
  app.route("/v1/getAllTransections").post(authJwt.verifyToken,admin.getAllTransections);
  app.route("/v1/getAllUsers").post(authJwt.verifyToken,admin.getAllUsers);
  app.route("/v1/getUserDetails").post(authJwt.verifyToken,admin.getUserDetails);
  app.route("/v1/getAllUsersList").post(authJwt.verifyToken,admin.getAllUsersList);
  app.route("/v1/getSettingDetails").post(authJwt.verifyToken,admin.getSettingDetails);
  app.route("/v1/getUsersById/:id").get(authJwt.verifyToken,admin.getUsersById);
  app.route("/v1/deactivateUser").post(authJwt.verifyToken,admin.deactivateUser);
  app.route("/v1/addContent").post(authJwt.verifyToken,admin.addContent);
  app.route("/v1/getContent").post(authJwt.verifyToken,admin.getContent);
  app.route("/v1/getContentDetails").post(authJwt.verifyToken,admin.getContentDetails);
  app.route("/v1/deleteContent").post(authJwt.verifyToken,admin.deleteContent);
  app.route("/v1/updateContent").post(authJwt.verifyToken,admin.updateContent);
  app.route("/v1/getServices").post(authJwt.verifyToken,admin.getServices);
  app.route("/v1/getServiceDetails").post(authJwt.verifyToken,admin.getServiceDetails);
  app.route("/v1/addServices").post(authJwt.verifyToken,admin.addServices);
  app.route("/v1/updateServices").post(authJwt.verifyToken,admin.updateServices);
  app.route("/v1/deleteService").post(authJwt.verifyToken,admin.deleteService);
  app.route("/v1/getSettings").post(authJwt.verifyToken,admin.getSettings);
  app.route("/v1/updateTokenPrice").post(authJwt.verifyToken,admin.updateTokenPrice);
  app.route("/v1/counts").post(authJwt.verifyToken,admin.counts);
  app.route("/v1/saveNotification").post(authJwt.verifyToken,admin.saveNotification);
  app.route("/v1/getNotification").post(authJwt.verifyToken,admin.getNotification);
  app.route("/v1/getNotificationDetails").post(authJwt.verifyToken,admin.getNotificationDetails);
  app.route("/v1/updateNotification").put(authJwt.verifyToken,admin.updateNotification);
  app.route("/v1/deleteNotification").post(authJwt.verifyToken,admin.deleteNotification);



  app.route("/v1/getBanners").post(authJwt.verifyToken,admin.getBanners);
  app.route("/v1/getBannerDetails").post(authJwt.verifyToken,admin.getBannerDetails);
  app.route("/v1/addBanners").post(authJwt.verifyToken,admin.addBanners);
  app.route("/v1/updateBanners").post(authJwt.verifyToken,admin.updateBanners);
  app.route("/v1/deleteBanner").post(authJwt.verifyToken,admin.deleteBanner);

  // Plans
  app.route("/v1/getPlans").get(authJwt.verifyToken,admin.getPlans);
  app.route("/v1/addPlan").post(authJwt.verifyToken,admin.addPlan);
  app.route("/v1/updatePlan").post(authJwt.verifyToken,admin.updatePlan);
  app.route("/v1/deletePlan").post(authJwt.verifyToken,admin.deletePlan);

  // User API Routes
  app.route("/v1/resetPassword").get(loginSignupController.resetPassword);
  app.route("/thank-you").get(loginSignupController.thankYouPage);
  app.route("/link-expired").get(loginSignupController.linkExpiredPage);
  app.route("/v1/resetPasswordPost").post(headerValidate.checkHeader,loginSignupController.resetPasswordPost);
  app.route("/v1/checkResetPasswordWebToken").post(headerValidate.checkHeader,loginSignupController.checkResetPasswordWebToken);
  app.route("/v1/getTokenFromEmail").post(headerValidate.checkHeader,loginSignupController.getTokenFromEmail);
  app.route("/v1/emailVerification").post(headerValidate.checkHeader,loginSignupController.emailVerification);
  app.route("/v1/userSignUp").post(headerValidate.checkHeader,loginSignupController.userSignUp);
  app.route("/v1/userLogin").post(headerValidate.checkHeader,loginSignupController.userLogin);
  app.route("/v1/userDelete").put(headerValidate.checkHeader,[authJwt.verifyToken],loginSignupController.userDelete);
  app.route("/v1/userOtpVerification").post(headerValidate.checkHeader,loginSignupController.userOtpVerification);
  app.route("/v1/userPhoneEmailOtpVerification").post(headerValidate.checkHeader,loginSignupController.userPhoneEmailOtpVerification);
  app.route("/v1/resendEmailVerification").post(headerValidate.checkHeader,loginSignupController.resendEmailVerification);
  app.route("/v1/resendEmailOtp").post(headerValidate.checkHeader,loginSignupController.resendEmailOtp);
  app.route("/v1/phoneEmailOtp").post(headerValidate.checkHeader,loginSignupController.phoneEmailOtp); //by kush 18-06-23
  app.route("/v1/resendPhoneOtp").post(headerValidate.checkHeader,loginSignupController.resendPhoneOtp); //by kush 18-06-23
  app.route("/v1/forgotPassword").post(headerValidate.checkHeader,loginSignupController.forgotPassword);
  app.route("/v1/userUpdateProfile").post(headerValidate.checkHeader,[authJwt.verifyToken],loginSignupController.userUpdateProfile);
  app.route("/v1/userChangePassword").post(headerValidate.checkHeader,[authJwt.verifyToken],loginSignupController.userChangePassword);
  app.route("/v1/getProfile").get(headerValidate.checkHeader,[authJwt.verifyToken],loginSignupController.getProfile);
  app.route("/v1/getTokens").get(headerValidate.checkHeader,[authJwt.verifyToken],loginSignupController.getTokens);
  app.route("/v1/getAuthProcess").get(headerValidate.checkHeader,[authJwt.verifyToken],loginSignupController.getAuthProcess);
  app.route("/v1/updateAuthProcess").put(headerValidate.checkHeader,[authJwt.verifyToken],loginSignupController.updateAuthProcess);
  app.route("/v1/updatePhoneAuthProcess").post(headerValidate.checkHeader,[authJwt.verifyToken],loginSignupController.updatePhoneAuthProcess); //createed by kush to update auth
  app.route("/v1/otp_resend").post(headerValidate.checkHeader,loginSignupController.otp_resend); //sms otp resend
  app.route("/v1/user_logout").post(headerValidate.checkHeader,[authJwt.verifyToken],loginSignupController.userLogout); //sms otp resend
  app.route("/v1/addContactUs").post(headerValidate.checkHeader,loginSignupController.addContactUs);


  // Files and folders
  app.route("/v1/getUploadedFiles").post(headerValidate.checkHeader,[authJwt.verifyToken],folderFile.getUploadedFiles);
  app.route("/v2/getUploadedFiles").post(headerValidate.checkHeader,[authJwt.verifyToken],folderFile.getUploadedFilesV2);
  app.route("/v3/getUploadedFiles").post(headerValidate.checkHeader,[authJwt.verifyToken],folderFile.getUploadedFilesV3);
  app.route("/v3/getOwnUploadedFiles").post(headerValidate.checkHeader,[authJwt.verifyToken],folderFile.getOwnUploadedFilesV3);
  app.route("/v1/getNftData").get(headerValidate.checkHeader,[authJwt.verifyToken],folderFile.getNftData);
  app.route("/v1/deleteFile").post(headerValidate.checkHeader,[authJwt.verifyToken],folderFile.deleteFile);
  app.route("/v1/createFolder").post(headerValidate.checkHeader,[authJwt.verifyToken],folderFile.createFolder);
  app.route("/v1/createFolder1").post(headerValidate.checkHeader,[authJwt.verifyToken],folderFile.createFolder);
  app.route("/v1/updateFolder").post(headerValidate.checkHeader,[authJwt.verifyToken],folderFile.updateFolder);
  app.route("/v1/getFolders").get(headerValidate.checkHeader,[authJwt.verifyToken],folderFile.getFolders);
  app.route("/v1/getFiles").get(headerValidate.checkHeader,[authJwt.verifyToken],folderFile.getFiles);
  app.route("/v1/getPermissions").get(headerValidate.checkHeader,[authJwt.verifyToken],folderFile.getPermissions);
  app.route("/v1/updatePermissions").put(headerValidate.checkHeader,[authJwt.verifyToken],folderFile.updatePermissions);
  app.route("/v1/updatePermissionsLink").put(headerValidate.checkHeader,[authJwt.verifyToken],folderFile.updatePermissionsLink); //create via kush for sending emails
  app.route("/v1/deletePermissions").put(headerValidate.checkHeader,[authJwt.verifyToken],folderFile.deletePermissions);
  app.route("/v1/deleteFileFolder").put(headerValidate.checkHeader,[authJwt.verifyToken],folderFile.deleteFileFolder);
  app.route("/v1/updateFileFolder").put(headerValidate.checkHeader,[authJwt.verifyToken],folderFile.updateFileFolder);
  app.route("/v1/sharedFile").get(headerValidate.checkHeader,[authJwt.verifyToken],folderFile.sharedFile);
  app.route("/v1/getFolderFileCount").get(headerValidate.checkHeader,[authJwt.verifyToken],folderFile.getFolderFileCount);
  app.route("/v1/getSharedFiles").get(headerValidate.checkHeader,[authJwt.verifyToken],folderFile.getSharedFiles);
  app.route("/v1/rentNftList").post(headerValidate.checkHeader,[authJwt.verifyToken],folderFile.rentNftList);
  app.route("/v1/buyNft").post(headerValidate.checkHeader,[authJwt.verifyToken],folderFile.buyNft);
  app.route("/v1/favouriteNft").post(headerValidate.checkHeader,[authJwt.verifyToken],folderFile.favouriteNft);
  app.route("/v1/favouriteNft").post(headerValidate.checkHeader,[authJwt.verifyToken],folderFile.favouriteNft);
  app.route("/v1/upload").post(headerValidate.checkHeader,[authJwt.verifyToken],nftControler.uploadFileV1);


  app.route("/v1/getAddress").get(headerValidate.checkHeader,[authJwt.verifyToken],nftControler.getAddress);
  app.route("/v1/checkBnbBalance").get(headerValidate.checkHeader,[authJwt.verifyToken],nftControler.checkBnbBalance);
  app.route("/v1/getWalletCoins").get(headerValidate.checkHeader,[authJwt.verifyToken],nftControler.getWalletCoins);
  app.route("/v1/transferTokens").post(headerValidate.checkHeader,[authJwt.verifyToken],nftControler.transferTokens);
  app.route("/v1/createOrder").post(headerValidate.checkHeader,[authJwt.verifyToken],nftControler.createOrder);
  app.route("/v1/saveTransaction").post(headerValidate.checkHeader,[authJwt.verifyToken],nftControler.saveTransaction);
  app.route("/v1/createOrder").post(headerValidate.checkHeader,[authJwt.verifyToken],nftControler.createOrder);




  app.route("/v1/getRemainingSizeToUpload").get(headerValidate.checkHeader,[authJwt.verifyToken],nftControler.getRemainingSizeToUpload);

  //stripe _ payments
  app.post("/stripe/make/payment",[authJwt.verifyToken],stripeControler.initPayment);
  app.get("/stripe/response", stripeControler.Response);

  //routes for nft 
  
  app.post("/v1/nftDetails", [authJwt.verifyToken], nftControler.nftDetails);
  app.post("/v2/updateHash", [authJwt.verifyToken], nftControler.updateHash);
  app.post("/v1/nftSortedList", nftControler.nftSortedList);
  
  
  app.post("/v1/purchase_nft",headerValidate.checkHeader, [authJwt.verifyToken],folderFile.purchase_nft);
  app.post("/v1/wallet_transactions",[authJwt.verifyToken],nftControler.wallet_transactions);
  app.post("/v2/getHash",headerValidate.checkHeader, [authJwt.verifyToken], nftControler.getHash); // this route moved here from app.js
  app.post("/v1/getHash",headerValidate.checkHeader, [authJwt.verifyToken], nftControler.v1getHash); // this route moved here from app.js
  app.post("/v3/getHash",headerValidate.checkHeader, [authJwt.verifyToken], nftControler.v1getHash); // this route moved here from app.js
  app.post(
    "/v1/upadate_nft_market_display_status",
    [authJwt.verifyToken],
    nftControler.upadate_nft_market_display_status
  );
  app.post("/v1/delete_nft", [authJwt.verifyToken], nftControler.delete_nft),
    app.post(
      "/v1/get_fav_nft_list",
      [authJwt.verifyToken],
      nftControler.get_fav_nft_list
    ),
    app.post(
      "/v1/file_folder_search",
      [authJwt.verifyToken],
      nftControler.file_folder_search
    ),
    app.post(
      "/v1/user_notification_list",
      [authJwt.verifyToken],
      nftControler.user_notification_list
    );
  app.post(
    "/v1/save/desktop/folders",
    [authJwt.verifyToken],
    folderFile.saveDesktopAppFolders
  );
  app.post(
    "/v1/get/desktop/folders",
    [authJwt.verifyToken],
    folderFile.getDesktopAppFolders
  );

  /**Outer Auth Apis */

  // authorizationController
  app.post(
    "/auth/userLogin",
    [ValidateIp.validateIpAddress],
    loginSignupController.userLogin
  );
  // app.post('/auth/userSignUp',[ValidateIp.validateIpAddress] , loginSignupController.userSignUp);
  app.post(
    "/auth/signup",
    [ValidateIp.validateIpAddress],
    authorizationController.signup
  );
  app.post(
    "/auth/email_verification",
    [ValidateIp.validateIpAddress],
    authorizationController.email_verification
  );
  // app.post("/auth/resendEmailVerification", [ValidateIp.validateIpAddress], loginSignupController.resendEmailVerification)
  app.post(
    "/auth/resend_email_verification",
    [ValidateIp.validateIpAddress],
    authorizationController.resend_email_verification
  );
  app.post(
    "/auth/getHash",
    [authJwt.verifyToken, ValidateIp.validateIpAddress],
    nftControler.v1getHash
  );
  app.post(
    "/auth/getTokenFromEmail",
    [ValidateIp.validateIpAddress],
    loginSignupController.getTokenFromEmail
  );
  app.post(
    "/auth/forgotPassword",
    [ValidateIp.validateIpAddress],
    loginSignupController.forgotPassword
  );
  app.post(
    "/auth/emailVerification",
    [ValidateIp.validateIpAddress],
    loginSignupController.emailVerification
  );
  app.post(
    "/auth/upload_file",
    [authJwt.verifyToken, ValidateIp.validateIpAddress],
    authorizationController.upload_file
  );
  // app.get("/auth/uploaded_file", [ValidateIp.validateIpAddress], authorizationController.uploaded_file)
  app.post(
    "/auth/uploaded_single_file",
    [ValidateIp.validateIpAddress],
    authorizationController.uploaded_single_file
  );

  app.post("/auth/save_ip_address", authorizationController.save_ip_address);
  app.get("/auth/whitelist_ips", authorizationController.whitelist_ips);

  /**Outer Auth Apis */

  app.post("/v1/addContactUs", [ValidateIp.contactUsValidation],loginSignupController.addContactUs);
};
