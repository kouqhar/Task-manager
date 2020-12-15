const { connect } = require("mongoose");
const { mongoURI } = require("../config/keys");

module.exports = function () {
  // Connect application with mongoose
  connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  }).then(() => console.log(`${mongoURI} connected Successfully. . .`));
  // Catch and terminate the unconnected process
};
