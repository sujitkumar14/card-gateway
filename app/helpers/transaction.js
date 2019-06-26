
const CardDetailsModel = require('../models/cardDetails');
const PaymentTxModel = require('../models/paymentTx');
const ErrorHandler = require('../responseHandlers/errorHandler');
const Request = require('request-promise');
const Utils = require('../utils/utils');
const Constants = require('../utils/constants');

let Transaction = {};

/**
 * function checks the card exist or not 
 * @param {string} cardNo - check Card 
 * @param {number} cvv - optional - require for a new card
 * @param {string} expiry - optional - require for a new card
 */
Transaction.checkCard = async function (cardNo, cvv, expiry) {

    try {

        let cardDetails = await CardDetailsModel.getCard(cardNo);

        if (!cardDetails && (!cvv || !expiry)) {

            throw new Error(ErrorHandler.message.INVALID_CARD_DETAILS);
        }
        else if (!cardDetails && cvv && expiry) {

            //save card in the db
            let cardObj = {
                "cardNo": cardNo,
                "cvv": cvv,
                "expiry": expiry
            };

            await CardDetailsModel.saveCardDetails(cardObj);
            return cardObj;
        }
    }
    catch (err) {

        throw new Error(err.message);
    }
}

/**
 * functoin to send response to a redirect Url
 * @param  {string} url - redirect URL
 * @param {string} status 
 */
Transaction.sendResponseToRedirectUrl = function (url, body) {

    try {

        let requestObj = {
            'method': 'POST',
            'url': url,
            'body': body,
            'headers': {
                'checksum': Utils.createHMAC256(JSON.stringify(body), _config['secretKey'])
            },
            'json': true
        };

        Request(requestObj);
    }
    catch (err) {

        Utils.logs(Constants.ERROR, err);
    }

}

/**
 * function change typeId key , based on tx Type
 * if type === card then typeId becomes cardNo
 * @param {object} transaction - transaction object
 */
Transaction.changeTypeId = function (transaction) {

    if (transaction && 'type' in transaction && 'typeId' in transaction) {
        let type = transaction['type'];
        let typeId = transaction['typeId'];
        if (type === Constants.CREDIT_CARD || type === Constants.DEBIT_CARD) {

            transaction['cardNo'] = typeId;
            delete transaction['typeId'];
        }
        else {

            Utils.logs(Constants.ERROR, "Invalid Type Id" + JSON.stringify(transaction));
            throw new Error(ErrorHandler.message.INTERNAL_SERVER_ERROR);
        }

        return transaction;
    }
    else {
        Utils.logs(Constants.ERROR, "Type not exist" + JSON.stringify(transaction));
        throw new Error(ErrorHandler.message.INTERNAL_SERVER_ERROR);
    }
}

/**
 * function add the amount in payment tx document 
 * @param {string} txId - transaction Id
 * @param {string} field - field at which addition needed
 * @param {string} amount - amount need to be added
 */
Transaction.addAmountInPaymentTx = async function (txId, field, amount) {

    try {
        let transactionDetails = await PaymentTxModel.getTransaction(txId);
        //update the transaction query
        let query = {
            'txId': txId
        };
        let update = {
            "$set": {
                [field]: Utils.safeMaths(transactionDetails[field], '+', amount)
            }
        }

        return await PaymentTxModel.updateTransaction(query, update);

    }
    catch (err) {

        throw new Error(err.message);
    }
}


/**
 * function deduct the amount in payment tx document 
 * @param {string} txId - transaction Id
 * @param {string} field - field at which addition needed
 * @param {string} amount - amount need to be added
 */
Transaction.deductAmountInPaymentTx = async function (txId, field, amount) {

    try {
        let transactionDetails = await PaymentTxModel.getTransaction(txId);
        //update the transaction query
        let query = {
            'txId': txId
        };
        let update = {
            "$set": {
                [field]: Utils.safeMaths(transactionDetails[field], '-', amount)
            }
        }

        return await PaymentTxModel.updateTransaction(query, update);

    }
    catch (err) {

        throw new Error(err.message);
    }
}


module.exports = Transaction;