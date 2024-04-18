import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import server from "../api/server";
import CustomerDataContext from "../context/CustomerDataContext";

const Cart = () => {
  const { cartItems, customer, setCartItems, removeFromCart } =
    useContext(CustomerDataContext);
  const [books, setBooks] = useState([]);
  const [price, setPrice] = useState(0);
  const [finalPrice, setFinalPrice] = useState(0);
  const [productTypeOption, setProductTypeOption] = useState("physical");
  const [deliveryOption, setDeliveryOption] = useState();

  const [paymentOption, setPaymentOption] = useState();

  const [email, setEmail] = useState(customer?.email ? customer.email : "");
  const [city, setCity] = useState(customer?.city ? customer.city : "");
  const [department, setDepartment] = useState("");
  const [postOffice, setPostOffice] = useState("");

  const [zipCode, setZipCode] = useState(
    customer?.zipCode ? customer.zipCode : ""
  );
  const [oblast, setOblast] = useState(customer?.oblast ? customer.oblast : "");
  const [district, setDistrict] = useState(
    customer?.district ? customer.district : ""
  );
  const [street, setStreet] = useState(customer?.street ? customer.street : "");
  const [house, setHouse] = useState(customer?.house ? customer.house : "");
  const [apartment, setApartment] = useState(
    customer?.apartment ? customer.apartment : ""
  );

  useEffect(() => {
    setEmail(customer?.email);
    setCity(customer?.city);
    setDepartment(customer?.department);
    setPostOffice(customer?.postOffice);
    setZipCode(customer?.zipCode);
    setOblast(customer?.oblast);
    setDistrict(customer?.district);
    setStreet(customer?.street);
    setHouse(customer?.house);
    setApartment(customer?.apartment);
  }, [customer]);

  const handleSubmitOrder = async () => {
    if (!books) return;
    if (!deliveryOption) return;
    if (
      deliveryOption === "Відділення Нової пошти" &&
      (!city || !department || !email)
    )
      return;
    if (
      deliveryOption === "Поштомат Нової пошти" &&
      (!city || !department || !email)
    )
      return;
    if (
      (deliveryOption === "Доставка Укрпоштою" ||
        deliveryOption === "Доставка кур'єром Meest") &&
      (!oblast ||
        !district ||
        !city ||
        !street ||
        !house ||
        !apartment ||
        !zipCode ||
        !email)
    )
      return;
    try {
      const response = await server.post("/orders", {
        code: "328967834286",
        customer: {
          name: customer?.name ? customer.name : "",
          surname: customer?.surname ? customer.surname : "",
          code: customer?.code ? `${customer.code}` : "",
          email: email,
          phone: customer?.phone ? customer.phone : "",
        },
        books: [...cartItems],
        delivery: {
          deliveryType: deliveryOption,
          oblast,
          district,
          city,
          street,
          house,
          apartment,
          zipCode,
          department,
          postOffice,
        },
        payment: paymentOption,
        sumUAH: finalPrice,
        status: "Запит",
      });
      console.log(response);
      setCartItems([]);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const bookPromises = cartItems.map(async (item) => {
          const response = await server.get(`/books/search/${item.code}`);
          return response.data;
        });
        const booksData = await Promise.all(bookPromises);
        setBooks(() => {
          let result = [];
          booksData.forEach((books) => {
            result = [...result, ...books];
          });
          return result;
        });
        setPrice(() => {
          let result = 0;
          booksData.forEach((books) => {
            result += parseInt([...books][0].price);
          });
          return result;
        });
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
  }, [cartItems, customer]);
  return (
    <main
      className="main"
      style={{ display: "flex", padding: "0px 20px", flexDirection: "column" }}
    >
      <div
        style={{
          fontSize: "18px",
          color: "#000000",
          marginBottom: "0px",
          width: "100%",
          textAlign: "center",
        }}
      >
        Ваш «Кошик»
      </div>
      {books.length ? (
        <>
          <div className="cartContainer">
            <div className="booksSwitch">
              <div
                className={`switchOption physical ${
                  productTypeOption == "physical" ? "selected" : ""
                }`}
                onClick={() => {
                  setProductTypeOption("physical");
                }}
              >
                Фізичні товари
              </div>
              <div
                className={`switchOption ebooks ${
                  productTypeOption == "ebooks" ? "selected" : ""
                }`}
                onClick={() => {
                  setProductTypeOption("ebooks");
                }}
              >
                Електронні товари товари
              </div>
            </div>
            <div className="labelsContainer">
              <div className="label">№</div>
              <div className="label">Назва товару</div>
              <div className="label">Інформація про ціни</div>
              <div className="label">Кількість</div>
              <div className="label">Видалити</div>
            </div>
            <div className="purchasesContainer">
              {books.map((book, index) => (
                <div className="cartItemContainer" key={book.code}>
                  <div className="bookIndex">{index + 1}</div>
                  <div className="briefInfo">
                    <div className="itemCover">
                      <Link to={`/book/${book.title}`}>
                        <img
                          className="coverImg"
                          src={`${book.characteristics.coverURL}`}
                          style={{
                            display: "block",
                            width: "29px",
                            height: "fit-content",
                          }}
                        ></img>
                      </Link>
                    </div>
                    <div className="data">
                      <div>{book.author}</div>
                      <div className="titleDate">
                        <Link to={`/book/${book.title}`}>{book.title}</Link>
                      </div>
                      <div>Код товару: {book.characteristics.code}</div>
                    </div>
                  </div>
                  <div
                    className="prices"
                    style={{ display: "flex", flexDirection: "column" }}
                  >
                    <div
                      className="prCont"
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      Роздрібна ціна: <div>{book.price}</div>
                    </div>
                    <div
                      className="prCont"
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        fontSize: "14px",
                        color: "#c50023",
                      }}
                    >
                      Ваша ціна:{" "}
                      <div>
                        {book.price * (customer ? 0.8 : 1 - book.discount)}
                      </div>
                    </div>
                  </div>
                  <div className="amount">
                    <input
                      className="input"
                      value={1}
                      // value={
                      //   cartItems[books.findIndex((b) => b.code === book.code)]
                      //     .amount
                      // }
                      // onChange={(event) => {
                      //   const newValue = event.target.value;
                      //   const bookIndex = books.findIndex(
                      //     (b) => b.code === book.code
                      //   );
                      //   const updatedCartItems = [...cartItems];
                      //   updatedCartItems[bookIndex].amount = newValue;
                      //   setCartItems(updatedCartItems);
                      // }}
                      type="text"
                      maxLength="3"
                      style={{
                        textAlign: "center",
                        width: "25px",
                        marginRight: "10px",
                      }}
                    />{" "}
                    шт
                  </div>
                  <div
                    className="deleteButton"
                    onClick={() => removeFromCart(book.characteristics.code)}
                  ></div>
                </div>
              ))}
            </div>
            <div
              className="finalPriceContainer"
              style={{
                position: "relative",
                width: "40%",
                left: "50%",
                marginTop: "50px",
                height: "60px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <div
                style={{
                  fontWeight: "bold",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                Сума: <div>{price} грн</div>
              </div>
              <div
                style={{
                  color: "#484848",
                  fontSize: "11px",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                Економія за клубними/спеццінами:{" "}
                <div>-{price - finalPrice} грн</div>
              </div>
              <div
                style={{
                  fontWeight: "bold",
                  color: "#c50023 ",
                  fontSize: "14px",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                РАЗОМ: <div>{finalPrice} грн</div>
              </div>
            </div>
          </div>
          <div className="deliveryPaymentContainer">
            <div
              style={{
                fontSize: "18px",
                color: "#4d4d4d",
                marginTop: "10px",
                width: "100%",
                textAlign: "left",
              }}
            >
              1. Виберіть спосіб доставки
              <div
                onClick={() => setDeliveryOption("Відділення Нової пошти")}
                className={`option ${
                  deliveryOption === "Відділення Нової пошти" ? "active" : ""
                }`}
              >
                <div className="optionHeader">
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <div className="optionIcon"></div>Відділення Нової пошти
                  </div>
                </div>
                <div className="optionBody">
                  <div>
                    Термін: <span>2-3 дні</span>
                  </div>
                  <div style={{ marginBottom: "20px" }}>
                    Вартість:{" "}
                    <span>{finalPrice > 790 ? "1 грн" : "60 грн"}</span>
                  </div>
                  <div className="labelCart">Виберіть місто:</div>
                  <input
                    className="orderInput"
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  />
                  <div className="labelCart">
                    Виберіть відділення Нової пошти:
                  </div>
                  <input
                    className="orderInput"
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                  />
                  <div className="labelCart">
                    {`Електронна пошта (обов'язково):`}
                  </div>
                  <input
                    className="orderInput"
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
              <div
                onClick={() => setDeliveryOption("Доставка Укрпоштою")}
                className={`option ${
                  deliveryOption === "Доставка Укрпоштою" ? "active" : ""
                }`}
              >
                <div className="optionHeader">
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <div className="optionIcon"></div>Доставка Укрпоштою
                  </div>
                </div>
                <div className="optionBody">
                  <div>
                    Термін: <span>3-7 днів</span>
                  </div>
                  <div style={{ marginBottom: "20px" }}>
                    Вартість:{" "}
                    <span>{finalPrice > 790 ? "1 грн" : "44 грн"}</span>
                  </div>
                  <div className="labelCart">{`Електронна пошта (обов'язково):`}</div>
                  <input
                    className="orderInput"
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <div className="labelCart">Область:</div>
                  <input
                    className="orderInput"
                    type="text"
                    value={oblast}
                    onChange={(e) => setOblast(e.target.value)}
                  ></input>
                  <div className="labelCart">Район:</div>
                  <input
                    className="orderInput"
                    type="text"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                  ></input>
                  <div className="labelCart">Місто/село:</div>
                  <input
                    className="orderInput"
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  ></input>
                  <div className="labelCart">Індекс:</div>
                  <input
                    className="orderInput"
                    type="text"
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value)}
                  ></input>
                  <div className="labelCart">Вулиця:</div>
                  <input
                    className="orderInput"
                    type="text"
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                  ></input>
                  <div className="labelCart">Будинок:</div>
                  <input
                    className="orderInput"
                    type="text"
                    value={house}
                    onChange={(e) => setHouse(e.target.value)}
                  ></input>
                  <div className="labelCart">Квартира:</div>
                  <input
                    className="orderInput"
                    type="text"
                    value={apartment}
                    onChange={(e) => setApartment(e.target.value)}
                  ></input>
                </div>
              </div>
              <div
                onClick={() => setDeliveryOption("Поштомат Нової пошти")}
                className={`option ${
                  deliveryOption === "Поштомат Нової пошти" ? "active" : ""
                }`}
              >
                <div className="optionHeader">
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <div className="optionIcon"></div>Поштомат Нової пошти
                  </div>
                </div>
                <div className="optionBody">
                  <div>
                    Термін: <span>2-3 дні</span>
                  </div>
                  <div style={{ marginBottom: "20px" }}>
                    Вартість:{" "}
                    <span>{finalPrice > 790 ? "1 грн" : "60 грн"}</span>
                  </div>
                  <div className="labelCart">Виберіть місто:</div>
                  <input
                    className="orderInput"
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  ></input>
                  <div className="labelCart">
                    Виберіть поштомат Нової пошти:
                  </div>
                  <input
                    className="orderInput"
                    type="text"
                    value={postOffice}
                    onChange={(e) => setPostOffice(e.target.value)}
                  ></input>
                  <div className="labelCart">{`Електронна пошта (обов'язково):`}</div>
                  <input
                    className="orderInput"
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
              <div
                onClick={() => setDeliveryOption("Кур'єр Meest")}
                className={`option ${
                  deliveryOption === "Кур'єр Meest" ? "active" : ""
                }`}
              >
                <div className="optionHeader">
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <div className="optionIcon"></div>Кур'єр Meest
                  </div>
                </div>
                <div className="optionBody">
                  <div>
                    Термін: <span>3-5 днів</span>
                  </div>
                  <div style={{ marginBottom: "20px" }}>
                    Вартість:{" "}
                    <span>{finalPrice > 790 ? "1 грн" : "65 грн"}</span>
                  </div>
                  <div className="labelCart">{`Електронна пошта (обов'язково):`}</div>
                  <div className="labelCart">{`Електронна пошта (обов'язково):`}</div>
                  <input
                    className="orderInput"
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <div className="labelCart">Область:</div>
                  <input
                    className="orderInput"
                    type="text"
                    value={oblast}
                    onChange={(e) => setOblast(e.target.value)}
                  ></input>
                  <div className="labelCart">Район:</div>
                  <input
                    className="orderInput"
                    type="text"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                  ></input>
                  <div className="labelCart">Місто/село:</div>
                  <input
                    className="orderInput"
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  ></input>
                  <div className="labelCart">Індекс:</div>
                  <input
                    className="orderInput"
                    type="text"
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value)}
                  ></input>
                  <div className="labelCart">Вулиця:</div>
                  <input
                    className="orderInput"
                    type="text"
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                  ></input>
                  <div className="labelCart">Будинок:</div>
                  <input
                    className="orderInput"
                    type="text"
                    value={house}
                    onChange={(e) => setHouse(e.target.value)}
                  ></input>
                  <div className="labelCart">Квартира:</div>
                  <input
                    className="orderInput"
                    type="text"
                    value={apartment}
                    onChange={(e) => setApartment(e.target.value)}
                  ></input>
                </div>
              </div>
              2. Виберіть спосіб оплати
              <div
                onClick={() => setPaymentOption("Оплата карткою онлайн")}
                className={`option ${
                  paymentOption === "Оплата карткою онлайн" ? "active" : ""
                }`}
              >
                <div className="optionHeader">
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <div className="optionIcon"></div>Оплата карткою онлайн
                  </div>
                </div>
                <div className="optionBody">
                  Оплата замовлення карткою Visa або Mastercard через сервіс
                  UAPAY
                </div>
              </div>
              <div
                onClick={() => setPaymentOption("Оплата під час отримання")}
                className={`option ${
                  paymentOption === "Оплата під час отримання" ? "active" : ""
                }`}
              >
                <div className="optionHeader">
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <div className="optionIcon"></div>Оплата під час отримання
                  </div>
                </div>
                <div className="optionBody">
                  Оплата замовлення у відділенні, кур’єрові, через мобільний
                  застосунок оператора доставки.
                </div>
              </div>
              <div>
                <button
                  className="submitOrderButton"
                  onClick={() => handleSubmitOrder()}
                >
                  Усе правильно, надіслати замовлення
                </button>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <div style={{ marginTop: "30px" }}>
            У вашому кошику ще немає товарів
          </div>
          <div>
            Щоб додати будь-який товар до «Кошика», необхідно натиснути на
            кнопку{" "}
            <div
              style={{
                marginTop: "20px",
                display: "inline-block",
                width: "93px",
                height: "22px",
                backgroundImage: "url(./img/button_card_red_ua.svg)",
                backgroundSize: "cover",
              }}
            ></div>
            , яка розташована поруч з обраним Вами товаром
          </div>
          <div style={{ marginTop: "25px" }}>Бажаємо приємних покупок!</div>
        </>
      )}
    </main>
  );
};

export default Cart;
