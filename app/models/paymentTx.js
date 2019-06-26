const PaymentTxSchema = require('../database/schemas/paymentTx');
const ErrorHandler = require('../responseHandlers/errorHandler');
const Utils = require('../utils/utils');
const Contants = require('../utils/constants');

let Transaction = {};



/**
 * function saveTransaction saves the transaction in mongo db
 * @param {object}  transactionObj - contains the transactions details 
 * @returns {Promise} - returns the promise object of success or err
 */
Transaction.saveTransaction = async function (transactionObj) {

    try {

        let transactionSchema = new PaymentTxSchema(transactionObj);
        let saveResponse = await transactionSchema.save();
        return saveResponse;
    }
    catch (err) {
        Utils.logs(Contants.ERROR, err);
        throw new Error(ErrorHandler.message.INTERNAL_SERVER_ERROR);
    }
}


/**
 * function returns the transaction details 
 * @param {String}  txid - transaction id
 * @returns {Promise} - returns the Promise object of transaction details
 */
Transaction.getTransaction = async function (txid) {

    try {

        let transactionDetails = await PaymentTxSchema.findOne({ "txId": txid }, { __v: 0, _id: 0 }).lean();
        return transactionDetails;
    }
    catch (err) {
        Utils.logs(Contants.ERROR, err);
        throw new Error(ErrorHandler.message.INTERNAL_SERVER_ERROR);
    }
}


/**
 * function to update the transaction by using query and update object
 * and returns the updated document
 * @param {object} query 
 * @param {update} update
 */
Transaction.updateTransaction = async function (query, update) {

    try {

        let transactionDetails = await PaymentTxSchema.findOneAndUpdate(query, update, { new: true });
        return transactionDetails;
    }
    catch (err) {

        Utils.logs(Contants.ERROR, err);
        throw new Error(ErrorHandler.message.INTERNAL_SERVER_ERROR);
    }
}









module.exports = Transaction;