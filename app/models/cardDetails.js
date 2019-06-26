const CardSchema = require('../database/schemas/cardDetails');
const Utils = require('../utils/utils');
const Contants = require('../utils/constants');
const ErrorHandler = require('../responseHandlers/errorHandler');

let Card = {};

/**
 * function returns the card details of a card Number
 * @param {String} cardNo - card Number of debit card or credit card
 * @return {Promise} - returns the promise object of success or err
 */
Card.getCard = async function (cardNo) {

    try {

        let cardDetails = CardSchema.findOne({ "cardNo": cardNo }, { __v: 0, _id: 0 }).lean();
        return cardDetails;
    }
    catch (err) {
        Utils.logs(Contants.ERROR, err);
        throw new Error(ErrorHandler.Contants.INTERNAL_SERVER_ERROR);
    }
}

/**
 * function saves the card details in the database
 * @param {object} cardDetails - Object contains the card details
 * @return {Promise} - returns the Promise object of success and err
 */
Card.saveCardDetails = async function (cardObj) {

    try {

        let cardSchema = new CardSchema(cardObj);
        let cardSaveResponse = await cardSchema.save();
        return cardSaveResponse;
    }
    catch (err) {

        Utils.logs(Contants.ERROR, err);
        throw new Error(ErrorHandler.Contants.INTERNAL_SERVER_ERROR);

    }
}


module.exports = Card;