const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();

mongoose.connect("mongodb://localhost:27017/userDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

//Defining user schema
const userSchema = new mongoose.Schema({
  email: String,
  password: String,
});

const secret = "Thisisthesecretkeyforthedatabase";
userSchema.plugin(encrypt, { secret, encryptedFields: ["password"] });

const User = new mongoose.model("User", userSchema);

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/home", (req, res) => {
  res.render("home");
});

app.get("/login", (req, res) => {
  res.render("login");
});
app.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  User.findOne({ email: username }, (e, foundUser) => {
    if (e) {
      console.log(e);
    } else {
      if (foundUser) {
        if (foundUser.password === password) {
          res.render("/secrets");
        }
      }
    }
  });
});

app.get("/register", (req, res) => {
  res.render("register");
});
app.post("/register", (req, res) => {
  const newUser = new User({
    email: req.body.username,
    password: req.body.password,
  });

  newUser.save((e) => {
    if (e) {
      console.log(e);
    } else {
      res.render("secrets");
    }
  });
});

app.listen(3000, () => {
  console.log("Server is up at port 3000");
});
