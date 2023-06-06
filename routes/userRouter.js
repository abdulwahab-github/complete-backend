const express = require("express");
const route = express.Router();
const {sendResponse} = require("../helper/helper");
const bcrypt = require("bcryptjs");
const userModel = require("../models/userModel")
const AuthController = require("../controllers/authControllers") 

route.post("/signup",AuthController.signup)
route.post("/login", AuthController.login)
route.get("/" ,AuthController.getuser )
route.get("/test", AuthController.protected, (req, res) => {
  res.send("/User Valid");
});

module.exports = route;
