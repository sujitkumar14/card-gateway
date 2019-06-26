const Mongoose = require('mongoose');

let Schema = Mongoose.Schema;


let cardDetails = new Schema({

    cardNo: { type: String, required: true },
    cvv: { type: Number, required: true },
    expiry: { type: String, required: true },
    createdAt: { type: Number, default: Date.now },
    updatedAt: { type: Number, default: Date.now }
});

module.exports = Mongoose.model("card_details", cardDetails);