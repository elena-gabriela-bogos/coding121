const express = require("express");
const speakeasy = require("speakeasy");
const fetch = require("node-fetch");
const router = express.Router();

router.post("/generate-secret", (req, res) => {
  const secret = speakeasy.generateSecret({ length: 20 });
  const token = speakeasy.hotp({ secret: secret.base32, encoding: "base32" });
  const phone = req.body.phone;
  const message = "Codul este:" + token;
  const fetch_url =
    "https://app.smso.ro/api/v1/send?to=" +
    phone +
    "&sender=4&body=" +
    message +
    "&apiKey=mTr3xmoP3M9usuncicnqdD57DbxHlXWTpz4uePpz";
  fetch(fetch_url)
    .then((res) => res.json())
    .then((json) => console.log(json))
    .catch((err) => console.log(err.message));
  res.send({
    secret: secret.base32,
  });
});

router.post("/validate-secret", (req, res) => {
  console.log(req.body.secret + " " + req.body.token);
  res.send({
    valid: speakeasy.hotp.verify({
      secret: req.body.secret,
      encoding: "base32",
      token: req.body.token,
    }),
  });
});

module.exports = router;
