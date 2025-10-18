const express = require("express");
const router = express.Router();
const { getSpecies,getSpeciesByFilter } = require("../controllers/species");

router.get("/getSpecies", getSpecies);
router.get("/getSpeciesByFilter/:filterId", getSpeciesByFilter);



module.exports = router;
