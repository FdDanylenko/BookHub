import { createContext, useEffect, useState } from "react";

const CustomerDataContext = createContext({});

export const CustomerDataProvider = ({ children }) => {
  const [customer, setCustomer] = useState(null);
  const [accessToken, setAccessToken] = useState();
  const [cartItems, setCartItems] = useState([
    ...(JSON.parse(localStorage.getItem("cartItems")) || []),
  ]);

  const [popUpState, setPopUpState] = useState("");
  const addToCart = (code, price) => {
    if (!cartItems.some((item) => item.code === code)) {
      setCartItems([...cartItems, { code: code, amount: 1, price: price }]);
      localStorage.setItem(
        "cartItems",
        JSON.stringify([...cartItems, { code: code, amount: 1, price: price }])
      );
    }
  };
  const removeFromCart = (code) => {
    if (cartItems.some((item) => item.code === code)) {
      setCartItems([...cartItems.filter((item) => item.code !== code)]);
      localStorage.setItem(
        "cartItems",
        JSON.stringify(
          [...cartItems.filter((item) => item.code !== code)] || []
        )
      );
    }
  };
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  };
  // ...
  return (
    <CustomerDataContext.Provider
      value={{
        cartItems,
        popUpState,
        customer,
        accessToken,
        setAccessToken,
        setCustomer,
        setPopUpState,
        setCartItems,
        addToCart,
        scrollToTop,
        removeFromCart,
      }}
    >
      {children}
    </CustomerDataContext.Provider>
  );
};

export default CustomerDataContext;
