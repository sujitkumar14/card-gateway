const Mongoose = require('mongoose');

let Schema = Mongoose.Schema;

let transactionSchema = new Schema({

    type: { type: String, required: true, enum: ["credit_card", "debit_card"] },
    typeId: { type: String, required: true }, //cardNo in case of credit card or debit card 
    txId: { type: String, unique: true, index: true },
    status: { type: String, default: "pending", enum: ["pending", "completed","failed"] },
    refundedAmount: { type: String, default: "0" },
    amount: { type: String, required: true },
    currencyCode: { type: String, required: true },
    redirectUrl: { type: String, default: null }, // at which success or failed response is pushed 
    createdAt: { type: Number, default: Date.now },
    updatedAt: { type: Number, default: Date.now }

});

module.exports = Mongoose.model("paymentTx", transactionSchema);