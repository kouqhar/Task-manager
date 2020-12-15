const { verify } = require("jsonwebtoken");
const { User } = require("../models/User");
const { jwtSecretKey, hashAlgorithm } = require("../config/keys");

const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decoded = verify(token, jwtSecretKey, {
      algorithm: hashAlgorithm,
    });
    const user = await User.findOne({
      _id: decoded._id,
      "tokens.token": token,
    });

    if (!user) throw new Error("Authentication error");

    req.token = token;
    req.user = user;
    next();
  } catch (error) {
    res.status(401).send({ error: "please authenticate.", errors: error });
  }
};

module.exports = auth;
