const mongoose = require('mongoose')
const Schema = mongoose.Schema
const orderSchema = new Schema({
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', require: true },
    items: { type: Object, require: true },
    phone: { type: String, require: true },
    paymentType: { type: String, default: 'COD' },
    status: { type: String, default: 'order_placed' },
    address: { type: String, require: true }
}, { timestamps: true })

module.exports = mongoose.model("Order", orderSchema)