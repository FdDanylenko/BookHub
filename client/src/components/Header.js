import { Link, useNavigate } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import CustomerDataContext from "../context/CustomerDataContext";
import server from "../api/server";

const Header = () => {
  const { cartItems, customer, addToCart, setPopUpState } =
    useContext(CustomerDataContext);
  const [searchInput, setSearchInput] = useState("");
  const [searchInputOpen, setSearchInputOpen] = useState("closed");
  const [finalPrice, setFinalPrice] = useState(0);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const bookPromises = cartItems.map(async (item) => {
          const response = await server.get(`/books/search/${item.code}`);
          return response.data;
        });
        const booksData = await Promise.all(bookPromises);
        setFinalPrice(() => {
          let result = 0;
          booksData.forEach((books) => {
            result += parseInt(
              [...books][0].price *
                (customer ? 0.8 : 1 - [...books][0].discount)
            );
          });
          return result;
        });
      } catch (error) {
        console.error("Error fetching books:", error);
      }
    };

    fetchBooks();
  }, [cartItems]);

  return (
    <header className="header">
      <div className="logo-box">
        <Link to={"/"}>
          <div className="logo"></div>
        </Link>
      </div>
      <div className="headerNav">
        <div className="user-nav">
          <div
            className={`navItem search ${
              searchInputOpen === "open" ? "active" : ""
            }`}
            onClick={() => setSearchInputOpen("open")}
          >
            <div className="search-icon nav-icon"></div>
            <input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  setSearchInputOpen("closed");
                  setSearchInput("");
                  navigate(`/category/${searchInput}`);
                }
              }}
              className={`searchInput ${
                searchInputOpen === "open" ? "active" : ""
              }`}
              type="text"
              placeholder="Назва книги, автор або код"
            ></input>
            <div
              onMouseLeave={() => {
                setSearchInputOpen("closed");
              }}
              className={`clearSearchInput ${
                searchInputOpen === "open" ? "active" : ""
              }`}
            >
              <svg class="multi-svg" viewBox="0 0 50 50">
                <path
                  class="multi-svg-path"
                  d="M37.304 11.282l1.414 1.414-26.022 26.02-1.414-1.413z"
                ></path>
                <path
                  class="multi-svg-path"
                  d="M12.696 11.282l26.022 26.02-1.414 1.415-26.022-26.02z"
                ></path>
              </svg>
            </div>
          </div>
          <Link
            className="navItem login"
            onClick={() => {
              if (!customer) {
                setPopUpState("active");
              }
            }}
            style={{ textDecoration: "none", color: "black" }}
          >
            <div className="profile-icon nav-icon"></div>
            <div>
              {customer ? (
                <Link
                  className="cabinet"
                  to={"/cabinet"}
                  style={{ color: "black", textDecoration: "none" }}
                >
                  Кабінет
                </Link>
              ) : (
                "Вхід"
              )}
            </div>
          </Link>
          <div className="navItem payment">
            <div className="payment-icon nav-icon"></div>
            <div>Оплата</div>
          </div>
          <div className="navItem delivery">
            <div
              className={`delivery-icon nav-icon ${
                finalPrice >= 790 ? "done" : "unr"
              }`}
            ></div>
            <div>Безкоштовно від 790 грн</div>
          </div>
          <div className="navItem guaranties">
            <div>Гарантії</div>
          </div>
          <Link to={"/cart"} className="navItem cart">
            <div
              className={`nav-icon ${
                cartItems.length == 1
                  ? "cart-icon1"
                  : cartItems.length == 2
                  ? "cart-icon2"
                  : cartItems.length == 3
                  ? "cart-icon3"
                  : cartItems.length >= 4
                  ? "cart-icon4"
                  : "cart-icon"
              }`}
            ></div>
            <div className="cartCounter">{cartItems.length}</div>
          </Link>
        </div>
        <div className="books-nav">
          <div className="navMenu">
            <Link
              to={`/category/Художні`}
              className="genreLink"
              style={{ lineHeight: "40px" }}
            >
              Художні
            </Link>
            <div className="dropMenu">
              <div className="dropMenuOption">
                <Link to={`/category/Сучасні автори`} className="genreLink">
                  Сучасні автори
                </Link>
              </div>
              <div className="dropMenuOption">
                <Link to={`/category/Романтична проза`} className="genreLink">
                  Романтична проза
                </Link>
              </div>
              <div className="dropMenuOption">
                <Link to={`/category/Детективи`} className="genreLink">
                  Детективи
                </Link>
              </div>
              <div className="dropMenuOption">
                <Link
                  to={`/category/Історична та пригодницька проза`}
                  className="genreLink"
                >
                  Історична та пригодницька проза
                </Link>
              </div>
              <div className="dropMenuOption">
                <Link to={`/category/Трилери та жахи`} className="genreLink">
                  Трилери та жахи
                </Link>
              </div>
              <div className="dropMenuOption">
                <Link to={`/category/Фантастика`} className="genreLink">
                  Фантастика
                </Link>
              </div>
              <div className="dropMenuOption">
                <Link to={`/category/Фентезі`} className="genreLink">
                  Фентезі
                </Link>
              </div>
              <div className="dropMenuOption">
                <Link
                  to={`/category/Класична література`}
                  className="genreLink"
                >
                  Класична література
                </Link>
              </div>
              <div className="dropMenuOption">
                <Link to={`/category/Комікси та манґи`} className="genreLink">
                  Комікси та манґи
                </Link>
              </div>
            </div>
          </div>
          <div className="navMenu">
            <Link
              to={`/category/Прикладні`}
              className="genreLink"
              style={{ lineHeight: "40px" }}
            >
              Прикладні
            </Link>
            <div className="dropMenu">
              <div className="dropMenuOption">
                <Link
                  to={`/category/Історія, факти та біографії`}
                  className="genreLink"
                >
                  Історія, факти та біографії
                </Link>
              </div>
              <div className="dropMenuOption">
                <Link to={`/category/Психологія`} className="genreLink">
                  Психологія
                </Link>
              </div>
              <div className="dropMenuOption">
                <Link
                  to={`/category/Саморозвиток, мотивація`}
                  className="genreLink"
                >
                  Саморозвиток, мотивація
                </Link>
              </div>
              <div className="dropMenuOption">
                <Link to={`/category/Бізнес-література`} className="genreLink">
                  Бізнес-література
                </Link>
              </div>
              <div className="dropMenuOption">
                <Link to={`/category/Дозвілля та Хоббі`} className="genreLink">
                  Дозвілля та Хоббі
                </Link>
              </div>
              <div className="dropMenuOption">
                <Link to={`/category/Наукпоп`} className="genreLink">
                  Наукпоп
                </Link>
              </div>
              <div className="dropMenuOption">
                <Link to={`/category/Езотерика, таро`} className="genreLink">
                  Езотерика, таро
                </Link>
              </div>
            </div>
          </div>
          <div className="navMenu">
            <Link
              to={`/category/Дитячі`}
              className="genreLink"
              style={{ lineHeight: "40px" }}
            >
              Дитячі
            </Link>
            <div className="dropMenu">
              <div className="dropMenuOption">
                <Link to={`/category/Дітям до 4-х років`} className="genreLink">
                  Дітям до 4-х років
                </Link>
              </div>
              <div className="dropMenuOption">
                <Link to={`/category/Дітям 4-6 років`} className="genreLink">
                  Дітям 4-6 років
                </Link>
              </div>
              <div className="dropMenuOption">
                <Link to={`/category/Дітям 7-12 років`} className="genreLink">
                  Дітям 7-12 років
                </Link>
              </div>
              <div className="dropMenuOption">
                <Link to={`/category/Дітям від 12 років`} className="genreLink">
                  Дітям від 12 років
                </Link>
              </div>
              <div className="dropMenuOption">
                <Link
                  to={`/category/Шкільна та Навчальна`}
                  className="genreLink"
                >
                  Шкільна та Навчальна
                </Link>
              </div>
              <div className="dropMenuOption">
                <Link to={`/category/Розвиваючі книги`} className="genreLink">
                  Розвиваючі книги
                </Link>
              </div>
              <div className="dropMenuOption">
                <Link to={`/category/Казки і повісті`} className="genreLink">
                  Казки і повісті
                </Link>
              </div>
            </div>
          </div>
          <div className="navMenu">
            <Link
              to={`/category/Спецпропозиції`}
              className="genreLink"
              style={{ lineHeight: "40px" }}
            >
              Спецпропозиції
            </Link>
            <div className="dropMenu">
              <div className="dropMenuOption">
                <Link to={`/category/Ексклюзиви`} className="genreLink">
                  Ексклюзиви
                </Link>
              </div>
              <div className="dropMenuOption">
                <Link to={`/category/Книжки місяця`} className="genreLink">
                  Книжки місяця
                </Link>
              </div>
              <div className="dropMenuOption">
                <Link to={`/category/Новинки`} className="genreLink">
                  Новинки
                </Link>
              </div>
              <div className="dropMenuOption">
                <Link to={`/category/Анонси`} className="genreLink">
                  Анонси
                </Link>
              </div>
              <div className="dropMenuOption">
                <Link to={`/category/Новинки партнерів`} className="genreLink">
                  Новинки партнерів
                </Link>
              </div>
              <div className="dropMenuOption">
                <Link to={`/category/Хіти продажу`} className="genreLink">
                  Хіти продажу
                </Link>
              </div>
              <div className="dropMenuOption">
                <Link to={`/category/Подарункові книжки`} className="genreLink">
                  Подарункові книжки
                </Link>
              </div>
              <div className="dropMenuOption">
                <Link to={`/category/Розпродаж`} className="genreLink">
                  Розпродаж
                </Link>
              </div>
              <div className="dropMenuOption">
                <Link to={`/category/Останні примірники`} className="genreLink">
                  Останні примірники
                </Link>
              </div>
              <div className="dropMenuOption">
                <Link
                  to={`/category/Тимчасово немає у продажу`}
                  className="genreLink"
                >
                  Тимчасово немає у продажу
                </Link>
              </div>
            </div>
          </div>
          <div className="navMenu">Анонси BookHub</div>
        </div>
      </div>
    </header>
  );
};
export default Header;
