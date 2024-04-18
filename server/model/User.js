const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: String,
  surname: String,
  code: String,
  birthDate: String,
  email: String,
  phone: String,
  oblast: String,
  district: String,
  city: String,
  street: String,
  house: String,
  apartment: String,
  zipCode: String,
  cart: [],
  booksRates: [],
  commentsRates: [],
  wishlist: [],
  history: [],
  refreshToken: String,
});

module.exports = mongoose.model("User", userSchema);
