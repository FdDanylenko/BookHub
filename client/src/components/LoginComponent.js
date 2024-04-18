import { useContext, useEffect, useState } from "react";
import CustomerDataContext from "../context/CustomerDataContext";
import server from "../api/server";

const LoginComponent = () => {
  const {
    customer,
    setCustomer,
    accessToken,
    setAccessToken,
    popUpState,
    setPopUpState,
  } = useContext(CustomerDataContext);

  const [code, setCode] = useState("");
  const [surname, setSurname] = useState("");
  const [errMsg, setErrMsg] = useState("");

  useEffect(() => {
    setErrMsg("");
  }, [code, surname]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await server.post(
        "/users/login",
        { surname, code },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      console.log(response.data);
      setCustomer(response.data.user);
      setAccessToken(response.data.accessToken);
      setPopUpState("");
      setCode("");
      setSurname("");
    } catch (err) {
      setErrMsg(
        "Допущено помилку у вашому клубному номері або у прізвищі. Будь ласка, спробуйте ще раз."
      );
    }
  };

  return (
    <div
      className={`${
        popUpState === "active" ? "loginPopUpActive" : "loginPopUp"
      }`}
    >
      <div className="loginContainer">
        <div>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <div
              className="closeButton"
              onClick={() => setPopUpState("")}
            ></div>
          </div>
          <div className="formTitle">Вхід на сайт</div>
          <div className="loginErrorMessage">{errMsg}</div>
          <form onSubmit={handleSubmit}>
            <input
              className="loginInput"
              placeholder="Ваш номер клієнта або номер телефону"
              type="text"
              id="code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
            />
            <input
              className="loginInput"
              placeholder="Ваше прізвище"
              type="text"
              id="surname"
              value={surname}
              onChange={(e) => setSurname(e.target.value)}
              required
            />
            <button className="loginSubmitButton">Увійти</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginComponent;
