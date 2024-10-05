let {SendMailClient } = require("zeptomail");
const url = "api.zeptomail.in/";
const token = "Zoho-enczapikey PHtE6r0PRbvijmd8+xFU5aWxR8DxNY8n/rk2fgBA5IkXCqADH01WqN0rkzezqxctUqNBFqKZmophsbqUu+zQcz7rNz5OCWqyqK3sx/VYSPOZsbq6x00at1gSdkTdU4Trctdq1CDRv9+X";

let client = new SendMailClient({url, token});
 

let nodemailer = require('nodemailer'); 
const mailText = async (data ) => {
    return `<!doctype html>
    <html lang="en-US"> 
    <head>
        <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
        <title>Folder Permission Sharing</title>
        <meta name="description" content="Folder Permission Sharing.">
        <style type="text/css">
            a:hover {text-decoration: underline !important;}
        </style>
    </head> 
    <body marginheight="0" topmargin="0" marginwidth="0" style="margin: 0px; background-color: #f2f3f8;" leftmargin="0">
        <!--100% body table-->
        <table cellspacing="0" border="0" cellpadding="0" width="100%" bgcolor="#f2f3f8"
            style="@import url(https://fonts.googleapis.com/css?family=Rubik:300,400,500,700|Open+Sans:300,400,600,700); font-family: 'Open Sans', sans-serif;">
            <tr>
                <td>
                    <table style="background-color: #f2f3f8; max-width:670px;  margin:0 auto;" width="100%" border="0"
                        align="center" cellpadding="0" cellspacing="0">
                        <tr>
                            <td style="height:80px;">&nbsp;</td>
                        </tr>
                        <tr>
                            <td style="text-align:center;">
                              <a href="#" title="logo" target="_blank">
                                <img width="200" src="https://anryton-assets-dev.s3.amazonaws.com/logo+2.png" title="logo" alt="logo">
                              </a>
                            </td>
                        </tr>
                        <tr>
                            <td style="height:20px;">&nbsp;</td>
                        </tr>
                        <tr>
                            <td>
                                <table width="95%" border="0" align="center" cellpadding="0" cellspacing="0"
                                    style="max-width:670px;background:#fff; border-radius:3px; text-align:center;-webkit-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);-moz-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);box-shadow:0 6px 18px 0 rgba(0,0,0,.06);">
                                    <tr>
                                        <td style="height:40px;">&nbsp;</td>
                                    </tr>
                                    <tr>
                                        <td style="padding:0 35px;" colspan="2">
                                            <h1 style="color:#1e1e2d; font-weight:500; margin:0;font-size:32px;font-family:'Rubik',sans-serif;">`+data.name+` Shared a folder</h1>
                                            <span
                                                style="display:inline-block; vertical-align:middle; margin:29px 0 26px; border-bottom:1px solid #cecece; width:100px;"></span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding:0 35px 0 35px; text-align: left;" align="left" valign="middle">
                                            <img src="https://anryton-assets-dev.s3.amazonaws.com/user.png" style="width: 60px;; display: inline-block; vertical-align: revert;" alt="image" >
                                            <p style="color:#455056;  max-width: 485px; display: inline-block; font-size:15px;line-height:24px; margin:0; padding-left: 15px; vertical-align: top;">`+data.name+` (`+data.email+`) has invited you to contribute to the following share `+data.type+`.
                                            </p>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding:35px 35px 0 35px; text-align: left;" align="left" valign="middle">
                                            <div style="border: 1px solid #f1f1f1; padding: 15px; border-radius:5px; padding:15px">
                                                <img src="https://anryton-assets-dev.s3.amazonaws.com/folder.png" alt="folder" />
                                                <p style="color:#455056;  max-width: 485px; display: inline-block; font-size:15px;line-height:24px; margin:0; padding-left: 10px; vertical-align: bottom;">`+data.folder_name+`</p>
                                                <div style="margin: 15px 0 30px; height: 150px; border: 1px solid #f1f1f1; padding: 15px; border-radius:5px; padding:15px"></div>
                                                 <img src="https://anryton-assets-dev.s3.amazonaws.com/user_small.png" alt="folder" />
                                                <p style="color:#455056;  max-width: 485px; display: inline-block; font-size:15px;line-height:24px; margin:0 0 0 0; padding-left: 10px; vertical-align: bottom;">`+data.name+` is the owner</p>
                                                <br />
                                                <br />
                                                <img src="https://anryton-assets-dev.s3.amazonaws.com/time.png" alt="folder" />
                                                <p style="color:#455056;  max-width: 485px; display: inline-block; font-size:15px;line-height:24px; margin:0; padding-left: 10px; vertical-align: bottom;">Last edited by `+data.name+` `+data.time+`</p>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding:0 35px;">
                                            <a href="`+data.link+`" style="background:#267be0;text-decoration:none !important; font-weight:500; margin-top:35px; color:#fff;text-transform:uppercase; font-size:14px;padding:10px 24px;display:inline-block;border-radius:50px;">Open</a>
                                            
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="height:40px;">&nbsp;</td>
                                    </tr>
                                </table>
                            </td>
                        <tr>
                            <td style="height:20px;">&nbsp;</td>
                        </tr>
                        <tr>
                            <td style="text-align:center;">
                                <p style="font-size:14px; color:rgba(69, 80, 86, 0.7411764705882353); line-height:18px; margin:0 0 0;">&copy; <strong>www.anrytoon.com</strong></p>
                            </td>
                        </tr>
                        <tr>
                            <td style="height:80px;">&nbsp;</td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table> 
    </body>
    
    </html>`
}
// type 1 = file type = folder 
let data = {
    name : 'Kuldeep Sharma',
    folder_name : 'CTSCAN',
    time : '3 Days Ago',
    link : 'https://www.google.com',
    email : '349kuldeep@gmail.com',
    subject : 'Folder Update Permission',
}
const sendEmail = async (to = 'Virtualittechnology@gmail.com', subject = 'Folder Update Permission', data) => {
    subject = data.subject;
    ////console.log('we are checking for new email template')
    let template = await mailText(data); 


    client.sendMail({
        "bounce_address": "support@trading.spotbot.live",
        "from": 
        {
            "address": "noreply@spotbot.live",
            "name": "noreply"
        },
        "to": 
        [
            {
            "email_address": 
                {
                    "address": to,
                    "name": "Spot"
                }
            }
        ],
        "subject": subject,
        "htmlbody": template,
      }).then((resp) => {}).catch((error) => {});
}
module.exports ={
    sendFileShareEmail:sendEmail ,
}