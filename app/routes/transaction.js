const Express = require('express');
let router = Express.Router();

const TransactionController = require('../controllers/transaction');
const AuthMiddleware = require('../middleware/auth');




router.post('/payment', AuthMiddleware.verifyParameters, TransactionController.newTransaction);
router.get('/payment/:txId', AuthMiddleware.verifyParameters, TransactionController.getTransaction);

router.post('/refund', AuthMiddleware.verifyParameters, TransactionController.refund);

router.post('/bank/payment/:txId', TransactionController.bankPaymentResponse);

router.post('/bank/refund/:rId', TransactionController.bankRefundResponse);


router.post('/currency/new', AuthMiddleware.verifyParameters, TransactionController.addNewCurrency);
router.post('/card/new', AuthMiddleware.verifyParameters, TransactionController.addNewCard);

module.exports = router;
