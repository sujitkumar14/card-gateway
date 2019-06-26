
const Mongoose = require('mongoose');


let Schema = Mongoose.Schema;

let CurrencyDetails = new Schema({

    name: { type: String, required: true },
    code: { type: String, unique: true , index: true},
    decimals: { type: Number, required: true },
    country: { type: String, required: true },
    createdAt: { type: Number, default: Date.now },
    updatedAt: { type: Number, default: Date.now }

});

module.exports = Mongoose.model("currencyDetails", CurrencyDetails);