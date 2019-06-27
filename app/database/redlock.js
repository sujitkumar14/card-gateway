const RedLock = require('redlock');
const RedisClient = require('./redisConnection');

let redlock = new RedLock(

    [RedisClient],
    {
        retryCount: 10,
        retryDelay: 200,
        retryJitter: 200
    }
);

module.exports = redlock;