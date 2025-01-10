const express = require("express");
const { handleSubmit } = require("../controllers/submitController");
const { getMetrics } = require("../controllers/submitController");
const router = express.Router();

router.post("/", handleSubmit);
router.get("/metrics", getMetrics);

module.exports = router;
