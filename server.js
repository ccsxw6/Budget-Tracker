const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
const compression = require("compression");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(logger("dev"));

app.use(compression());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

// mongoose.connect("mongodb://localhost/budget", {
//   useNewUrlParser: true,
//   useFindAndModify: false
// });

let MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/budget";

mongoose.connect(
  process.env.MONGODB_URI || "mongodb://localhost/budget",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
  }
);

require("./routes/api.js")(app)

app.listen(PORT, () => console.log(`App running on port ${PORT}!`));

// Your app is trying to connect to port 3000, which is a local port. I would go back over the guide making sure you give the port and database development/database options