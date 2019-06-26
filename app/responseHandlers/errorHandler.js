


let ErrorHandler = {};


ErrorHandler.message = {

    "INTERNAL_SERVER_ERROR": JSON.stringify({ "code": 500, "message": "Internal Server Error" }),
    "INVALID_PARAMETER": JSON.stringify({ "code": 400, "message": "Invalid Parameter" }),
    "INVALID_SIGNATURE": JSON.stringify({ "code": 401, "message": "Invalid Signature" }),
    "TX_NOT_FOUND": JSON.stringify({ "code": 200, "message": "Transaction not found" }),
    "ALREADY_COMPLETED": JSON.stringify({ "code": 200, "message": "Already completed transaction" }),
    "REFUND_FAILED_TX": JSON.stringify({ "code": 200, "message": "Refunding from a failed payment" }),
    "REFUND_AMOUNT_MORE": JSON.stringify({ "code": 200, "message": "Refund amount is more than the payment amount" }),
    "INVALID_CARD_DETAILS": JSON.stringify({ "code": 400, "message": "Invalid Card Details" }),
    "TX_TYPE_NOT_SUPPORTED": JSON.stringify({ "code": 200, "message": "Currently this transaction type if not supported yet" }),
    "CURRENCY_NOT_SUPPORTED": JSON.stringify({ "code": 200, "message": "Currency is not supported yet" }),
    "DUBLICATE_ENTRY": JSON.stringify({ "code": 200, "message": "dublicate entry" }),
    "INVALID_STATUS": JSON.stringify({ "code": 200, "message": "Invalid Status" }),
    "ALREADY_REFUNDED": JSON.stringify({"code": 200, "message": "already refunded"}),
    "NOT_FOUND": JSON.stringify({"code": 200, "message": "Not found"})
}


/**
 * 
 * @param {object} res - Response Object
 * @param {String} type - Type of Error Message Based on above messages
 * @param {String} description - optional Paramater Description - Why this error occurs 
 */
ErrorHandler.sendResponse = function (res, type, description) {

    let errorType = JSON.parse(type);



    let errorResponse = {

        'success': false,
        'message': errorType.message,
        'status': {
            'code': errorType.code,
            'description': description || ""
        }
    };

    res.status(errorType.code).send(errorResponse);

}

module.exports = ErrorHandler;