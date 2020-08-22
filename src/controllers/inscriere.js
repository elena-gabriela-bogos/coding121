const db = require("config/db.config");

exports.getInscrieri = (req, res) => {
  var sql = "SELECT * FROM user";
  db.dbConn.query(sql, (err, result) => {
    if (err) console.log(err.message);
    res.send(result);
  });
};

exports.addInscriere = async (req, res) => {
  var sql =
    "INSERT INTO user (name, mail, password, phone) VALUES ('" +
    req.body.name +
    "', '" +
    req.body.username +
    "'," +
    req.body.password +
    ", '" +
    req.body.phone +
    "')";
  db.dbConn.query(sql, (err, result) => {
    if (err) console.log(err.message);
    res.send(result);
  });
};
