// let nodemailer = require('nodemailer');

var postmark = require("postmark");
var client = new postmark.ServerClient(process.env.POSTMARK_TOKEN);
const mailText = async ( link ) => {
    return `<html>
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
          <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">Anryton</a>
        </div>
        <p style="font-size:1.1em">Hi,</p>
        <p>Thank you for choosing Anryton. Use the following Verification Code to complete your Sign Up procedures. Verification  is valid for 10 minutes</p>
        <h2 style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;" >${link}</h2>
        If you didn't request this, you can ignore this email or let us know.
        <p style="font-size:0.9em;">Regards,<br />Team Anryton</p>
        <hr style="border:none;border-top:1px solid #eee" />
          <div class="social">
            <a style="background-color:#C7B39A; -webkit-border-radius:50%; border-radius:50%; display:inline-block; height:35px; margin:0 0.215em; width:35px;"
              onmouseover="this.style.backgroundColor='#CEBCA7'"
              onmouseout="this.style.backgroundColor='#C7B39A'"
              href="https://www.facebook.com"><svg xmlns="http://www.w3.org/2000/svg"
                  width="16" height="16" viewBox="0 0 24 24" fill="#FFFFFF"
                  style="border: 0; display: block; margin: 8px auto; vertical-align: middle;">
                  <path
                      d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.378 14.192 5 15.115 5H18V0h-3.808C10.596 0 9 1.583 9 4.615V8z" />
              </svg>
            </a>
            <a style="background-color:#C7B39A; -webkit-border-radius:50%; border-radius:50%; display:inline-block; height:35px; margin:0 0.215em; width:35px;"
              onmouseover="this.style.backgroundColor='#CEBCA7'"
              onmouseout="this.style.backgroundColor='#C7B39A'"
              href="https://twitter.com/Anry_ton"><svg xmlns="http://www.w3.org/2000/svg"
                  width="16" height="16" viewBox="0 0 24 24" fill="#FFFFFF"
                  style="border: 0; display: block; margin: 8px auto; vertical-align: middle;">
                  <path
                      d="M24 4.557a9.83 9.83 0 0 1-2.828.775 4.932 4.932 0 0 0 2.165-2.724 9.864 9.864 0 0 1-3.127 1.195 4.916 4.916 0 0 0-3.594-1.555c-3.18 0-5.515 2.966-4.797 6.045A13.978 13.978 0 0 1 1.67 3.15a4.93 4.93 0 0 0 1.524 6.573 4.903 4.903 0 0 1-2.23-.616c-.053 2.28 1.582 4.415 3.95 4.89a4.935 4.935 0 0 1-2.224.084 4.928 4.928 0 0 0 4.6 3.42A9.9 9.9 0 0 1 0 19.54a13.94 13.94 0 0 0 7.548 2.212c9.142 0 14.307-7.72 13.995-14.646A10.025 10.025 0 0 0 24 4.556z" />
              </svg>
            </a>
            <a style="background-color:#C7B39A; -webkit-border-radius:50%; border-radius:50%; display:inline-block; height:35px; margin:0 0.215em; width:35px;"
              onmouseover="this.style.backgroundColor='#CEBCA7'"
              onmouseout="this.style.backgroundColor='#C7B39A'"
              href="https://www.pinterest.com"><svg xmlns="http://www.w3.org/2000/svg"
                  width="16" height="16" viewBox="0 0 24 24" fill="#FFFFFF"
                  style="border: 0; display: block; margin: 8px auto; vertical-align: middle;">
                  <path
                      d="M12.562 0C6.012 0 2.71 4.696 2.71 8.612c0 2.37.898 4.48 2.823 5.267.315.128.6.003.69-.346.063-.242.214-.853.28-1.106.094-.346.058-.467-.197-.768-.555-.655-.91-1.503-.91-2.704 0-3.484 2.606-6.603 6.788-6.603 3.7 0 5.735 2.262 5.735 5.283 0 3.975-1.76 7.33-4.37 7.33-1.443 0-2.523-1.193-2.177-2.656.414-1.747 1.217-3.63 1.217-4.892 0-1.128-.605-2.07-1.86-2.07-1.474 0-2.657 1.525-2.657 3.568 0 1.3.44 2.18.44 2.18L6.738 18.61c-.527 2.23-.08 4.962-.042 5.24.022.163.232.2.327.078.137-.177 1.893-2.345 2.49-4.51.168-.614.97-3.79.97-3.79.478.914 1.878 1.718 3.366 1.718 4.433 0 7.44-4.04 7.44-9.448C21.29 3.808 17.825 0 12.56 0z" />
              </svg>
            </a>
            <a style="background-color:#C7B39A; -webkit-border-radius:50%; border-radius:50%; display:inline-block; height:35px; margin:0 0.215em; width:35px;"
              onmouseover="this.style.backgroundColor='#CEBCA7'"
              onmouseout="this.style.backgroundColor='#C7B39A'"
              href="https://plus.google.com"><svg xmlns="http://www.w3.org/2000/svg"
                  width="16" height="16" viewBox="0 0 24 24" fill="#FFFFFF"
                  style="border: 0; display: block; margin: 8px auto; vertical-align: middle;">
                  <path
                      d="M24 5h-3v3h-2V5h-3V3h3V0h2v3h3v2zm-8.7 13.608C15.3 21.04 13.08 24 7.492 24 3.407 24 0 22.238 0 19.274c0-2.288 1.448-5.257 8.215-5.257-1.005-.82-1.25-1.964-.637-3.205-3.962 0-5.99-2.33-5.99-5.288C1.587 2.63 3.737 0 8.127 0h7.033l-1.57 1.65h-1.846c1.302.745 1.994 2.282 1.994 3.975 0 1.554-.855 2.813-2.077 3.758-2.167 1.676-1.612 2.612.66 4.27 2.24 1.678 2.98 2.972 2.98 4.955zM10.912 5.73c-.328-2.487-1.95-4.53-3.843-4.586-1.895-.057-3.166 1.848-2.84 4.337.328 2.49 2.13 4.23 4.025 4.286 1.894.056 2.985-1.546 2.658-4.035zm1.953 13.128c0-2.047-1.867-4-5-4-2.824-.03-5.217 1.786-5.217 3.89 0 2.147 2.04 3.935 4.862 3.935 3.61 0 5.354-1.678 5.354-3.825z" />
              </svg>
            </a>
          </div>
          <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
            <p>Anryton INC</p>
            <p>Address</p>
            <p>California</p>
          </div>
        </div>
      </div>
    </body>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js"integrity="sha384-w76AqPfDkMBDXo30jS1Sgez6pr3x5MlQ1ZAGC+nuZB+EYdgRZgiwxhTBTkF7CXvN" crossorigin="anonymous"></script>
  </html>`
}

