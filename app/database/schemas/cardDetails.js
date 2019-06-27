const Mongoose = require('mongoose');

let Schema = Mongoose.Schema;


let cardDetails = new Schema({

    cardNo: { type: String, required: true },
    cvv: { type: String, required: true },
    expiry: { type: Number, required: true },
    createdAt: { type: Number, default: Date.now },
    updatedAt: { type: Number, default: Date.now }
});

module.exports = Mongoose.model("card_details", cardDetails);