let env = process.env.NODE_ENV || "development";


//configuration of an app
let config = {};


config.development = {

    "databaseUrl": process.env.DATABASE_URL || "mongodb://localhost:27017/card-gateway",
    "secretKey": process.env.SECRET_KEY || "AVeryLongsecretKey",
    "domain": process.env.DOMAIN || "http://localhost:3000/v1",
    "refundWebhookUrl": process.env.REFUND_WEBHOOK_URL || "",
    "redisUrl": process.env.REDIS_URL || "",
    "bankUrl": process.env.BANK_URL || "http://localhost:4000"
}


module.exports = config[env];