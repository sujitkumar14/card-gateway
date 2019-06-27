
const RefundTxSchema = require('../database/schemas/refundTx');
const Utils = require('../utils/utils');
const Contants = require('../utils/constants');
const ErrorHandler = require('../responseHandlers/errorHandler');

let RefundTx = {};

/**
 * function saveRefundTransaction saves the refund info in db
 * @param {object} refundObj - contains the refund details
 * @return {Promise} - returns the Promise object of success or err
 */
RefundTx.saveRefundTx = async function (refundObj) {

    try {

        let refundSchema = new RefundTxSchema(refundObj);
        let saveResponse = await refundSchema.save();
        return saveResponse;
    }
    catch (err) {

        if (err.code === 11000) {
            Utils.logs(Contants.ERROR, err);
            throw new Error(ErrorHandler.message.DUBLICATE_ENTRY);
        }
        else {
            Utils.logs(Contants.ERROR, err);
            throw new Error(ErrorHandler.message.INTERNAL_SERVER_ERROR);
        }
    }
}

/**
 * function returns the refund details by refund Id
 * @param {String} rId  - refund Id
 * @return {Promise} - returns the Promise object of Success or err
 */
RefundTx.getDetails = async function (rId) {

    try {

        let refundDetails = await RefundTxSchema.findOne({ 'rId': rId }, { __v: 0, _id: 0 }).lean();
        return refundDetails;
    }
    catch (err) {

        Utils.logs(Contants.ERROR, err);
        throw new Error(ErrorHandler.message.INTERNAL_SERVER_ERROR);
    }
}

/**
 * function returns the refund details by refund Id
 * @param {String} query  -  refund Query
 * @return {Promise} - returns the Promise object of Success or err
 */
RefundTx.getDetailsFromQuery = async function(query){

    try {

        let refundDetails = await RefundTxSchema.findOne({ query }, { __v: 0, _id: 0 }).lean();
        return refundDetails;
    }
    catch (err) {

        Utils.logs(Contants.ERROR, err);
        throw new Error(ErrorHandler.message.INTERNAL_SERVER_ERROR);
    }
}

/**
 * function to return refund tx for a txId
 * @param {string} TxId - tx Id
 * @return {Promise} - returns the promise object of success or err
 */
RefundTx.getAllRefundTxByTxId = async function (txId) {

    try {

        let refundTxs = await RefundTxSchema.find({ "txId": txId }, { __v: 0, _id: 0 }).lean();
        return refundTxs;
    }
    catch (err) {

        Utils.logs(Contants.ERROR, err);
        throw new Error(ErrorHandler.message.INTERNAL_SERVER_ERROR);
    }
}


/**
 * function to update the refund tx based on query object and update object
 * @param {object} query - 
 * @param {object} update
 */
RefundTx.updateRefundTx = async function (query, update) {

    try {

        let updateResponse = await RefundTxSchema.findOneAndUpdate(query, update, { new: true }).lean();
        return updateResponse;

    }
    catch (err) {

        Utils.logs(Contants.ERROR, err);
        throw new Error(ErrorHandler.message.INTERNAL_SERVER_ERROR);
    }
}

module.exports = RefundTx;