const express = require("express");
const router = express.Router();

router.use("/dsgvo", require("./v1/dsgvo"));
router.use("/impressum", require("./v1/impressum"));

module.exports = router;
