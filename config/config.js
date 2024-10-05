'use strict';
const MongoClient = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

MongoClient.set('useNewUrlParser', true)
MongoClient.set('useFindAndModify', true)
MongoClient.set('useCreateIndex', true)
MongoClient.set('useUnifiedTopology', true)
MongoClient.set('useFindAndModify', false)
const url = 'mongodb+srv://' + process.env.DB_USER_NAME + ':' + process.env.DB_PASSWORD + '@cluster0.4bfx8.mongodb.net/' + process.env.DB_NAME_DEV + '?authSource=admin&replicaSet=atlas-ncrtun-shard-0&w=majority&readPreference=primary&appname=MongoDB%20Compass&retryWrites=true&ssl=true'

const mongodb = (payloadData) => {
    return new Promise(async(resolve, reject) => {
        try {
            console.log(url)
            const client = await MongoClient.connect(url, { useNewUrlParser: true })
            console.log('*************************************************mongodb db connected sucessfull*************************************************')
            return resolve(client)
        } catch (error) {
            console.log(error, '====db connection Error==')
            return reject(error)
        }
    })
}
mongodb();


module.exports ={
   SecurityKey: "AbcDeFtfdee",
   User: require('../models/user'),
   Content: require('../models/content'),
   Services: require('../models/services'),
   Banners: require('../models/banners'),
   Files: require('../models/files'),
   Folder: require('../models/folder'),
   NewFiles: require('../models/newFiles'),
   SuperAdmin: require('../models/superAdmin'),
   Settings: require('../models/settings'),
   Plans: require('../models/plans'),
   Permission: require('../models/permission'),
   Transactions : require('../models/Transactions'),
   Notifications : require('../models/notification'),
   UserNotifications : require('../models/userNotification'),
   stripTransactions: require('../models/stripTransactions'),
   AuthorzationIps : require('../models/AuthorzationIps'),
   ContactUs : require('../models/contactUs'),
   Category : require('../models/category'),
   Blog : require('../models/blog'),
   TokenTransaction : require('../models/tokenTransaction')
};
