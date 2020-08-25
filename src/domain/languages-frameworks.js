import {dbConn} from "../../config/db.config";

export default class LanguagesFrameworks {
    constructor({name, type}) {
        this.name = name;
        this.type = type;
    }

    static create(newLF, result) {
        dbConn.query("INSERT INTO languages_frameworks set ?", newLF, function (err, res) {
            if (err) {
                console.log("error: ", err);
                result(err, null);
            } else {
                // console.log(res.insertId);
                result(null, res.insertId);
            }
        });
    };

    static findAll(result) {
        dbConn.query("SELECT * from languages_frameworks", function (err, res) {
            if (err) {
                console.log("error: ", err);
                result(null, err);
            } else {
                // console.log('users : ', res);
                result(null, res);
            }
        });
    };

    static findById(id, result) {
        dbConn.query("SELECT * from languages_frameworks where id = ? ", id, function (err, res) {
            if (err) {
                console.log("error: ", err);
                result(err, null);
            } else {
                result(null, res);
            }
        });
    };
}