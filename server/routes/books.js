const express = require("express");
const verifyJWT = require("../middleware/verifyJWT");
const {
  getAllBooks,
  getBookById,
  getBooksByTitleAuthorCode,
  getBooksByCategory,
  getBooksByGenre,
  addBook,
  deleteBook,
  editBook,
  addComment,
  addRateToComment,
  addRate,
} = require("../controllers/booksController");
const router = express.Router();

router
  .route("/")
  .get(getAllBooks)
  .post(verifyJWT, addBook)
  .put(verifyJWT, editBook)
  .delete(verifyJWT, deleteBook);

router.get("/id/:id", getBookById);
router.get("/search/:query", getBooksByTitleAuthorCode);
router.get("/category/:category", getBooksByCategory);
router.get("/genre/:genre", getBooksByGenre);
router.post("/addComment", verifyJWT, verifyJWT, addComment);
router.post("/addRateToComment", verifyJWT, addRateToComment);
router.post("/addRate", verifyJWT, addRate);

module.exports = router;
