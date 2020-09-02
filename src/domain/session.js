import {dbConn} from "../../config/db.config";

export default class Session {
    constructor({id, mentee, mentor, start, duration}) {
        this.id = id;
        this.mentee = mentee;
        this.mentor = mentor;
        this.start = start;
        this.duration = duration;
    }

    static create(session, result) {
        dbConn.query("INSERT INTO sessions set ?", session, function (err, res) {
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
        dbConn.query("SELECT * from sessions", function (err, res) {
            if (err) {
                console.log("error: ", err);
                result(null, err);
            } else {
                console.log('users : ', res);
                result(null, res);
            }
        });
    };

    static findByMentee(id, result) {
        dbConn.query("SELECT * from sessions where mentee = ? ", id, function (err, res) {
            if (err) {
                console.log("error: ", err);
                result(err, null);
            } else {

                result(null, res);
            }
        });
    };

    static findById(id, result) {
        dbConn.query("SELECT * from sessions where id = ?", id, function (err, res) {
            if (err) {
                console.log("error: ", err);
                result(err, null);
            } else {

                result(null, res);
            }
        });
    };

    static updateDuration(session, result) {
        dbConn.query("UPDATE sessions SET duration=? where id = ? ", session, function (err, res) {
            if (err) {
                console.log("error: ", err);
                result(err, null);
            } else {

                result(null, res);
            }
        });
    }
}