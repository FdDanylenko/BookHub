const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderSchema = new Schema({
  code: Number,
  customer: {
    name: String,
    surname: String,
    code: Number,
    email: String,
    phone: String,
  },
  books: [],
  delivery: {
    deliveryType: String,
    oblast: String,
    district: String,
    city: String,
    street: String,
    house: String,
    apartment: String,
    zipCode: String,
    department: String,
    postOffice: String,
  },
  payment: String,
  sumUAH: Number,
  status: String,
});

module.exports = mongoose.model("Order", orderSchema);
