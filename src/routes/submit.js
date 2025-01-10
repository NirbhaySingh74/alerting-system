const express = require("express");
const { handleSubmit } = require("../controllers/submitController");
const router = express.Router();

router.post("/", handleSubmit);

module.exports = router;
