const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const errorHandler = require("./middleware/errorHandler");
const connectDB = require("./config/db");

const logger = require("./utils/logger");
const authRoutes = require("./routes/auth.routes");
const adminRoutes = require("./routes/admin.routes");
const { MESSAGES } = require("./utils/constants");

require("dotenv").config();

const PORT = process.env.PORT || 1234;

const app = express();

app.use(cookieParser());

app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:3000", // frontend URLs
    credentials: true, // if using cookies or Authorization headers
  })
);

connectDB();

app.use("/api/auth", authRoutes);
app.use("/api/v1", adminRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
  logger.info(`${MESSAGES.SERVER_RUNNING} ${PORT}`);
});
