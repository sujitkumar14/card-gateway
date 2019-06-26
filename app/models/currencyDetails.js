const CurrencyDetailsSchema = require('../database/schemas/currencyDetails');
const ErrorHandler = require('../responseHandlers/errorHandler');
const Utils = require('../utils/utils');
const Constants = require('../utils/constants');


let Currency = {};

/**
 * function to save currency in the DB
 * @param {Object} currencyObj - contains all the currency fields
 * @return {Promise} - Promise object of success or err
 */
Currency.saveNewCurrency = async function (currencyObj) {

    try {

        let currencyDetailsSchema = new CurrencyDetailsSchema(currencyObj);
        let saveResponse = await currencyDetailsSchema.save();
        return saveResponse;
    }
    catch (err) {
        if (err.code === 11000) {
            Utils.logs(Constants.ERROR, err);
            throw new Error(ErrorHandler.message.DUBLICATE_ENTRY);
        }
        else {
            Utils.logs(Constants.ERROR, err);
            throw new Error(ErrorHandler.message.INTERNAL_SERVER_ERROR);
        }
    }
}

/**
 * function returns the currency details by currencyCode
 * @param {String} currencyCode - currency code
 * @return {Promise} - Promise object of success or err
 */

Currency.getDetails = async function (currencyCode) {

    try {

        let currencyDetails = CurrencyDetailsSchema.findOne({ "code": currencyCode }, { __v: 0, _id: 0 }).lean();
        return currencyDetails;
    }
    catch (err) {

        Utils.logs(Constants.ERROR, err);
        throw new Error(ErrorHandler.message.INTERNAL_SERVER_ERROR);

    }
}
module.exports = Currency;