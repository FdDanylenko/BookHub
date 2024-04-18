import { Link, useParams } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import server from "../api/server";
import CustomerDataContext from "../context/CustomerDataContext";
import useServerPrivate from "../hooks/useServerPrivate";

const BookPage = () => {
  const { code } = useParams();
  const [book, setBook] = useState();
  const { cartItems, addToCart } = useContext(CustomerDataContext);
  const { customer, setCustomer } = useContext(CustomerDataContext);
  const [commentInput, setCommentInput] = useState("");
  const [rateWidth, setRateWidth] = useState(0);
  const [rate, setRate] = useState(0);
  const serverPrivate = useServerPrivate();

  const roundToNearest = (num) => {
    const x = 89.5 / 5;
    return num > x * 4
      ? x * 5
      : num > x * 3
      ? x * 4
      : num > x * 2
      ? x * 3
      : num > x
      ? x * 2
      : x;
  };

  const handleMouseEnter = (event) => {
    const rect = event.target.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    setRateWidth(roundToNearest(mouseX));
  };
  const fetchBook = async () => {
    try {
      const response = await serverPrivate.get(`books/search/${code}`);
      setBook(response.data[0]);
    } catch (error) {
      console.error("Error fetching book:", error);
    }
  };
  const fetchCustomer = async () => {
    try {
      const response = await server.post("/users", { code: customer.code });
      setCustomer(response.data);
    } catch (err) {}
  };

  useEffect(() => {
    fetchBook();
  }, []);

  const clearRate = async (id, rate) => {
    try {
      const response = await serverPrivate.post(`books/addRateToComment`, {
        code: book.characteristics.code,
        surname: customer.surname,
        rate: { id, value: rate },
      });
    } catch (err) {
      console.log(err.message);
    }
  };

  const addRateToComment = async (id, rate, double = false) => {
    try {
      if (double) {
        const response = await serverPrivate.post(`books/addRateToComment`, {
          code: book.characteristics.code,
          surname: customer.surname,
          rate: { id, value: rate },
        });
      }
      clearRate(id, rate);
      const responseU = await serverPrivate.post(`users/update`, {
        surname: customer.surname,
        code: customer.code,
        commentsRates: [
          ...customer.commentsRates.filter((item) => item.id !== id),
          { id, rate },
        ],
      });
      fetchCustomer();
      fetchBook();
    } catch (err) {
      console.log(err.message);
    }
  };
  const removeRateFromComment = async (id, rate) => {
    try {
      clearRate(id, rate * -1);
      const responseU = await serverPrivate.post(`users/update`, {
        surname: customer.surname,
        code: customer.code,
        commentsRates: [
          ...customer.commentsRates.filter((item) => item.id !== id),
        ],
      });
      fetchCustomer();
      fetchBook();
    } catch (err) {
      console.log(err.message);
    }
  };

  useEffect(() => {
    fetchBook();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await serverPrivate.post("/books/addComment", {
        code: book.characteristics.code,
        surname: customer.surname,
        comment: {
          authorCode: customer.code,
          body: commentInput,
          dateTime: new Date(),
        },
      });
      if (rate > 0) {
        const x = 89.5 / 5;
        const submitRate =
          rate > x * 4
            ? 5
            : rate > x * 3
            ? 4
            : rate > x * 2
            ? 3
            : rate > x
            ? 2
            : 1;
        await serverPrivate.post("/books/addRate", {
          code: book.characteristics.code,
          rate: {
            author: customer.code,
            value: submitRate,
          },
        });
        await serverPrivate.post(`users/update`, {
          surname: customer.surname,
          code: customer.code,
          booksRates: [
            ...customer.booksRates.filter(
              (item) => item.code !== book.characteristics.code
            ),
            { code: book.characteristics.code, rate: submitRate },
          ],
        });
      }
      setCommentInput("");
      fetchCustomer();
      fetchBook();
    } catch (err) {}
  };

  return (
    <>
      {book == undefined && <main>Not found</main>}
      {book != undefined && (
        <main>
          <div className="briefInfo">
            <div className="cover">
              <img
                className="coverImg"
                src={`${book.characteristics.coverURL}`}
                style={{
                  display: "block",
                  width: "fit-content",
                  height: "fit-content",
                }}
              ></img>
            </div>
            <div className="body">
              <div className="title">{book.title}</div>
              <div className="author">{book.author}</div>
              <div className="rate">
                {book.rates.length ? (
                  <svg
                    width="90"
                    height="16"
                    viewBox="0 0 90 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clip-path="url(#clip0)">
                      <rect
                        width="89.5"
                        height="16"
                        fill="black"
                        fill-opacity="0"
                      ></rect>
                      <path
                        d="M26.621 0L29.8032 4.62839L35.2419 6.11146L31.7264 10.4405L31.949 16L26.621 14.1513L21.2929 16L21.6258 10.4405L18 6.11146L23.5874 4.62839L26.621 0Z"
                        fill="#D8D8D8"
                      ></path>
                      <path
                        d="M44.621 0L47.8032 4.62839L53.2419 6.11146L49.7264 10.4405L49.949 16L44.621 14.1513L39.2929 16L39.6258 10.4405L36 6.11146L41.5874 4.62839L44.621 0Z"
                        fill="#D8D8D8"
                      ></path>
                      <path
                        d="M62.621 0L65.8032 4.62839L71.2419 6.11146L67.7264 10.4405L67.949 16L62.621 14.1513L57.2929 16L57.6258 10.4405L54 6.11146L59.5874 4.62839L62.621 0Z"
                        fill="#D8D8D8"
                      ></path>
                      <path
                        d="M80.621 0L83.8032 4.62839L89.2419 6.11146L85.7264 10.4405L85.949 16L80.621 14.1513L75.2929 16L75.6258 10.4405L72 6.11146L77.5874 4.62839L80.621 0Z"
                        fill="#D8D8D8"
                      ></path>
                      <path
                        d="M8.62097 0L11.8032 4.62839L17.2419 6.11146L13.7264 10.4405L13.949 16L8.62097 14.1513L3.29292 16L3.62585 10.4405L0 6.11146L5.58742 4.62839L8.62097 0Z"
                        fill="#D8D8D8"
                      ></path>
                      <mask
                        id="mask0"
                        mask-type="alpha"
                        maskUnits="userSpaceOnUse"
                        x="0"
                        y="0"
                        width="90"
                        height="16"
                      >
                        <path
                          d="M26.621 0L29.8032 4.62839L35.2419 6.11146L31.7264 10.4405L31.949 16L26.621 14.1513L21.2929 16L21.6258 10.4405L18 6.11146L23.5874 4.62839L26.621 0Z"
                          fill="#D8D8D8"
                        ></path>
                        <path
                          d="M44.621 0L47.8032 4.62839L53.2419 6.11146L49.7264 10.4405L49.949 16L44.621 14.1513L39.2929 16L39.6258 10.4405L36 6.11146L41.5874 4.62839L44.621 0Z"
                          fill="#D8D8D8"
                        ></path>
                        <path
                          d="M62.621 0L65.8032 4.62839L71.2419 6.11146L67.7264 10.4405L67.949 16L62.621 14.1513L57.2929 16L57.6258 10.4405L54 6.11146L59.5874 4.62839L62.621 0Z"
                          fill="#D8D8D8"
                        ></path>
                        <path
                          d="M80.621 0L83.8032 4.62839L89.2419 6.11146L85.7264 10.4405L85.949 16L80.621 14.1513L75.2929 16L75.6258 10.4405L72 6.11146L77.5874 4.62839L80.621 0Z"
                          fill="#D8D8D8"
                        ></path>
                        <path
                          d="M8.62097 0L11.8032 4.62839L17.2419 6.11146L13.7264 10.4405L13.949 16L8.62097 14.1513L3.29292 16L3.62585 10.4405L0 6.11146L5.58742 4.62839L8.62097 0Z"
                          fill="#D8D8D8"
                        ></path>
                      </mask>
                      <g mask="url(#mask0)">
                        <rect
                          width={`${
                            (89.5 / 5) *
                            (book.rates.reduce(
                              (accumulator, rate) => accumulator + rate.value,
                              0
                            ) /
                              book.rates.length)
                          }`}
                          height="18"
                          fill="#F1A909"
                        ></rect>
                      </g>
                    </g>
                    <defs>
                      <clipPath id="clip0">
                        <rect width="89.5" height="16" fill="white"></rect>
                      </clipPath>
                    </defs>
                  </svg>
                ) : (
                  <div style={{ opacity: "50%" }}>немає оцінок</div>
                )}
              </div>
              <div className="shortInfo">
                {book.characteristics.coverType}, {book.characteristics.pages}{" "}
                {" с., "}
                {book.characteristics.format.width}
                {"x"}
                {book.characteristics.format.height}
                {" мм"}
              </div>
              <div className="divider"></div>
              <div className="price">
                <div className="pricesBox">
                  <span className="inline-block price-label yourPrice">
                    Ваша ціна
                  </span>
                  <span className="inline-block yourPriceValue">
                    {book.price * (customer ? 0.8 : 1 - book.discount)} грн
                  </span>
                  <span className="inline-block price-label bookHubPrice">
                    Роздрібна ціна
                  </span>
                  <span className="inline-block bookHubPriceValue">
                    {book.price} грн
                  </span>
                </div>
                <div
                  className={`${
                    cartItems.some(
                      (item) => item.code === book.characteristics.code
                    )
                      ? "inCart"
                      : "addToCart"
                  }`}
                  onClick={() =>
                    addToCart(book.characteristics.code, book.price)
                  }
                ></div>
              </div>
              <div className="divider"></div>
            </div>
          </div>
          <div className="bookDescription">
            <div
              style={{
                color: "#c50023",
                fontSize: "18px",
                borderBottom: "1px solid #c50023",
                paddingBottom: "10px",
                marginBottom: "25px",
              }}
            >
              Опис книги
            </div>
            <p
              style={{
                display: "block",
                lineHeight: "22px",
                paddingTop: "10px",
                paddingBottom: "0px",
              }}
              dangerouslySetInnerHTML={{ __html: book.description }}
            ></p>
          </div>
          <div className="bookCharacteristics">
            <div
              style={{
                color: "#c50023",
                fontSize: "18px",
                borderBottom: "1px solid #c50023",
                paddingBottom: "10px",
                marginBottom: "25px",
              }}
            >
              Характеристики
            </div>
            <div
              style={{
                display: "block",
                lineHeight: "22px",
                paddingTop: "10px",
                paddingBottom: "40px",
                display: "flex",
              }}
            >
              <div
                style={{
                  marginRight: "100px",
                  marginLeft: "40px",
                  color: "#9098a6",
                }}
              >
                Код товару
                <br />
                Назва товару
                <br />
                Автор
                <br />
                Мова
                <br />
                Оригінальна назва
                <br />
                Мова оригіналу
                <br />
                Обкладинка
                <br />
                Сторінок
                <br />
                Формат
                <br />
                Видавництво
                <br />
                Рік видання
                <br />
                ISBN
                <br />
                Розділ
                <br />
              </div>
              <div>
                {book.characteristics.code}
                <br />
                {book.characteristics.title}
                <br />
                {book.characteristics.author}
                <br />
                {book.characteristics.language}
                <br />
                {book.characteristics.originalTitle}
                <br />
                {book.characteristics.originalLanguage}
                <br />
                {book.characteristics.coverType}
                <br />
                {book.characteristics.pages}
                <br />
                {book.characteristics.format.width}x
                {book.characteristics.format.height} см
                <br />
                {book.characteristics.publisher}
                <br />
                {book.characteristics.publicationYear}
                <br />
                {book.characteristics.isbn}
                <br />
                {book.characteristics.genre}
                <br />
              </div>
            </div>
          </div>
          <div className="comments">
            <div className="commentsHeader">
              <span className="comHeaderTitle">Відгуки: </span>
              <span className="comHeaderTitle">{book.comments.length}</span>
            </div>
            <div className="commentsContainer">
              {book.comments.map((comment) => (
                <div className="commentContainer">
                  <div className="commentAuthor">{comment.author}</div>
                  <div className="commentBody">{comment.body}</div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <div className="commentDateTime">{comment.dateTime}</div>
                    <div>
                      <span className="commentDateTime">Рейтинг відгуку:</span>
                      <span
                        className="commentRating"
                        style={{
                          width: customer ? "120px" : "40px",
                        }}
                      >
                        {customer ? (
                          <span
                            className={`rateComBtn negative ${
                              customer.commentsRates.some(
                                (item) =>
                                  item.id === comment._id && item.rate === -1
                              )
                                ? "active"
                                : ""
                            }`}
                            onClick={() => {
                              if (
                                !customer.commentsRates.some(
                                  (item) =>
                                    item.id === comment._id && item.rate === -1
                                )
                              ) {
                                if (
                                  customer.commentsRates.some(
                                    (item) =>
                                      item.id === comment._id && item.rate === 1
                                  )
                                ) {
                                  addRateToComment(comment._id, -1, true);
                                } else {
                                  addRateToComment(comment._id, -1);
                                }
                              } else {
                                removeRateFromComment(comment._id, -1);
                              }
                            }}
                          ></span>
                        ) : (
                          <></>
                        )}
                        <span
                          style={{ display: "inline-block", margin: "0 15px" }}
                        >
                          {comment.rating}
                        </span>
                        {customer ? (
                          <span
                            className={`rateComBtn positive ${
                              customer.commentsRates.some(
                                (item) =>
                                  item.id === comment._id && item.rate === 1
                              )
                                ? "active"
                                : ""
                            }`}
                            onClick={() => {
                              if (
                                !customer.commentsRates.some(
                                  (item) =>
                                    item.id === comment._id && item.rate === 1
                                )
                              ) {
                                if (
                                  customer.commentsRates.some(
                                    (item) =>
                                      item.id === comment._id &&
                                      item.rate === -1
                                  )
                                ) {
                                  addRateToComment(comment._id, 1, true);
                                } else {
                                  addRateToComment(comment._id, 1);
                                }
                              } else {
                                removeRateFromComment(comment._id, 1);
                              }
                            }}
                          ></span>
                        ) : (
                          <></>
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {customer ? (
            <div className="addCommentContainer">
              <form className="addCommentForm" onSubmit={handleSubmit}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <label htmlFor="comment">Ваш відгук:</label>
                  <div className="rateComment">
                    <span style={{ marginRight: "10px" }}>Оцініть товар:</span>
                    <div
                      onMouseMove={handleMouseEnter}
                      onMouseLeave={() => setRateWidth(0)}
                      onClick={() => setRate(rateWidth)}
                    >
                      <svg
                        width="90"
                        height="16"
                        viewBox="0 0 90 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g clip-path="url(#clip0)">
                          <rect
                            width="89.5"
                            height="16"
                            fill="black"
                            fill-opacity="0"
                          ></rect>
                          <path
                            d="M26.621 0L29.8032 4.62839L35.2419 6.11146L31.7264 10.4405L31.949 16L26.621 14.1513L21.2929 16L21.6258 10.4405L18 6.11146L23.5874 4.62839L26.621 0Z"
                            fill="#D8D8D8"
                          ></path>
                          <path
                            d="M44.621 0L47.8032 4.62839L53.2419 6.11146L49.7264 10.4405L49.949 16L44.621 14.1513L39.2929 16L39.6258 10.4405L36 6.11146L41.5874 4.62839L44.621 0Z"
                            fill="#D8D8D8"
                          ></path>
                          <path
                            d="M62.621 0L65.8032 4.62839L71.2419 6.11146L67.7264 10.4405L67.949 16L62.621 14.1513L57.2929 16L57.6258 10.4405L54 6.11146L59.5874 4.62839L62.621 0Z"
                            fill="#D8D8D8"
                          ></path>
                          <path
                            d="M80.621 0L83.8032 4.62839L89.2419 6.11146L85.7264 10.4405L85.949 16L80.621 14.1513L75.2929 16L75.6258 10.4405L72 6.11146L77.5874 4.62839L80.621 0Z"
                            fill="#D8D8D8"
                          ></path>
                          <path
                            d="M8.62097 0L11.8032 4.62839L17.2419 6.11146L13.7264 10.4405L13.949 16L8.62097 14.1513L3.29292 16L3.62585 10.4405L0 6.11146L5.58742 4.62839L8.62097 0Z"
                            fill="#D8D8D8"
                          ></path>
                          <mask
                            id="mask0"
                            mask-type="alpha"
                            maskUnits="userSpaceOnUse"
                            x="0"
                            y="0"
                            width="90"
                            height="16"
                          >
                            <path
                              d="M26.621 0L29.8032 4.62839L35.2419 6.11146L31.7264 10.4405L31.949 16L26.621 14.1513L21.2929 16L21.6258 10.4405L18 6.11146L23.5874 4.62839L26.621 0Z"
                              fill="#D8D8D8"
                            ></path>
                            <path
                              d="M44.621 0L47.8032 4.62839L53.2419 6.11146L49.7264 10.4405L49.949 16L44.621 14.1513L39.2929 16L39.6258 10.4405L36 6.11146L41.5874 4.62839L44.621 0Z"
                              fill="#D8D8D8"
                            ></path>
                            <path
                              d="M62.621 0L65.8032 4.62839L71.2419 6.11146L67.7264 10.4405L67.949 16L62.621 14.1513L57.2929 16L57.6258 10.4405L54 6.11146L59.5874 4.62839L62.621 0Z"
                              fill="#D8D8D8"
                            ></path>
                            <path
                              d="M80.621 0L83.8032 4.62839L89.2419 6.11146L85.7264 10.4405L85.949 16L80.621 14.1513L75.2929 16L75.6258 10.4405L72 6.11146L77.5874 4.62839L80.621 0Z"
                              fill="#D8D8D8"
                            ></path>
                            <path
                              d="M8.62097 0L11.8032 4.62839L17.2419 6.11146L13.7264 10.4405L13.949 16L8.62097 14.1513L3.29292 16L3.62585 10.4405L0 6.11146L5.58742 4.62839L8.62097 0Z"
                              fill="#D8D8D8"
                            ></path>
                          </mask>
                          <g mask="url(#mask0)">
                            <rect
                              width={`${rateWidth || rate}`}
                              height="18"
                              fill="#F1A909"
                            ></rect>
                          </g>
                        </g>
                        <defs>
                          <clipPath id="clip0">
                            <rect width="89.5" height="16" fill="white"></rect>
                          </clipPath>
                        </defs>
                      </svg>
                    </div>
                  </div>
                </div>
                <textarea
                  id="commentInput"
                  value={commentInput}
                  onChange={(e) => setCommentInput(e.target.value)}
                  required
                ></textarea>
                <button className="submitComment"></button>
              </form>
            </div>
          ) : (
            <></>
          )}
        </main>
      )}
    </>
  );
};

export default BookPage;
