const express = require("express");
const router = express.Router();
const { getUsers, createUser,saludo } = require("../controllers/userController");

router.get("/", getUsers);
router.post("/", createUser);
router.get("/", saludo);


module.exports = router;
