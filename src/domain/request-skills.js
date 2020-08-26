import {dbConn} from "../../config/db.config";

export default class RequestSkills {
    constructor({idrequest, idLF}) {
        this.idrequest = idrequest;
        this.idLF = idLF;
    }

    static create(newRequestSkill, result) {
        dbConn.query("INSERT INTO requestskills set ?", newRequestSkill, function (err, res) {
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
        dbConn.query("SELECT * from requestskills", function (err, res) {
            if (err) {
                console.log("error: ", err);
                result(null, err);
            } else {
                console.log('users : ', res);
                result(null, res);
            }
        });
    };

    static findByMenteeAndStatus(id, status, result) {
        const sql = "SELECT r.id,description,postedAt,name FROM request r " +
            "INNER JOIN requestskills rs ON rs.idrequest=r.id " +
            "INNER JOIN languages_frameworks lf ON rs.idLF=lf.id " +
            "WHERE r.idMentee=? AND r.status=?";
        dbConn.query(sql, [id, status], function (err, res) {
            if (err) {
                console.log("error: ", err);
                result(err, null);
            } else {
                result(null, res);
            }
        });
    };

    static findSkillsById(id, result) {
        const sql = "SELECT r.id,description,postedAt,lf.id as idLF,name FROM request r " +
            "INNER JOIN requestskills rs ON rs.idrequest=r.id " +
            "INNER JOIN languages_frameworks lf ON rs.idLF=lf.id " +
            "WHERE r.id=?";
        dbConn.query(sql, [id], function (err, res) {
            if (err) {
                console.log("error: ", err);
                result(err, null);
            } else {
                result(null, res);
            }
        });
    };
}