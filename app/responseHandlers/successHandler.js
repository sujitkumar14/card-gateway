


let SuccessHandler = {};

/**
 * Custom Success Messages
 */
SuccessHandler.message = {

    "PENDING_TX": { "code": 200, "message": "pending transaction" },
    "TX_DETAILS": { "code": 200, "message": "transaction Details" },
    "SUCCESSFULLY_PROCESSED": { "code": 200, "message": "successfully processed" },
    "SUCCESSFULLY_REFUNDED": { "code": 200, "message": "successfully refunded" },
    "CURRENCY_SAVED_SUCCESSFULLY": { "code": 200, "message": "Currency saved successfully" },
    "CARD_SAVED_SUCCESSFULLY": { "code": 200, "message": "card saved successfully" }
}


/**
 * 
 * @param {object} res - Response Object
 * @param {Object} type - SuccessHandler.message
 * @param {object} datas - data of Success Response
 */
SuccessHandler.sendResponse = function (res, type, datas, redirectUrl, description) {

    if (!redirectUrl) {
        let successType = type;

        let successResponse = {

            'success': true,
            'message': successType.message,
            'data': datas,
            'status': {
                'code': successType.code,
                'description': "" || description
            }
        };

        res.status(successType.code).send(successResponse);
    }
    else {

        res.redirect(redirectUrl);
    }

}

module.exports = SuccessHandler;