const sendEmail = async (to = 'kushmalout@gmail.com', subject = 'test email', link = 'sampedfd') => {
    let template = await mailText(link); 
    //  var transporter = nodemailer.createTransport({
    //     host: "smtp.zoho.in",
    //     // service: 'smtp.zoho.in',
    //     secure: true,
    //     port: 465,
    //     auth: {
    //         user: "support@cashfudx.com",
    //         pass: "KMmwP741Z9N0",
    //     },
    // });

    
    // var mailOptions = {
    //     from: "support@cashfudx.com",
    //     to: to,
    //     subject: subject,
    //     html: template
    // };
    

    client.sendEmail({
      "From": 'support@anryton.com',
      "To": to,
      "Subject": subject,
      "HtmlBody": template,
    }).then((resp) => {}).catch((error) => console.log("error" , error));

    // transporter.sendMail(mailOptions, function(error, info) {
    //     if (error) {
    //         ////console.log('email not sent case1', error);
    //     } else {
    //         ////console.log(info)
    //         ////console.log('Email sent: now ' + info);
    //     }
    // });
}


function sendLiveEmail(link , emailAddress){
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
                href="https://twitter.com/Anry_ton">
                <img src="https://cdn-icons-png.flaticon.com/512/2168/2168336.png" style="width:100%">
                
              </a>
              <a style="-webkit-border-radius:50%; border-radius:50%; display:inline-block; height:35px; margin:0 0.215em; width:35px;"
                onmouseover="this.style.backgroundColor='#CEBCA7'"
                onmouseout="this.style.backgroundColor='#C7B39A'"
                href="https://in.pinterest.com/anryton/">
                <img src="https://cdn-icons-png.flaticon.com/128/2175/2175205.png" style="width:100%">
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

function WalletKeyMails (data) {
  //console.log('wallet data ' , data)
  var client = new postmark.ServerClient(process.env.POSTMARK_TOKEN);
  let html = "<p>Dear "+data.name+",</p>"+
          "<p>We hope this email finds you well. This communication contains important information regarding your Anryton wallet .Please read this email carefully and follow the instructions to secure your assets.</p>"+ 
          "<p>*Important: Keep this information confidential and never share it with anyone.*</p>"+ 
          "<p>*Private Key:*</p>"+
          "<p>Your private key is a sensitive piece of information that provides access to your crypto assets. Please find your private key below:</p>"+
          "<p>Private Key: "+data.private_key+"</p>"+
          "<p>*Public Address:*</p>"+
          "<p>Your public address is used for receiving crypto assets. It is safe to share your public address with others as it only allows viewing of your transactions. Here is your public address:</p>"+
          "<p>Public Address: "+data.address+"</p>"+
          "<p>*Instructions:*</p>"+
          "<p>1. *Backup:* Immediately make a secure backup of your private key. Store it in a safe and offline location, such as a hardware wallet or a secure paper wallet.</p>"+
          "<p>2. *Never Share:* Do not share your private key with anyone. Legitimate entities will never ask for your private key.</p>"+
          "<p>3. *Security Reminder:* Regularly update your security practices, use strong and unique passwords, and enable two-factor authentication for additional security.</p>"+
          "<p>*Security Tips:*</p>"+
          "<p>- Be cautious of phishing attempts and only use official links provided by Anryton</p>"+
          "<p>- Keep your computer and antivirus software up to date.</p>"+
          "<p>- Enable all available security features on your wallet.</p>"+
          "<p>If you have any concerns or questions, please contact our support team immediately at [support@anryton.com].</p>"+
          "<p>Thank you for being part of Anryton.We appreciate your commitment to security and look forward to continuing our journey together.</p>"+
          "<p>Disclaimer: Anryton is a custodial platform</p>";

          client.sendEmail({
            "From": 'support@anryton.com',
            "To": data.email,
            "Subject": "Important Information for Your AnrytonWallet",
            "HtmlBody": html,
          }).then((resp) => { console.log('success mail response ' , resp)}).catch((error) => console.log("error" , error));

}

function sendGiftEmail(data = {email : 'samamloh92@gmail.com' , 'name' : 'sam amloh'}) {
  // //console.log('wallet data ' , data)
  var client = new postmark.ServerClient(process.env.POSTMARK_TOKEN);
  let html = "<p>Dear "+data.name+",</p>"+
          "<p>Welcome to Anryton! We are thrilled to have you join our growing community. As a token of our appreciation and to get you started on this exciting journey, we're gifting you 12 tokens, absolutely free!</p>"+ 
          "<p>What Are These Tokens?</p>"+
          "<p>These tokens are a small token of our love and gratitude for choosing Anrtyon. You can use these tokens to save data within our application, enhancing your experience and enabling you to make the most out of our services from day one.</p>"+
          "<p>How to Use Your Tokens:</p>"+
          "<p>Access Your Account: Log in to your Anryton account.</p>"+
          "<p>Navigate to upload section: Where you can save data or access premium features.</p>"+
          "<p>Apply Tokens: When you save data, you will have the option to use your tokens for saving. Each token allows you to save specific amounts of data, ensuring your most important information is securely stored.</p>"+
          "<p>If you have any questions about how to use your tokens or any other inquiries, our support team is here for you. Contact us at [Support Email] or through our in-app support feature.</p>"+
          "<p>We're excited to see how Anrtyon helps you in your daily life. Start exploring, saving, and making the most of your new account today.</p>"+
          "<p>Thank you for choosing Anryton. Welcome aboard!</p>"+
          "<p>Warm regards,</p>"+
          "<p>The Anryton Team</p>"+
          "<p>https://anryton.com <br> </p>support@anryton.com</p>"+
          "<p>Disclaimer: Anryton is a custodial platform</p>";
          client.sendEmail({
            "From": 'support@anryton.com',
            "To": data.email,
            "Subject": "Welcome to Anrtyon - A Special Gift for You!",
            "HtmlBody": html,
          }).then((resp) => { console.log('success mail response ' , resp)}).catch((error) => console.log("error" , error));

}


function welcomeEmail(email) {
  // //console.log('wallet data ' , data)
  var client = new postmark.ServerClient(process.env.POSTMARK_TOKEN);
  let html = ` <!doctype html>
                <html lang="en">
                
                <head>
                    <meta charset="utf-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1">
                    <title>Anryton</title>
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
                
                <body
                    style="font-family: 'Malgun Gothic', Arial, sans-serif; margin: 0; padding: 0; width: 100%; -webkit-text-size-adjust: none; -webkit-font-smoothing: antialiased;">
                    <table width="100%" bgcolor="#ebeef1" border="0" cellspacing="0" cellpadding="0" id="background"
                        style="height: 100% !important; margin: 0; padding: 0; width: 100% !important;">
                        <tr>
                            <td align="center" valign="top">
                                <table width="600" border="0" bgcolor="#F6F6F6" cellspacing="0" cellpadding="20" id="preheader">
                                    <tr>
                                        <td valign="top">
                                            <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                                <tr>
                                                    <td valign="top" width="600">
                                                        <div class="logo text-center">
                                                            <a href=""style="color: #514F4E; font-size: 18px; font-weight: bold; text-align: center; text-decoration: none;">
                                                            <img src="https://anryton-assets-dev.s3.amazonaws.com/1675352243_logo.svg" alt="">
                                                            </a>
                                                        </div>
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                </table>
                                <!-- // END #preheader -->
                
                
                                <table width="600" border="0"  cellspacing="0" cellpadding="20" id="body_container" style="height: 250px;background-image: url('https://anryton-assets-dev.s3.amazonaws.com/1675353153_bg.png'); background-size: cover;" >
                                    <tr>
                                        <td align="center" valign="top" class="body_content">
                                            <table width="100%" border="0" cellspacing="0" cellpadding="20">
                                                <tr>
                                                    <td valign="top">
                                                        <h2 style="color: #FFFFFF; font-size: 28px; text-align: center;padding-top: 50px; font-weight: 900;">Start storing your data on the globally distributed cloud.
                
                                                        </h2>
                                                    </td>
                                                </tr>
                
                                            </table>
                                        </td>
                                    </tr>
                                </table>
                                <!-- // END #body_container -->
                
                                <table width="600" border="0" bgcolor="#fff" cellspacing="0" cellpadding="20" id="body_info_container">
                                    <tr>
                                        <td align="center" valign="top" class="body_info_content">
                                            <table width="100%" border="0" cellspacing="0" cellpadding="20">
                                                <tr>
                                                    <td valign="top">
                                                        <h2 style="color: #474544; font-size: 20px; text-align: center;">Welcome to Anryton.
                                                        </h2>
                                                        <p
                                                            style="color: #666666; font-size: 16px; line-height: 22px; text-align: center;">
                                                            Thanks for signing up for Anryton, the fastest, most secure cloud object storage. We can’t wait for you to experience firsthand the benefits of using Anryton as a backend integration or as cost-effective storage for your business.</p>
                
                
                                                    </td>
                
                                                </tr>
                                                <tr style="text-align: center;">
                                                    <td>
                                                        <button style="background-color: #2f3cf7; color: #FFFFFF; border: 0; padding: 10px 30px; border-radius: 50px;">Sign in</button>
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                </table>
                
                                <table width="600" border="0" bgcolor="#fff" cellspacing="0" cellpadding="20"
                                    id="body_item_container">
                                    <tr>
                                        <td>
                                            <hr
                                                style="background-color: #D0D0D0; border: none; color: #D0D0D0; height: 2px; margin-top: -10px;" />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td align="center" valign="top" class="body_item_content">
                                            <table width="100%" border="0" cellspacing="0" cellpadding="20">
                                                <tr>
                                                    <td align="center" valign="top">
                                                        <h2 style="color: #474544; font-size: 20px; text-align: center;">Here are some resources to help you get started.
                                                        </h2>
                                                        <p
                                                            style="color: #666666; font-size: 16px; line-height: 22px; text-align: center;">
                                                            Learn how to set up interaction with anryton.</p>
                                                    </td>
                                                </tr>
                                                <tr style="text-align: center;">
                                                    <td>
                                                        <button style="background-color: #ffffff; color: #2f3cf7; border: 2px solid #2f3cf7;; padding: 10px 50px; border-radius: 50px;">Quickstart guides</button>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td align="center" valign="top">
                                                        <h2 style="color: #474544; font-size: 20px; text-align: center;">How anryton work
                                                        </h2>
                                                      <p
                                                            style="color: #666666; font-size: 16px; line-height: 22px; text-align: center;">
                                                            <a href="">Product overview</a> </p>
                                                        <p
                                                            style="color: #666666; font-size: 16px; line-height: 22px; text-align: center;">
                                                            <a href="">Access management</a> </p>
                                                        <p
                                                            style="color: #666666; font-size: 16px; line-height: 22px; text-align: center;">
                                                            <a href="">S3 compatibility</a> </p>
                
                
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td align="center" valign="top">
                                                        <h2 style="color: #474544; font-size: 20px; text-align: center;">How-to guides
                                                        </h2>
                                                      <p
                                                            style="color: #666666; font-size: 16px; line-height: 22px; text-align: center;">
                                                            <a href="">Backups</a> </p>
                                                        <p
                                                            style="color: #666666; font-size: 16px; line-height: 22px; text-align: center;">
                                                            <a href="">Integrations</a> </p>
                                                        <p
                                                            style="color: #666666; font-size: 16px; line-height: 22px; text-align: center;">
                                                            <a href="">Large file transfers</a> </p>
                
                
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td align="center" valign="top">
                                                        <h2 style="color: #474544; font-size: 20px; text-align: center;">Policies & pricing
                                                        </h2>
                                                      <p
                                                            style="color: #666666; font-size: 16px; line-height: 22px; text-align: center;">
                                                            <a href="">How billing is calculated</a> </p>
                                                        <p
                                                            style="color: #666666; font-size: 16px; line-height: 22px; text-align: center;">
                                                            <a href="">Payment methods</a> </p>
                                                        <p
                                                            style="color: #666666; font-size: 16px; line-height: 22px; text-align: center;">
                                                            <a href="">Data retention policy</a> </p>
                
                
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <hr
                                                            style="background-color: #D0D0D0; border: none; color: #D0D0D0; height: 2px; margin-top: -10px;" />
                                                    </td>
                                                </tr>
                
                                                <tr>
                                                    <td align="center" valign="top">
                                                        <h2 style="color: #474544; font-size: 20px; text-align: center;">Still not finding what you need?
                                                        </h2>
                                                        <img src="https://anryton-assets-dev.s3.amazonaws.com/1675353209_1.png" alt="" width="80px" style="padding: 10px;">
                                                        <h4 style="color: #666666; font-size: 16px; line-height: 22px; text-align: center; font-weight: 600;">Explore the help center.</h4>
                                                      <p
                                                            style="color: #666666; font-size: 16px; line-height: 22px; text-align: center;">
                                                            Find or ask for answers in the help center.</p>
                                                    </td>
                                                </tr>
                                                <tr style="text-align: center;">
                                                    <td>
                                                        <button style="background-color: #2f3cf7; color: #FFFFFF; border: 0; padding: 10px 30px; border-radius: 50px;">Go to help center</button>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td align="center" valign="top">
                                                        <h2 style="color: #474544; font-size: 20px; text-align: center;">Join the live tech lab.
                                                        </h2>
                                                        <img src="https://anryton-assets-dev.s3.amazonaws.com/1675353245_2.png" alt="" width="80px" style="padding: 10px;">
                
                                                      <p
                                                            style="color: #666666; font-size: 16px; line-height: 22px; text-align: center;">
                                                            Attend a monthly live Virtual Tech Lab for 1-1 help.</p>
                                                    </td>
                                                </tr>
                                                <tr style="text-align: center;">
                                                    <td>
                                                        <button style="background-color: #2f3cf7; color: #FFFFFF; border: 0; padding: 10px 30px; border-radius: 50px;">Notify Me</button>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <hr
                                                            style="background-color: #D0D0D0; border: none; color: #D0D0D0; height: 2px; margin-top: -10px;" />
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                </table>
                
                                <table width="600" bgcolor="#fff" border="0" cellspacing="0" cellpadding="20" id="footer_container">
                                    <tr>
                                        <td align="center" valign="top">
                                            <table width="100%" border="0" cellspacing="0" cellpadding="20" id="footer">
                                                <tr>
                                                    <td align="center" valign="top" class="social_container">
                                                        <div class="social">
                                                            <a style="background-color:#C7B39A; -webkit-border-radius:50%; border-radius:50%; display:inline-block; height:35px; margin:0 0.215em; width:35px;"
                                                                onmouseover="this.style.backgroundColor='#CEBCA7'"
                                                                onmouseout="this.style.backgroundColor='#C7B39A'"
                                                                href="https://www.facebook.com"><svg xmlns="http://www.w3.org/2000/svg"
                                                                    width="16" height="16" viewBox="0 0 24 24" fill="#FFFFFF"
                                                                    style="border: 0; display: block; margin: 8px auto; vertical-align: middle;">
                                                                    <path
                                                                        d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.378 14.192 5 15.115 5H18V0h-3.808C10.596 0 9 1.583 9 4.615V8z" />
                                                                </svg></a>
                                                            <a style="background-color:#C7B39A; -webkit-border-radius:50%; border-radius:50%; display:inline-block; height:35px; margin:0 0.215em; width:35px;"
                                                                onmouseover="this.style.backgroundColor='#CEBCA7'"
                                                                onmouseout="this.style.backgroundColor='#C7B39A'"
                                                                href="https://twitter.com/Anry_ton"><svg xmlns="http://www.w3.org/2000/svg"
                                                                    width="16" height="16" viewBox="0 0 24 24" fill="#FFFFFF"
                                                                    style="border: 0; display: block; margin: 8px auto; vertical-align: middle;">
                                                                    <path
                                                                        d="M24 4.557a9.83 9.83 0 0 1-2.828.775 4.932 4.932 0 0 0 2.165-2.724 9.864 9.864 0 0 1-3.127 1.195 4.916 4.916 0 0 0-3.594-1.555c-3.18 0-5.515 2.966-4.797 6.045A13.978 13.978 0 0 1 1.67 3.15a4.93 4.93 0 0 0 1.524 6.573 4.903 4.903 0 0 1-2.23-.616c-.053 2.28 1.582 4.415 3.95 4.89a4.935 4.935 0 0 1-2.224.084 4.928 4.928 0 0 0 4.6 3.42A9.9 9.9 0 0 1 0 19.54a13.94 13.94 0 0 0 7.548 2.212c9.142 0 14.307-7.72 13.995-14.646A10.025 10.025 0 0 0 24 4.556z" />
                                                                </svg></a>
                                                            <a style="background-color:#C7B39A; -webkit-border-radius:50%; border-radius:50%; display:inline-block; height:35px; margin:0 0.215em; width:35px;"
                                                                onmouseover="this.style.backgroundColor='#CEBCA7'"
                                                                onmouseout="this.style.backgroundColor='#C7B39A'"
                                                                href="https://www.pinterest.com"><svg xmlns="http://www.w3.org/2000/svg"
                                                                    width="16" height="16" viewBox="0 0 24 24" fill="#FFFFFF"
                                                                    style="border: 0; display: block; margin: 8px auto; vertical-align: middle;">
                                                                    <path
                                                                        d="M12.562 0C6.012 0 2.71 4.696 2.71 8.612c0 2.37.898 4.48 2.823 5.267.315.128.6.003.69-.346.063-.242.214-.853.28-1.106.094-.346.058-.467-.197-.768-.555-.655-.91-1.503-.91-2.704 0-3.484 2.606-6.603 6.788-6.603 3.7 0 5.735 2.262 5.735 5.283 0 3.975-1.76 7.33-4.37 7.33-1.443 0-2.523-1.193-2.177-2.656.414-1.747 1.217-3.63 1.217-4.892 0-1.128-.605-2.07-1.86-2.07-1.474 0-2.657 1.525-2.657 3.568 0 1.3.44 2.18.44 2.18L6.738 18.61c-.527 2.23-.08 4.962-.042 5.24.022.163.232.2.327.078.137-.177 1.893-2.345 2.49-4.51.168-.614.97-3.79.97-3.79.478.914 1.878 1.718 3.366 1.718 4.433 0 7.44-4.04 7.44-9.448C21.29 3.808 17.825 0 12.56 0z" />
                                                                </svg></a>
                                                           
                                                        </div>
                                                    </td>
                                                </tr>
                
                                            </table>
                                            <!-- // END #footer -->
                                        </td>
                                    </tr>
                                </table>
                                <!-- // END #footer_container -->
                            </td>
                        </tr>
                    </table>
                    <!-- // END #background -->
                </body>
                <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js"
                    integrity="sha384-w76AqPfDkMBDXo30jS1Sgez6pr3x5MlQ1ZAGC+nuZB+EYdgRZgiwxhTBTkF7CXvN"
                    crossorigin="anonymous"></script>
                
                </html`;
          client.sendEmail({
            "From": 'support@anryton.com',
            "To": email,
            "Subject": "Welcome to Anryton!!",
            "HtmlBody": html,
          }).then((resp) => { console.log('success mail response ' , resp)}).catch((error) => console.log("error" , error));

}
// sendGiftEmail();
function forgotPasswordEmail(link,emailAddress,userName){
  //console.log('link is  ' + link)
  var client = new postmark.ServerClient(process.env.POSTMARK_TOKEN);
  let html = `<html>
            <head>
            <title>Anryton</title>
            <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
            <link href="https://fonts.googleapis.com/css?family=Montserrat:300,400,600,800" rel="stylesheet">
            </head>

            <body style="background:#edefee; padding:4%;">

                  
<p>Dear ${userName},</p> <br>

<p>We received a request to reset your password for your Anryton account. We're here to help you get back into your account as quickly as possible.</p> <br>

<p>To reset your password, please click the link below:</p> <br>

                    <a href='${link}' target="_blank"> <p>${link}</p></a><br>

                   <p> Please note, for your security, this link will expire in 10 mintues. </p> <br>

<p>If you did not request a password reset, please ignore this email or contact us if you have any concerns.</p> <br>

<p>Thank you for using Anryton. We're committed to ensuring the security of your account and personal information.</p> <br>

<p>Best regards,</p><br>

<p>The Anrtyon Team</p>




            </body>

          </html>`;

          //console.log('html ' , html)

          client.sendEmail({
            "From": 'support@anryton.com',
            "To": emailAddress,
            "Subject": "Reset Your Password",
            "HtmlBody": html,
          }).then((resp) => { console.log(' forgot password success mail response ' , resp)}).catch((error) => console.log("error" , error));
}
module.exports ={
    sendEmail:sendEmail ,
    sendLiveEmail : sendLiveEmail,
    sendWalletKeyMail : WalletKeyMails,
    sendGiftEmail : sendGiftEmail,
    forgotPasswordEmail : forgotPasswordEmail,
    welcomeEmail : welcomeEmail,
}