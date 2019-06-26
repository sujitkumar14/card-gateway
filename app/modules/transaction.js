const PaymentTxModel = require('../models/paymentTx');
const RefundTxModel = require('../models/refundTx');
const SuccessHandler = require('../responseHandlers/successHandler');
const ErrorHandler = require('../responseHandlers/errorHandler');
const Constants = require('../utils/constants');
const TransactionHelper = require('../helpers/transaction');
const Utils = require('../utils/utils');
const CurrencyDetailsModel = require('../models/currencyDetails');
const CardDetailsModel = require('../models/cardDetails');
let Transaction = {};

/**
 * function saves the transactrion in mongo
 * @param {Object} transactionObj - contains transaction Details
 */
Transaction.newTransaction = async function (transactionObj) {

    try {


        if (transactionObj['type'] === Constants.DEBIT_CARD || transactionObj['type'] === Constants.CREDIT_CARD) {


            //check card already saved in database
            if (transactionObj['saveCard'] === true)
                await TransactionHelper.checkCard(transactionObj['cardNo'], transactionObj['cvv'], transactionObj['expiry']);


            //checking currency support and fetching details
            let currencyDetails = await CurrencyDetailsModel.getDetails(transactionObj['currencyCode']);
            if (!currencyDetails)
                throw new Error(ErrorHandler.message.CURRENCY_NOT_SUPPORTED);


            //////////////////////// Truncate decimal points based on the currency //////////////////////////
            transactionObj['amount'] = Utils.checkDecimals(transactionObj['amount'], currencyDetails['decimals']);



            //////////////////  DO ALL BANK CALLS HERE /////////////////////////////////
            //////////////////// HERE CARD DETAILS ARE REQUIRED //////////////////////

            let bankUrl = `http://localhost:4000/bank/${transactionObj['txId']}`;
            let status = Constants.PENDING;

            ///////////////////////////////////////////////////////////////////////




            //add transtion parameters to save in database
            transactionObj['typeId'] = transactionObj['cardNo'];
            transactionObj['status'] = status

            //save the tx in db
            await PaymentTxModel.saveTransaction(transactionObj);

            //response object
            let responseData = {
                'txId': transactionObj['txId'],
                'bankUrl': bankUrl,
                'amount': transactionObj['amount'],
                'status': status,
                'currencyCode': transactionObj['currencyCode']
            };

            return { "type": SuccessHandler.message.PENDING_TX, "data": responseData };


        }
        else {

            //tx type is not supported yet
            throw new Error(ErrorHandler.message.TX_TYPE_NOT_SUPPORTED);
        }

    }
    catch (err) {

        throw new Error(err.message);
    }
}


/**
 * function returns transaction details of txId by calling models
 * @param {string} txId - transaction Id
 */
Transaction.getTransaction = async function (txId) {

    try {

        let transactionDetailsAndRefund = await Promise.all([PaymentTxModel.getTransaction(txId), RefundTxModel.getAllRefundTxByTxId(txId)]);


        let transaction = transactionDetailsAndRefund[0];
        if (transaction) {
            //changing type based on cards
            transaction = TransactionHelper.changeTypeId(transaction);
            transaction['refundTxs'] = transactionDetailsAndRefund[1];

            return { "data": transaction, "type": SuccessHandler.message.TX_DETAILS };
        }
        else {

            throw new Error(ErrorHandler.message.TX_NOT_FOUND);
        }

    }
    catch (err) {

        throw new Error(err.message);
    }
}

/**
 * function process the bank transaction response
 * 1. check txId exist or not
 * 2. check already completed or failed
 * @param {string} txId - transaction Id
 * @param {string} status
 */
Transaction.processBankPaymentResponse = async function (txId, status) {

    try {

        let transactionDetails = await PaymentTxModel.getTransaction(txId);

        //verification of transaction
        if (!transactionDetails) {

            throw new Error(ErrorHandler.message.TX_NOT_FOUND);
        }
        else if (status !== Constants.COMPLETED && status !== Constants.FAILED) {
            throw new Error(ErrorHandler.message.INVALID_STATUS);
        }
        else if (transactionDetails['status'] === Constants.COMPLETED || transactionDetails['status'] === Constants.FAILED) {

            throw new Error(ErrorHandler.message.ALREADY_COMPLETED);
        }
        else {

            let query = {
                'txId': txId,
            };
            let update = {
                "$set": {
                    'status': status
                }
            }
            //updating the txs and giving back the response
            //send a response on the redirect url 
            await PaymentTxModel.updateTransaction(query, update);
            TransactionHelper.sendResponseToRedirectUrl(transactionDetails['redirectUrl'], { 'status': status });
            return { "type": SuccessHandler.message.SUCCESSFULLY_PROCESSED, data: {} };
        }
    }
    catch (err) {

        throw new Error(err.message);
    }
}


