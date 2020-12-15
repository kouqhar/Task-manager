module.exports = {
  mongoURI: process.env.MONGODB_URL,
  secretOrKey: process.env.SECRET_OR_KEY,
  jwtSecretKey: process.env.JWT_SECRET,
  hashAlgorithm: process.env.HASH_ALGORITHM,
  secretOrMailerKey: process.env.SECRET_OR_MAILER_KEY,
};
