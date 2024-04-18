import { Route, Routes, useNavigate } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import AppLayout from "./components/AppLayout";
import Home from "./components/Home";
import Missing from "./components/Missing";
import BookPage from "./components/BookPage";
import server from "./api/server";
import Feed from "./components/Feed";
import Cart from "./components/Cart";
import CustomerDataContext, {
  CustomerDataProvider,
} from "./context/CustomerDataContext";
import LoginComponent from "./components/LoginComponent";
import Cabinet from "./components/Cabinet";

function App() {
  const { customer } = useContext(CustomerDataContext);
  return (
    <>
      <LoginComponent />
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route path="/" element={<Feed />} />
          {customer && <Route path="/cabinet" element={<Cabinet />} />}
          <Route path="category/:genre" element={<Feed />} />
          <Route path="book/:code" element={<BookPage />} />
          <Route path="cart" element={<Cart />} />
          <Route path="*" element={<Missing />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
