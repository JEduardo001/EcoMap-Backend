const express = require("express");
const router = express.Router();
const { getMarkers,getMarkersByFilter } = require("../controllers/markers");

router.get("/getMarkers", getMarkers);
router.get("/getMarkersByFilter/:filterId", getMarkersByFilter);



module.exports = router;
