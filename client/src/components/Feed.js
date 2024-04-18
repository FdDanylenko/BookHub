import { useState, useEffect, useDispatch, useContext } from "react";
import { useParams } from "react-router-dom";
import FeedBookComponent from "./FeedBookComponent";
import server from "../api/server";
import CustomerDataContext from "../context/CustomerDataContext";

const Feed = () => {
  const { genre } = useParams();
  const [books, setBooks] = useState([]);
  const [feedPortionOption, setFeedPortionOption] = useState(5);
  const [currentPage, setCurrentPage] = useState(0);
  const [feedSortOption, setFeedSortOption] = useState();

  const { scrollToTop } = useContext(CustomerDataContext);

  const sortBooks = (option) => {
    switch (option) {
      case "price":
        setBooks([...books.sort((a, b) => a.price - b.price)]);
        break;
      case "author":
        setBooks([...books.sort((a, b) => a.author.localeCompare(b.author))]);
        break;
      case "title":
        setBooks([...books.sort((a, b) => a.title.localeCompare(b.title))]);
        break;
    }
  };

  useEffect(() => {
    setBooks([]);
    const fetchBooksByGenre = async () => {
      try {
        const responseGenre = await server.get(`/books/genre/${genre}`);
        const responseCategory = await server.get(`/books/category/${genre}`);
        const response = await server.get(`/books/search/${genre}`);
        const data = responseGenre.data
          .concat(responseCategory.data)
          .concat(response.data);
        setBooks(data);
      } catch (error) {
        console.error("Error fetching books:", error);
      }
    };
    const fetchBooks = async () => {
      try {
        const response = await server.get("/books");
        setBooks(response.data);
      } catch (error) {
        console.error("Error fetching books:", error);
      }
    };
    if (genre) {
      fetchBooksByGenre();
    } else {
      fetchBooks();
    }
    sortBooks("title");
  }, [genre]);

  return (
    <main
      style={{
        display: "flex",
        padding: "0px 20px",
        flexDirection: "Column",
      }}
    >
      <div className="feedNavigation">
        <div style={{ display: "flex", alignItems: "center" }}>
          <div>Показувати по: </div>
          <div className="feedPortionsContainer feedSetting">
            <div
              className={`feedSettingOption ${
                feedPortionOption === 5 ? "selected" : ""
              }`}
              onClick={(e) => {
                setFeedPortionOption(5);
                setCurrentPage(0);
              }}
            >
              5
            </div>
            <div
              className={`feedSettingOption ${
                feedPortionOption === 10 ? "selected" : ""
              }`}
              onClick={(e) => {
                setFeedPortionOption(10);
                setCurrentPage(0);
              }}
            >
              10
            </div>
            <div
              className={`feedSettingOption ${
                feedPortionOption === 20 ? "selected" : ""
              }`}
              onClick={(e) => {
                setFeedPortionOption(20);
                setCurrentPage(0);
              }}
            >
              20
            </div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center" }}>
          <div>Сортувати за: </div>
          <div className="feedSortContainer feedSetting">
            <div
              className={`feedSettingOption ${
                feedSortOption === "price" ? "selected" : ""
              }`}
              onClick={(e) => {
                setFeedSortOption("price");
                sortBooks("price");
              }}
            >
              ціною
            </div>
            <div
              className={`feedSettingOption ${
                feedSortOption === "author" ? "selected" : ""
              }`}
              onClick={(e) => {
                setFeedSortOption("author");
                sortBooks("author");
              }}
            >
              автором
            </div>
            <div
              className={`feedSettingOption ${
                feedSortOption === "title" ? "selected" : ""
              }`}
              onClick={(e) => {
                setFeedSortOption("title");
                sortBooks("title");
              }}
            >
              назвою
            </div>
          </div>
        </div>
      </div>
      {books
        .slice(
          currentPage * feedPortionOption,
          feedPortionOption * (currentPage + 1) || books.length - 1
        )
        .map((book, index) => (
          <FeedBookComponent
            book={book}
            key={book.code}
            style={{
              borderTop:
                index === 0 ? "1px solid #cccccc" : "0px solid #cccccc",
              borderBottom: "1px solid #cccccc",
            }}
          />
        ))}
      <div className="feedPages">
        {Array.from(
          { length: Math.ceil(books.length / feedPortionOption) },
          (_, index) => index
        ).map((page) => (
          <div
            className={`pageElement ${page === currentPage ? "selected" : ""}`}
            key={page}
            onClick={() => {
              setCurrentPage(page);
              scrollToTop();
            }}
          >
            {page + 1}
          </div>
        ))}
      </div>
    </main>
  );
};

export default Feed;
