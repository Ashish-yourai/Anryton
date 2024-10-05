// require('dotenv').config();

const smsrequest = (mobile, country_code, otp) => {
    ////console.log('mobile ' , mobile , 'country code ' , country_code , 'otp ' , otp)
        country_code = country_code.replace('+', '');
        mobile = country_code+mobile;
        var request = require('request');
        var options = {
            'method': 'POST',
            'url': 'https://rest.nexmo.com/sms/json',
            'headers': {
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            form: {
              'from': '12044001529',
              'text': 'Dear User your otp is '+ otp,
              'to': mobile,
              'api_key': 'ced6d588',
              'api_secret': 'rabFdbIZMi3y7uV1'
            }
          };
          request(options, function (error, response) {
            if (error) throw new Error(error);
            ////console.log('sms response',response.body);
          });
}
 

module.exports = {
    smsrequest: smsrequest, 
}