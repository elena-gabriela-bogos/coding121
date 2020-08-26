const express = require("express");
const router = express.Router();
const { getInscrieri, addInscriere } = require("../controllers/inscriere");

router.route("/").get(getInscrieri).post(addInscriere);
module.exports = router;
