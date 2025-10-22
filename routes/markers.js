// routes/markers.js
const express = require("express");
const router = express.Router();
const { getMarkers, getMarkersByFilter, createMarket } = require("../controllers/markers");
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

router.get("/getMarkers", getMarkers);
router.get("/getMarkersByFilter/:filterId", getMarkersByFilter);

// 🔹 Corrección: multer solo aquí para recibir la imagen
router.post("/createMarket", upload.single('image'), createMarket);

module.exports = router;
