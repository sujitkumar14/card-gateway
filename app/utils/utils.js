

const Crypto = require('crypto');
const ErrorHandler = require('../responseHandlers/errorHandler');
const BigNumber = require('bignumber.js');

let Utils = {};

/**
 * function is to store or display logs based on the type
 * @param {string} type - type of a log [Error, log]
 * @param {string} msg - msg of a log
 */
Utils.logs = function (type, msg) {

    if (type === "Error") {

        console.error(msg);
    }
    else {
        console.log(msg);
    }
}

/**
 * validates the number is valid or not
 * @param {string|number} number 
 */
Utils.isValidNumber = function (number) {
    number = number.toString();
    if (!number) {

        return false;
    }
    else if (number === '0') {
        return false;
    }
    else if (isNaN(number)) {
        return false;
    }
    else if(Number(number)<0){
        return false;
    }
    else {
        return true;
    }
}


/**
 * function returns HMAC 256 of a message
 * @param {string} message 
 */
Utils.createHMAC256 = function (message, secretKey) {

    try {

        return Crypto.createHmac("sha256", secretKey).update(message).digest('hex');
    }
    catch (err) {

        throw new Error(ErrorHandler.message.INTERNAL_SERVER_ERROR);
    }
}

/**
 * 
 * function returns the exact safe maths value
 * @param {Number|string} firstOperand 
 * @param {string} operator - +,-,*,/
 * @param {Number|string} secOperand
 * @returns {String} result of two operand
 */
Utils.safeMaths = function (firstOperand, operator, secOperand) {

    let first = new BigNumber(firstOperand);
    let sec = new BigNumber(secOperand);
    let result;
    switch (operator) {

        case "+": result = first.plus(sec);
            break;
        case "-": result = first.minus(sec);
            break;

    }

    return result.toString();
}

/**
 * function compare that is firstOperand is greater than
 * or equal to secOperand 
 * @param {number|string} firstOperand
 * @param {number|string} secOperand
 * @returns {Boolean} 
 */
Utils.isGreaterOrEqual = function (firstOperand, secOperand) {

    let first = new BigNumber(firstOperand);
    let sec = new BigNumber(secOperand);
    let compare = first.comparedTo(sec);

    if (compare >= 0) {
        return true;
    }
    else {
        false;
    }
}

/**
 * function check the number for a decimal points
 * if decimals are more than desired it truncates extra decimals
 * else return the number
 * @param {number|string} num - Floating number or Interger
 * @param {Number} decimalPoints - Number of decimal Points to keep
 */
Utils.checkDecimals = function (num, decimalPoints) {

    num = num.toString().split(".");
    if (num[1]) {

        num[1] = num[1].substring(0, decimalPoints);
        return num.join(".");
    }
    else {
        return num.join("");
    }

}

/**
 * function sleep to time 
 * @param {number} time time in ms
 */
Utils.sleep = function(time){
    return new Promise((resolve,reject)=>{
        setTimeout(resolve,time);
    });
}

module.exports = Utils;