/**
 * function process Bank Refund Response i.e refund is completed or failed
 * @param {String} rid - refund Id
 * @param {String} status - [completed,failed]
 */
Transaction.processBankRefundResponse = async function (rId, status) {

    try {

        let refundDetails = await RefundTxModel.getDetails(rId);

        if (!refundDetails) {

            throw new Error(ErrorHandler.message.TX_NOT_FOUND);
        }
        else if (status !== Constants.COMPLETED && status !== Constants.FAILED) {
            throw new Error(ErrorHandler.message.INVALID_STATUS);
        }
        else if (refundDetails['status'] === Constants.COMPLETED || refundDetails['status'] === Constants.FAILED) {

            throw new Error(ErrorHandler.message.ALREADY_COMPLETED);
        }
        else {

            let query = {
                'rId': rId,
            };
            let update = {
                "$set": {
                    'status': status
                }
            }

            if (status === 'failed')
                await TransactionHelper.deductAmountInPaymentTx(refundDetails['txId'], 'refundedAmount', refundDetails['amount']);

            await RefundTxModel.updateRefundTx(query, update);

            return { "type": SuccessHandler.message.SUCCESSFULLY_PROCESSED, "data": {} };
        }
    }
    catch (err) {

        throw new Error(err.message);
    }
}


/**
 * function to refund the amount of txId
 * do the following things.
 * 1. check txId status is completed
 * 2. checks amount >= refunded amount
 * @param {object} refundObj   contains refund parameters
 * @return {promise} Success response or error
 * 
 */
Transaction.refund = async function (refundObj) {

    try {

        let transactionDetailsAndRefundDetails = await Promise.all([PaymentTxModel.getTransaction(refundObj['txId']), RefundTxModel.getDetails(refundObj['rId'])]);
        let transactionDetails = transactionDetailsAndRefundDetails[0];
        let refundDetails = transactionDetailsAndRefundDetails[1];

        if (!transactionDetails) {

            throw new Error(ErrorHandler.message.TX_NOT_FOUND);
        }
        else if (refundDetails) {

            throw new Error(ErrorHandler.message.ALREADY_REFUNDED);
        }
        else if (transactionDetails['status'] === 'failed') {
            //if refund is called for failed tx
            throw new Error(ErrorHandler.message.REFUND_FAILED_TX);
        }
        else if (!Utils.isGreaterOrEqual(Utils.safeMaths(transactionDetails['amount'], '-', transactionDetails['refundedAmount']), refundObj['amount'])) {
            //if amount is smaller than refund object amount
            throw new Error(ErrorHandler.message.REFUND_AMOUNT_MORE);
        }
        else {
            /// removing extra decimals ////
            let currencyDetails = await CurrencyDetailsModel.getDetails(transactionDetails['currencyCode']);
            refundObj['amount'] = Utils.checkDecimals(refundObj['amount'], currencyDetails['decimals']);



            //////////////////// DO NECESSARY BANK CALLS HERE ////////////////////////
            let status = Constants.COMPLETED;
            ////////////////////////////////////////////////////////////////////////

            //adding refund balance
            await TransactionHelper.addAmountInPaymentTx(transactionDetails['txId'], 'refundedAmount', refundObj['amount']);

            //setting status in refundObject
            refundObj['status'] = status;
            await RefundTxModel.saveRefundTx(refundObj);
            let response = {

                "txId": transactionDetails['txId'],
                "rid": refundObj['rId'],
                "amount": refundObj['amount'],
                "status": status
            };


            return { "type": SuccessHandler.message.SUCCESSFULLY_REFUNDED, 'data': response };

        }
    }
    catch (err) {

        throw new Error(err.message);
    }

}

/**
 * function to add new currency in the database
 * @param {object} currencyObj - contains all currency data
 * @returns {Promise} - Success or Failed
 */
Transaction.addNewCurrency = async function (currencyObj) {

    try {

        await CurrencyDetailsModel.saveNewCurrency(currencyObj);
        return { "type": SuccessHandler.message.CURRENCY_SAVED_SUCCESSFULLY, data: {} };
    }
    catch (err) {

        throw new Error(err.message);
    }
}


/**
 * function to add new card 
 * @param {object} cardObj contains all the card details
 * @returns {Promise} - Success or Failed
 */
Transaction.addNewCard = async function (cardObj) {

    try {

        await CardDetailsModel.saveCardDetails(cardObj);
        return { "type": SuccessHandler.message.CARD_SAVED_SUCCESSFULLY, "data": {} };

    }
    catch (err) {

        throw new Error(err.message);
    }
}
module.exports = Transaction;


