const express = require("express");
const router = express.Router();
const { getMarkers,getMarkersByFilter,createMarket } = require("../controllers/markers");
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

router.get("/getMarkers", getMarkers);
router.get("/getMarkersByFilter/:filterId", getMarkersByFilter);
router.post("/createMarket", upload.single('image'), createMarket);



module.exports = router;
