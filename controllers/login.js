const { User } = require("../models/User");

const loginUser = async (req, res) => {
  const { password, email } = req.body;

  try {
    const isUser = await User.findByCredentials(email, password);
    const token = await isUser.generateAuthToken();

    res.send({ user: isUser, token });
  } catch (error) {
    res.status(500).send(`Logging user error : ${error.message}`);
  }
};

module.exports = { loginUser };
