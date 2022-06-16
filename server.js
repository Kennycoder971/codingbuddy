const express = require("express");
const PORT = process.env.PORT || 5001;
const app = express();
const path = require("path");

const userRoute = require("./routes/user");

// Body parser
app.use(express.json());

// Use the routes
app.use("/api/v1/users", userRoute);

// Set static folder
app.use(express.static(path.join(__dirname, "public")));

app.listen(PORT, () => console.log(`App is listening on port ${PORT}`));
