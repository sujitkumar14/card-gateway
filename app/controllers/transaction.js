const SuccessHandler = require('../responseHandlers/successHandler');
const ErrorHandler = require('../responseHandlers/errorHandler');
const TransactionModule = require('../modules/transaction');
const Utils = require('../utils/utils');
const Constants = require('../utils/constants');


let Transaction = {};

/**
 * function to handle payment endpoint
 * @param {object} req - request object
 * @param {object} res - resppnse object
 */
Transaction.newTransaction = async function (req, res) {

    try {

        let body = req.body;

        let txId = body['txId'];
        let amount = body['amount'];
        let currencyCode = body['currencyCode'];
        let redirectUrl = body['redirectUrl'];
        let type = body['type'];  //type of transaction  - card tx, netbanking tx, upi transaction 
        let cardNo = body['cardNo'];
        let expiry = body['expiry']; //optional paramaters required only for a new card tx
        let cvv = body['cvv']; //optional parameter required only for a new card tx
        let saveCard = body['saveCard'] //optional parameter required only for a new card tx

        //validation
        if (!txId) {

            ErrorHandler.sendResponse(res, ErrorHandler.message.INVALID_PARAMETER, "txId is required");
        }
        else if (!Utils.isValidNumber(amount)) {

            ErrorHandler.sendResponse(res, ErrorHandler.message.INVALID_PARAMETER, "amount is not a valid Number");
        }
        else if (!redirectUrl) {

            ErrorHandler.sendResponse(res, ErrorHandler.message.INVALID_PARAMETER, "redirectUrl is required");
        }
        else if (!type) {

            ErrorHandler.sendResponse(res, ErrorHandler.message.INVALID_PARAMETER, "type is required");
        }
        else if (!currencyCode) {

            ErrorHandler.sendResponse(res, ErrorHandler.message.INVALID_PARAMETER, "Currency code is required");
        }
        else if ((type === Constants.CREDIT_CARD || type === Constants.DEBIT_CARD) && !cardNo) {

            ErrorHandler.sendResponse(res, ErrorHandler.message.INVALID_PARAMETER, "Invalid card details");
        }
        else {

            let txObj = {
                txId,
                amount,
                redirectUrl,
                cardNo,
                type,
                expiry,
                cvv,
                saveCard,
                currencyCode
            }

            let newTransactionResponse = await TransactionModule.newTransaction(txObj);
            SuccessHandler.sendResponse(res, newTransactionResponse.type, newTransactionResponse.data);

        }

    }
    catch (err) {

        ErrorHandler.sendResponse(res, err.message);
    }
};

/**
 * function handle request of get transaction details endpoint - /transaction/:txId
 * @param {object} req - request object
 * @param {object} res - response object
 * 
 */
Transaction.getTransaction = async function (req, res) {

    try {

        let txId = req.params['txId'];
        let transactionDetails = await TransactionModule.getTransaction(txId);
        SuccessHandler.sendResponse(res, transactionDetails.type, transactionDetails.data);
    }
    catch (err) {

        ErrorHandler.sendResponse(res, err.message);
    }
}

/**
 * function handles bank payment response endpoint
 * @param {object} req - request Object
 * @param {object} res - response object
 */
Transaction.bankPaymentResponse = async function (req, res) {

    try {

        let txId = req.params['txId'];

        let processBankResponse = await TransactionModule.processBankPaymentResponse(txId);
        SuccessHandler.sendResponse(res, processBankResponse.type, processBankResponse.data, processBankResponse.redirectUrl);
    }
    catch (err) {

        ErrorHandler.sendResponse(res, err.message);
    }
}


/**
 * function handles bank refund response endpoint
 * @param {object} req - request object
 * @param {object} res - response object
 */
Transaction.bankRefundResponse = async function (req, res) {

    try {

        let rId = req.params['rId'];
        let status = req.body['status'];

        let processBankResponse = await TransactionModule.processBankRefundResponse(rId, status);
        SuccessHandler.sendResponse(res, processBankResponse.type, processBankResponse.data);
    }
    catch (err) {

        ErrorHandler.sendResponse(res, err.message);
    }
}

/**
 * function handle refund request 
 * @param {object} req - request object
 * @param {object} res - response object
 */
Transaction.refund = async function (req, res) {

    try {

        let body = req.body;
        let txId = body['txId'];
        let rId = body['rId']; //refund Id
        let amount = body['amount']; //amount needs to be refund


        //validating parameters
        if (!txId) {

            ErrorHandler.sendResponse(res, ErrorHandler.message.INVALID_PARAMETER, "txId is required");
        }
        else if (!rId) {

            ErrorHandler.sendResponse(res, ErrorHandler.message.INVALID_PARAMETER, "rId is required");
        }
        else if (!Utils.isValidNumber(amount)) {

            ErrorHandler.sendResponse(res, ErrorHandler.message.INVALID_PARAMETER, "amount is not a valid number");
        }
        else {

            let refundObj = {
                txId,
                rId,
                amount
            }
            let refundResponse = await TransactionModule.refund(refundObj);
            SuccessHandler.sendResponse(res, refundResponse.type, refundResponse.data);
        }

    }
    catch (err) {

        ErrorHandler.sendResponse(res, err.message);
    }
}



/**
 * function to handle currency/add/new request
 * @param {object} req - request object
 * @param {object} res - response object
 */
Transaction.addNewCurrency = async function (req, res) {

    try {

        let body = req.body;

        let name = body['name'];
        let code = body['code'];
        let decimals = body['decimals'];
        let country = body['country'];

        if (!name) {
            ErrorHandler.sendResponse(res, ErrorHandler.message.INVALID_PARAMETER, "Name is required");
        }
        else if (!code) {
            ErrorHandler.sendResponse(res, ErrorHandler.message.INVALID_PARAMETER, "Code is required");
        }
        else if (!Utils.isValidNumber(decimals)) {

            ErrorHandler.sendResponse(res, ErrorHandler.message.INVALID_PARAMETER, "Decimals is not a valid number");
        }
        else if (!country) {

            ErrorHandler.sendResponse(res, ErrorHandler.message.INVALID_PARAMETER, "country is required");
        }
        else {

            let currencyObj = {
                name,
                code,
                decimals,
                country
            };
            let saveCurrencyResponse = await TransactionModule.addNewCurrency(currencyObj);
            return SuccessHandler.sendResponse(res, saveCurrencyResponse.type, saveCurrencyResponse.data);

        }

    }
    catch (err) {

        ErrorHandler.sendResponse(res, err.message);
    }
}


/**
 * function to handle new card request
 * @param {object} req request object
 * @param {object} res response object
 */
Transaction.addNewCard = async function (req, res) {

    try {

        let body = req.body;

        let cardNo = body['cardNo'];
        let cvv = body['cvv'];
        let expiry = body['expiry'];

        if (!cardNo) {

            ErrorHandler.sendResponse(res, ErrorHandler.message.INVALID_PARAMETER, "Card No is required");
        }
        else if (!cvv) {

            ErrorHandler.sendResponse(res, ErrorHandler.message.INVALID_PARAMETER, "cvv is required");
        }
        else if (!expiry) {

            ErrorHandler.sendResponse(res, ErrorHandler.message.INVALID_PARAMETER, "Expiry is required");
        }
        else {

            let cardObj = {
                cardNo,
                cvv,
                expiry
            };

            let saveCardResponse = await TransactionModule.addNewCard(cardObj);
            SuccessHandler.sendResponse(res, saveCardResponse.type, saveCardResponse.data);
        }
    }
    catch (err) {

        ErrorHandler.sendResponse(res, err.message);
    }
}

module.exports = Transaction;