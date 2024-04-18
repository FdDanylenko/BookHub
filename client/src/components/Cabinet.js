import { useEffect, useState, useContext } from "react";
import CustomerDataContext from "../context/CustomerDataContext";
import { serverPrivate } from "../api/server";
import server from "../api/server";
import useServerPrivate from "../hooks/useServerPrivate";

const Cabinet = () => {
  const serverPrivate = useServerPrivate();
  const { customer, setCustomer } = useContext(CustomerDataContext);

  const [name, setName] = useState(customer?.name ? customer.name : "");
  const [surname, setSurname] = useState(
    customer?.surname ? customer.surname : ""
  );
  const [email, setEmail] = useState(customer?.email ? customer.email : "");
  const [phone, setPhone] = useState(customer?.phone ? customer.phone : "");
  const [city, setCity] = useState(customer?.city ? customer.city : "");

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
    setZipCode(customer?.zipCode);
    setOblast(customer?.oblast);
    setDistrict(customer?.district);
    setStreet(customer?.street);
    setHouse(customer?.house);
    setApartment(customer?.apartment);
  }, [customer]);

  const handleSubmitDataChanges = async () => {
    try {
      const response = await serverPrivate.post("/users/update", {
        name,
        surname,
        code: customer.code,
        email,
        phone,
        oblast,
        district,
        city,
        street,
        house,
        apartment,
        zipCode,
      });
      console.log(response);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchCustomer = async () => {
    try {
      const response = await server.post("/users", {
        code: customer.code,
      });
      setCustomer(response.data);
    } catch (err) {}
  };
  useEffect(() => {
    fetchCustomer();
  }, []);

  return (
    <main className="main">
      <div>
        <div>Ваш код: {`${customer?.code}`}</div>
      </div>
      <div>
        <div className="labelCart">{`Ім'я:`}</div>
        <input
          className="orderInput"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <div className="labelCart">{`Прізвище:`}</div>
        <input
          className="orderInput"
          type="text"
          value={surname}
          onChange={(e) => setSurname(e.target.value)}
        />
        <div className="labelCart">{`Електронна пошта:`}</div>
        <input
          className="orderInput"
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <div className="labelCart">{`Номер телефону:`}</div>
        <input
          className="orderInput"
          type="text"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
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
      <button onClick={() => handleSubmitDataChanges()}>Оновити дані</button>
    </main>
  );
};

export default Cabinet;
