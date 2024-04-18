const User = require("../model/User");
const jwt = require("jsonwebtoken");
const { sendEmail } = require("../middleware/mailer");

const generateNewUserCode = async () => {
  const length = 7;
  let code = "";
  const characters = "0123456789";

  for (let i = 0; i < length; i++) {
    const index = Math.floor(Math.random() * characters.length);
    code += characters[index];
  }
  const duplicate = await User.findOne({ code }).exec();
  if (duplicate) {
    return generateNewUserCode();
  } else {
    return code;
  }
};

const getUserData = async (req, res) => {
  const code = req.body.code;
  if (!code) {
    return res.status(400).json({ message: "Code is required" });
  }
  const result = await User.findOne({ code }).exec();
  if (!result) return res.status(204).json({ message: "No user" });
  res.json(result);
};

const handleNewUser = async (name, surname, email) => {
  if (!email) {
    console.log("Email is required", email);
  }
  const code = await generateNewUserCode();
  const userData = {
    name: name ? name : `${code}`,
    surname: surname ? surname : `${code}`,
    code: `${code}`,
    email: email,
  };
  try {
    const result = await User.create(userData);
    console.log(result);
    console.log(email);
    sendEmail(email, code);
  } catch (error) {
    console.log(error.message);
  }
};

const handleAuth = async (req, res) => {
  const { surname, code } = req.body;
  if (!surname || !code) {
    return res.status(400).json({
      message: "Surname and code are required",
      body: `${req.body.code} ${req.body.surname}`,
    });
  }
  const foundUser = await User.findOne({ surname, code }).exec();
  if (!foundUser) {
    return res.sendStatus(401);
  }
  const accessToken = jwt.sign(
    {
      userInfo: {
        surname: foundUser.surname,
      },
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "5m" }
  );
  const refreshToken = jwt.sign(
    { surname: foundUser.surname },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "3d" }
  );
  foundUser.refreshToken = refreshToken;
  const result = await foundUser.save();
  res.cookie("jwt", refreshToken, {
    httpOnly: true,
    sameSite: "none",
    maxAge: 3 * 24 * 60 * 60 * 1000,
    secure: true,
  });
  return res.json({ accessToken, user: foundUser });
};

const handleLogout = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204);
  const refreshToken = cookies.jwt;

  const foundUser = await User.findOne({ refreshToken }).exec();
  if (!foundUser) {
    res.clearCookie("jwt", { httpOnly: true, sameSite: "None" }); // secure: true
    return res.sendStatus(404);
  }

  foundUser.refreshToken = "";
  const result = await foundUser.save();
  console.log(result);

  res.clearCookie("jwt", { httpOnly: true, sameSite: "None" }); // secure: true
  res.sendStatus(204);
};

const handleRefreshToken = async (req, res) => {
  const cookies = req.cookies;
  console.log(cookies);
  if (!cookies?.jwt) {
    return res.sendStatus(204);
  }
  const refreshToken = cookies.jwt;
  const foundUser = await User.findOne({ refreshToken }).exec();
  if (!foundUser) {
    return res.sendStatus(403);
  }
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err || foundUser.surname !== decoded.surname)
      return res.sendStatus(403);
    const accessToken = jwt.sign(
      {
        userInfo: {
          surname: foundUser.surname,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "5m" }
    );
    res.json({ accessToken });
  });
};

const handleUpdateProfile = async (req, res) => {
  const {
    name,
    surname,
    code,
    birthDate,
    email,
    phone,
    oblast,
    district,
    city,
    street,
    house,
    apartment,
    zipCode,
    cart,
    booksRates,
    commentsRates,
    wishlist,
    history,
  } = req.body;
  if (!surname || !code) {
    return res.status(400).json({ message: "Surname and code are required" });
  }
  const foundUser = await User.findOne({ surname, code }).exec();
  if (!foundUser) {
    return res.sendStatus(401);
  }
  if (name) foundUser.name = name;
  if (surname) foundUser.surname = surname;
  if (birthDate) foundUser.birthDate = birthDate;
  if (email) foundUser.email = email;
  if (phone) foundUser.phone = phone;
  if (oblast) foundUser.oblast = oblast;
  if (district) foundUser.district = district;
  if (city) foundUser.city = city;
  if (street) foundUser.street = street;
  if (house) foundUser.house = house;
  if (apartment) foundUser.apartment = apartment;
  if (zipCode) foundUser.zipCode = zipCode;
  if (cart) foundUser.cart = cart;
  if (booksRates) foundUser.booksRates = [...booksRates];
  if (commentsRates) foundUser.commentsRates = [...commentsRates];
  if (wishlist) foundUser.wishlist = wishlist;
  if (history) foundUser.history = history;
  const result = await foundUser.save();
  res.status(200).json({ message: "User has been updated" });
};

module.exports = {
  getUserData,
  handleNewUser,
  handleAuth,
  handleLogout,
  handleRefreshToken,
  handleUpdateProfile,
};
