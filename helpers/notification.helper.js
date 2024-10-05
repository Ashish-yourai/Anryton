const admin = require('firebase-admin');
const serviceAccount = require('./anryton-6280b-firebase-adminsdk-p613j-ee552665fd.json')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});



const notifyUser = async ()=>{
    const message = {
        notification: {
          title: 'Test Notification',
          body: 'This is an test notifications for iphone in anryton',
        },
        token: '9804a54bcc6fbee3ce059f6d3b0c37471c0798363caa07089253fdfe18b6685b',
    };

    admin.messaging().send(message)
    .then((response) => {
        ////console.log('Successfully sent notification:', response);
    })
    .catch((error) => {
        console.error('Error sending notification:', error);
    });
}
notifyUser();
module.exports ={
    notifyUser:notifyUser ,
}