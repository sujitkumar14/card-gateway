const Mongoose = require('mongoose');

let Schema = Mongoose.Schema;


let refundTx = new Schema({

    rId: { type: String, unique: true, index: true }, //refund id
    txId: { type: String, required: true },
    amount: { type: String, required: true },
    status: { type: String, default: "pending", enum: ["pending", "completed", "failed"] },
    createdAt: { type: Number, default: Date.now },
    updatedAt: { type: Number, default: Date.now }
});


module.exports = Mongoose.model("refund_tx", refundTx);