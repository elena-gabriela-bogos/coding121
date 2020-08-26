import {dbConn} from "../../config/db.config";

export default class Request {
    constructor({description, idMentee}) {
        this.description = description;
        this.idMentee = idMentee;
        this.postedAt = Date.now();
        this.status = "open";
    }

    static create(newRequest, result) {
        dbConn.query("INSERT INTO request set ?", newRequest, function (err, res) {
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
        dbConn.query("SELECT * from request", function (err, res) {
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
        dbConn.query("SELECT * from request where id = ? ", id, function (err, res) {
            if (err) {
                console.log("error: ", err);
                result(err, null);
            } else {
                result(null, res);
            }
        });
    };

    static findByStatus(id, status, result) {
        console.log(id);
        dbConn.query("SELECT * from request where idMentee = ? AND status = ? ", [id, status], function (err, res) {
            if (err) {
                console.log("error: ", err);
                result(err, null);
            } else {
                result(null, res);
            }
        });
    }
}