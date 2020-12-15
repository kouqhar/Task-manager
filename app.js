const express = require("express");

const app = express();
const port = process.env.PORT;

// Import the separated routes middleware
require("./startup/routes")(app);

// Import the separated database initialization
require("./startup/dbInit")();

app.listen(port, () => console.log(`Server is listening on port ${port}`));
