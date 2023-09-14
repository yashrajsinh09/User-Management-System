const express = require("express");
const connectdb = require("./db/db");
const errorHandler = require("./middleware/error");
const router = require("./routes/userRoute");
require("dotenv").config()

const app = express();

connectdb();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api", router)

app.use(errorHandler)

const PORT = 3000 || process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
