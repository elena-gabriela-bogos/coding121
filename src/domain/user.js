import {dbConn} from "../../config/db.config";

export default class User {
    constructor({name, mail, phone, password}) {
        this.name = name;
        this.mail = mail;
        this.phone = phone;
        this.password = password;
    }

    static create(newUser, result) {
        dbConn.query("INSERT INTO user set ?", newUser, function (err, res) {
            if (err) {
                console.log("error: ", err);
                result(err, null);
            } else {
                console.log(res.insertId);
                result(null, res.insertId);
            }
        });
    };

    static findAll(result) {
        dbConn.query("SELECT * from user", function (err, res) {
            if (err) {
                console.log("error: ", err);
                result(null, err);
            } else {
                console.log('users : ', res);
                result(null, res);
            }
        });
    };

    static findById(id, result) {
        dbConn.query("SELECT * from user where id = ? ", id, function (err, res) {
            if (err) {
                console.log("error: ", err);
                result(err, null);
            } else {
                result(null, res);
            }
        });
    };

    static findByUsernameAndPassword(username, password, result) {
        dbConn.query("SELECT * FROM user WHERE mail=? AND password=?", [username, password], function (err, res) {
            if (err) {
                console.log("error: ", err);
                result(err, null);
            } else {
                result(null, res);
            }
        });
    };
}