
const ErrorHandler = require('../responseHandlers/errorHandler');
const Utils = require('../utils/utils');
let Auth = {};


/**
 * 
 * Middleware Function validates body parameters
 * @param {object} req - request Object
 * @param {Object} res - response object
 * @param {object} next - next object
 */
Auth.verifyParameters = function (req, res, next) {

    try {

        let body = JSON.stringify(req.body); //converting object to string
        let reqChecksum = req.headers['checksum'];
        let curChecksum = Utils.createHMAC256(body, _config['secretKey']);

        if (reqChecksum === curChecksum) {
            next();
        }
        else {

            ErrorHandler.sendResponse(res, ErrorHandler.message.INVALID_SIGNATURE);
        }
    }
    catch (err) {

        Utils.logs("Error", err);
        ErrorHandler.sendResponse(res, ErrorHandler.message.INTERNAL_SERVER_ERROR);
    }
}


module.exports = Auth;
