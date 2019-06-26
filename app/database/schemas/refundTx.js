const Mongoose = require('mongoose');
const Contants = require('../../utils/constants');
let Schema = Mongoose.Schema;


let refundTx = new Schema({

    rId: { type: String, unique: true, index: true }, //refund id
    txId: { type: String, required: true },
    amount: { type: String, required: true },
    status: { type: String, default: Contants.PENDING, enum: [Contants.PENDING, Contants.COMPLETED, Contants.FAILED] },
    createdAt: { type: Number, default: Date.now },
    updatedAt: { type: Number, default: Date.now }
});


module.exports = Mongoose.model("refund_tx", refundTx);