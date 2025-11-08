const express = require("express");
const app = express();

const userRoutes = require("./routes/userRoutes");
const markers = require("./routes/markers");
const speciesRoutes = require("./routes/speciesRoutes");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/users", userRoutes);
app.use("/markers", markers);
app.use("/species", speciesRoutes);

module.exports = app;


/* 

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
  next();
});

app.listen(3000, () => console.log("Server running on port 3000"));


*/