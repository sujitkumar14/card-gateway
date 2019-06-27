const RedisClient = require('../database/redisConnection');
const RedLock = require('../database/redlock');
const Contants = require('./constants');

let Redis = {};

/**
 * function set key in Redis
 * @param {string} key
 * @param {string} value
 */
Redis.set = function (key, value) {

    RedisClient.set(key, value);
}

/**
 * function return Redis value of a key
 * @param {string} key
 */
Redis.get = function (key) {

    return new Promise((resolve, reject) => {

        RedisClient.get(key, (err, value) => {
            if (err)
                reject(err);
            resolve(value);
        });
    });
}


/**
 * function to lock the resources in redis
 * @param {string} resource - A key which we want to lock
 * @param {Number} ttl - time to live in milli seconds
 */
Redis.lock = function(resource,ttl){

    return new Promise((resolve,reject)=>{

        RedLock.lock(resource,ttl)
        .then((lock)=>{
            resolve(lock);
        })
        .catch((err)=>{
            reject(Contants.FAILED_TO_LOCK); //code means Error while acquiring a lock
        });
    });
}

/**
 * function to unlock the RedLock resource from Redis
 * @param {string} lock - RedLock Lock function
 */
Redis.unlock = function(lock){

    return lock.unlock();
}

module.exports = Redis;