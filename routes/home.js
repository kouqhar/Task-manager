const router = require("express").Router();

// Load controllers
const { homePage } = require("../controllers/homepage");

router.get("/", homePage);

module.exports = router;
