const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors"); // <-- require the cors package
const { router: authRouter, protect } = require("./routes/auth");
const businessCardRoutes = require("./routes/cardroutes");
const userRoutes = require("./routes/userRoutes");
require("dotenv").config();

// Initialize express app
const app = express();

// Use the cors middleware
app.use(
  cors({
    origin: ["http://localhost:3000", "https://moosaproject.onrender.com"], // <-- use cors middleware
  })
);

// Set up body-parser middleware to parse request bodies
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Set up MongoDB connection using Mongoose
mongoose.connect(
  "mongodb+srv://sabbasraza17:Abbas0343.@cluster0.hl4il1e.mongodb.net/",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log("Connected to MongoDB database!");
});

// Routes
app.use(authRouter);
app.use("/business-card", businessCardRoutes);
app.use("/user", userRoutes);

// Add protected routes below
//app.use('/api/your_protected_route', protect, yourProtectedRoute);

// Start the server and listen on the specified port
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
