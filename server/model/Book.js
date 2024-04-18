const mongoose = require("mongoose");
const { Schema } = mongoose;

const bookSchema = new Schema({
  title: String,
  author: String,
  description: String,
  price: String,
  discount: Number,
  quantity: Number,
  characteristics: {
    code: String,
    title: String,
    author: String,
    language: String,
    originalTitle: String,
    originalLanguage: String,
    coverType: String,
    coverURL: String,
    pages: Number,
    format: {
      width: Number,
      height: Number,
    },
    publisher: String,
    publicationYear: Number,
    isbn: String,
    category: String,
    genre: String,
  },
  comments: [
    {
      author: String,
      body: String,
      dateTime: String,
      rating: Number,
    },
  ],
  rates: [
    {
      author: String,
      value: Number,
    },
  ],
});

module.exports = mongoose.model("Book", bookSchema);
