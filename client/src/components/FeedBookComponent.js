import { useContext } from "react";
import { Link } from "react-router-dom";
import CustomerDataContext from "../context/CustomerDataContext";

const FeedBookComponent = ({ book, style }) => {
  const { cartItems, customer, addToCart } = useContext(CustomerDataContext);
  return (
    <div
      className="bookElementComponent"
      style={{
        ...style,
        display: "flex",
        width: "calc(100%)",
        padding: "60px 0px",
      }}
    >
      <div className="cover">
        <Link to={`/book/${book.title}`}>
          <img
            className="coverImg"
            src={`${book.characteristics.coverURL}`}
            style={{
              display: "block",
              width: "144px",
              height: "fit-content",
            }}
          ></img>
        </Link>
      </div>
      <div
        className="body"
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <div>
          <div className="author" style={{ marginBottom: "20px" }}>
            {book.author}
          </div>
          <div className="title" style={{ marginBottom: "15px" }}>
            <Link
              className="genreLink blue"
              style={{ color: "#006496" }}
              to={`/book/${book.title}`}
            >
              {book.title}
            </Link>
          </div>
          <div className="rate" style={{ marginBottom: "15px" }}>
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
        </div>
        <div
          className="description"
          style={{
            fontSize: "14px",
            maxHeight: "102px",
            // overflow: "hidden",
            marginTop: "auto",
          }}
          dangerouslySetInnerHTML={{
            __html: `${
              book.description.length <= 25
                ? book.description
                : book.description.replace("<br><br>", " ").slice(0, 270)
            }...`,
          }}
        ></div>
      </div>
      <div className="interactions">
        <div
          className="bookHubPrice"
          style={{
            marginBottom: "3px",
            fontSize: "16px",
            textDecoration: "line-through",
          }}
        >
          {book.price}
        </div>
        <div className="yourPriceValue" style={{ marginBottom: "16px" }}>
          {book.price * (customer ? 0.8 : 1 - book.discount)} грн
        </div>
        <div
          className={`${
            cartItems.some((item) => item.code === book.characteristics.code)
              ? "inCart"
              : "addToCart"
          }`}
          onClick={() => addToCart(book.characteristics.code, book.price)}
        ></div>
      </div>
    </div>
  );
};

export default FeedBookComponent;
