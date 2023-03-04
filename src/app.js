const mongoose = require("mongoose");
const express = require("express");
const app = express();
const path = require("path");
const hbs = require("hbs");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

const DBURL =
  "mongodb+srv://vaibhav0809:vaibhav00@cluster0.5zl84hs.mongodb.net/03_march?retryWrites=true&w=majority";

mongoose
  .connect(DBURL)
  .then(() => {
    console.log("DB connected..");
  })
  .catch((error) => {
    console.log(error);
  });

app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

const viewpath = path.join(__dirname, "../templetes/views");
app.set("view engine", "hbs");
app.set("views", viewpath);

const userrouter = require("../router/userrouter");
app.use("/", userrouter);

app.listen(9001, () => {
  console.log("server runing on port: " + 9001);
});
