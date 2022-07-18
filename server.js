const express = require("express");
const PORT = process.env.PORT || 5001;
const app = express();
const path = require("path");
const colors = require("colors");
const fileupload = require("express-fileupload");
const morgan = require("morgan");
const errorHandler = require("./middlewares/errorHandler");
const cookieParser = require("cookie-parser");

const connectDB = require("./configs/db");

// Load env fiels
require("dotenv").config({ path: "./configs/config.env" });

// Connect to db
connectDB();

// Set static folder
app.use(express.static(path.join(__dirname, "public")));

// Load routes
const userRoute = require("./routes/user");
const authRoute = require("./routes/auth");
const postRoute = require("./routes/post");
const replyRoute = require("./routes/reply");
const likeRoute = require("./routes/like");

// Body parser
app.use(express.json());

// Cookie parser
app.use(cookieParser());

// Dev logging middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// File uploading
app.use(fileupload());

// Use the routes
app.use("/api/v1/users", userRoute);
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/posts", postRoute);
app.use("/api/v1/replies", replyRoute);
app.use("/api/v1/likes", likeRoute);

// Handler errors
app.use(errorHandler);

const server = app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
  )
);

// Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`.red);
  // Close server & exit process
  // server.close(() => process.exit(1));
});
