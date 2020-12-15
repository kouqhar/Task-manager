const router = require("express").Router();

// Load controllers
const { loginUser } = require("../controllers/login");

// Login  user
router.post("/login", loginUser);

module.exports = router;
