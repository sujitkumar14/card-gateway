let env = process.env.NODE_ENV || "development";


//configuration of an app
let config = {};


config.development = {

    "databaseUrl": "mongodb://localhost:27017/card-gateway",
    "secretKey": "AVeryLongsecretKey",
    "domain": "http://localhost:3000/v1",
    "refundWebhookUrl": "",
    "redisUrl": ""
}


module.exports = config[env];