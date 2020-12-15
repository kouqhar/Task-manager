const { static, json } = require("express");
const home = require("../routes/home");
const login = require("../routes/logins");
const register = require("../routes/registers");
const { error } = require("../middleware/error");

module.exports = function (app) {
  // View Engine
  app.set("view engine", "pug");
  app.set("views", "./views");

  // Add a middleware
  app.use(json());

  // Serve up static file
  app.use("/uploads", static("uploads"));

  // Routes
  app.use("/", home);
  app.use("/users", register);
  app.use("/auth", login);

  app.use(error);
};
