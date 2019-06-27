const Redis = require('redis');
const Utils = require('../utils/utils');
const Constants = require('../utils/constants');
let Debug = require('debug')('card-gateway:Redis');


let client = Redis.createClient(_config.redisUrl);



client.on("error", function (err) {

    Utils.logs(Constants.ERROR, err);
});


client.on('connect',function(){

    Debug("Redis connected");
});

module.exports = client;