const express = require("express");
const router = express.Router();
const fs = require("fs");

router.get("/", (req, res) => {
  try {
    var impressum = fs.readFileSync("assets/impressum.html");
    res.send(impressum);
  } catch (error) {
    res.status(400).json(error);
  }
});

module.exports = router;
