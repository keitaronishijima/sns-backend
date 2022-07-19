const express = require("express");
const app = express();
const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");
const postRoute = require("./routes/posts");
const uploadRoute = require("./routes/upload");
const PORT = 3001;
const path = require("path");
const mongoose = require("mongoose");
require("dotenv").config();

mongoose
  .connect(process.env.MONGOURL)
  .then(() => {
    console.log("connecting db");
  })
  .catch((err) => {
    console.log(err);
  });
app.use("/images", express.static(path.join(__dirname, "public/images")))
app.use(express.json());
app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/posts", postRoute);
app.use("/api/upload", uploadRoute);


app.get("/", (req, res) => {
  res.send("hello express");
});

app.listen(PORT, () => console.log("server started"));
