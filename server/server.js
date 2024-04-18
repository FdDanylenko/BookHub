require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const whiteList = require("./config/whiteList");
const app = express();
const PORT = process.env.PORT;
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URI);
  } catch (err) {
    console.log(err);
  }
};
connectDB();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || whiteList.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Access denied"));
      }
    },
    credentials: true,
    originsSuccessStatus: 200,
  })
);

app.use("/books", require("./routes/books"));
app.use("/orders", require("./routes/orders"));
app.use("/users", require("./routes/users"));
app.use("/db/images", require("./routes/imagesdb"));

mongoose.connection.once("open", () => {
  console.log("Connected to BookHubDB");
  app.listen(PORT, console.log(`Server runs on http://localhost:${PORT}`));
});
