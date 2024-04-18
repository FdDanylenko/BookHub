const Book = require("../model/Book");
const User = require("../model/User");

const getAllBooks = async (req, res) => {
  const books = await Book.find();
  if (!books) return res.status(204).json({ message: "No books found" });
  console.log(books);
  res.json(books);
};

const getBookById = async (req, res) => {
  if (!req.params.id)
    return res.status(204).json({ message: "ID is required" });
  const book = await Book.findOne({ _id: req.params.id }).exec();
  if (!book)
    return res
      .status(204)
      .json({ message: `No book with ID ${req.params.id} found` });
  res.status(200).json(book);
};

const getBooksByTitleAuthorCode = async (req, res) => {
  if (!req.params.query)
    return res
      .status(204)
      .json({ message: "Query(title, author or code) is required" });
  const books = await Book.find({
    $or: [
      { title: { $regex: new RegExp(req.params.query, "i") } },
      { author: { $regex: new RegExp(req.params.query, "i") } },
      { "characteristics.code": req.params.query },
    ],
  });
  if (!books)
    return res
      .status(204)
      .json({ message: `No books match ${req.params.query}` });
  res.status(200).json(books);
};

const getBooksByCategory = async (req, res) => {
  if (!req.params.category)
    return res.status(204).json({ message: "Category is required" });
  const books = await Book.find({
    "characteristics.category": req.params.category,
  });
  if (!books)
    return res
      .status(204)
      .json({ message: `No books in category ${req.params.category} found` });
  res.status(200).json(books);
};

const getBooksByGenre = async (req, res) => {
  if (!req.params.genre)
    return res.status(204).json({ message: "Genre is required" });
  const books = await Book.find({ "characteristics.genre": req.params.genre });
  if (!books)
    return res
      .status(204)
      .json({ message: `No books in genre ${req.params.genre} found` });
  res.status(200).json(books);
};

const addBook = async (req, res) => {
  const {
    title,
    author,
    description,
    price,
    discount,
    quantity,
    characteristics,
  } = req.body;
  if (
    !title ||
    !author ||
    !description ||
    !price ||
    !discount ||
    !quantity ||
    !characteristics
  ) {
    return res.status(400).json({ message: "Required data is missing" });
  }
  try {
    const result = await Book.create({
      title,
      author,
      description,
      price,
      discount,
      quantity,
      characteristics: {
        code: characteristics.code,
        title: characteristics.title,
        author: characteristics.author,
        language: characteristics.language,
        originalTitle: characteristics.originalTitle,
        originalLanguage: characteristics.originalLanguage,
        coverType: characteristics.coverType,
        coverURL: characteristics.coverURL,
        pages: characteristics.pages,
        format: {
          width: characteristics.format.width,
          height: characteristics.format.height,
        },
        publisher: characteristics.publisher,
        publicationYear: characteristics.publicationYear,
        isbn: characteristics.isbn,
        genre: characteristics.genre,
      },
      comments: [],
      rates: [],
    });
    res.sendStatus(201);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

const editBook = async (req, res) => {
  if (!req.body.id) return res.status(400).json({ message: "Id is required" });
  const book = await Book.findOne({ _id: req.body.id }).exec();
  if (!book)
    return res
      .status(204)
      .json({ message: `No book with id ${req.body.id} found` });
  if (req.body.price) book.price = req.body.price;
  if (req.body.discount) book.discount = req.body.discount;
  if (req.body.quantity) book.quantity = req.body.quantity;
  if (req.body.author) book.author = req.body.author;
  if (req.body.title) book.title = req.body.title;
  if (req.body.description) book.description = req.body.description;
  if (req.body.characteristics) book.characteristics = req.body.characteristics;
  const result = await book.save();
  res.status(200).json({ message: "Book has been updated" }, result);
};

const deleteBook = async (req, res) => {
  if (!req.body.id) return res.status(400).json({ message: "Id is required" });
  const book = await Book.findOne({ _id: req.body.id }).exec();
  if (!book)
    return res
      .status(204)
      .json({ message: `No book with id ${req.body.id} found` });
  const result = await Book.deleteOne({ _id: req.body.id });
  res.status(200).json({ message: "Book has been deleted" }, result);
};

const addComment = async (req, res) => {
  const code = req.body.code;
  const { authorCode, body, dateTime } = req.body.comment;
  if (!code || !authorCode || !body || !dateTime)
    return res.status(400).json({ message: "Invalid request" });
  const user = await User.findOne({ code: authorCode }).exec();
  if (!user)
    return res
      .status(204)
      .json({ message: `No user with code ${authorCode} found` });
  const book = await Book.findOne({ "characteristics.code": code }).exec();
  if (!book)
    return res
      .status(204)
      .json({ message: `No book with code ${req.body.code} found` });
  book.comments.push({
    author: `${user.name} ${user.surname}`,
    body,
    dateTime,
    rating: 0,
  });
  const result = await book.save();
  res.status(200).json({ message: "Comment added" });
};

const addRateToComment = async (req, res) => {
  const code = req.body.code;
  const { id, value } = req.body.rate;
  if (!code || !id || !value)
    return res.status(400).json({ message: "Invalid request" });
  const book = await Book.findOne({ "characteristics.code": code }).exec();
  if (!book) return res.status(204).json({ message: `No book found` });
  console.log(book);
  console.log(id);
  const foundCommentIndex = book.comments.findIndex((i) => {
    console.log(i._id);
    return i._id.equals(id);
  });
  if (foundCommentIndex == -1)
    return res.status(208).json({ message: "No such comment found" });
  book.comments[foundCommentIndex].rating += value;
  const result = await book.save();
  res.status(200).json({ message: "Comment rate added" });
};

const addRate = async (req, res) => {
  const code = req.body.code;
  const { author, value } = req.body.rate;
  if (!code || !author || !value)
    return res.status(400).json({ message: "Invalid request" });
  const book = await Book.findOne({ "characteristics.code": code }).exec();
  if (!book)
    return res
      .status(204)
      .json({ message: `No book with code ${req.body.code} found` });
  const existingRate = book.rates.find((item) => item.author === author);
  if (existingRate) {
    existingRate.value = value;
    book.rates = [
      ...book.rates.filter((item) => item.author !== author),
      existingRate,
    ];
  } else {
    book.rates.push({
      author,
      value,
    });
  }
  const result = await book.save();
  res.status(200).json({ message: "Rate added" });
};

module.exports = {
  getAllBooks,
  getBookById,
  getBooksByTitleAuthorCode,
  getBooksByCategory,
  getBooksByGenre,
  addBook,
  editBook,
  deleteBook,
  addComment,
  addRateToComment,
  addRate,
};
