const express = require("express");
const router = express.Router();
const path = require("path");

router.get("/:imageName", (req, res) => {
  const imageName = req.params.imageName;
  res.sendFile(path.join(__dirname, "..", "db", "images", imageName));
});

module.exports = router;
