import {dbConn} from "../../config/db.config";

export default class Admin {
    constructor({id}) {
        this.id = id;
    }

    static create(newAdmin, result) {
        dbConn.query("INSERT INTO admin set ?", newAdmin, function (err, res) {
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
        dbConn.query("SELECT * from admin", function (err, res) {
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
        dbConn.query("SELECT * from admin where id = ? ", id, function (err, res) {
            if (err) {
                console.log("error: ", err);
                result(err, null);
            } else {
                result(null, res);
            }
        });
    };
}