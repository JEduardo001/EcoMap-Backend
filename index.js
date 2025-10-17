const express = require("express");
const app = express();
app.use(express.json());

const userRoutes = require("./routes/userRoutes");
app.use("/users", userRoutes);
const markers = require("./routes/markers");
app.use("/markers", markers);

app.listen(3000, () => console.log("Server running on port 3000"));
