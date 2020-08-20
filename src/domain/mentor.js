import {dbConn} from "../../config/db.config";

export default class Mentor {
    constructor({id}) {
        this.id = id;
        this.valid = false;
    }

    static create(newMentor, result) {
        dbConn.query("INSERT INTO mentor set ?", newMentor, function (err, res) {
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
        dbConn.query("SELECT * from mentor", function (err, res) {
            if (err) {
                console.log("error: ", err);
                result(null, err);
            } else {
                console.log('mentors : ', res);
                result(null, res);
            }
        });
    };

    static findById(id, result) {
        dbConn.query("SELECT * from mentor where id = ? ", id, function (err, res) {
            if (err) {
                console.log("error: ", err);
                result(err, null);
            } else {
                result(null, res);
            }
        });
    };
}