// index.js
const express = require("express");
const app = express();

const userRoutes = require("./routes/userRoutes");
app.use("/users", userRoutes);

const markers = require("./routes/markers");
app.use("/markers", markers);

const speciesRoutes = require("./routes/speciesRoutes");
app.use("/species", speciesRoutes);

// Middlewares para JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  console.log(`xxxxx   [${req.method}] ${req.originalUrl}`);
  next();
});

app.listen(3000, () => console.log("Server running on port 3000"));
