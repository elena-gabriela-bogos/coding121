import {dbConn} from "../../config/db.config";

export default class MentorSkills {
    constructor({idMentor, idLF, yearsOfExperience, details}) {
        this.idMentor = idMentor;
        this.idLF = idLF;
        this.yearsOfExperience = yearsOfExperience;
        this.details = details;
    }

    static create(newMentorSkill, result) {
        dbConn.query("INSERT INTO mentorskills set ?", newMentorSkill, function (err, res) {
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
        dbConn.query("SELECT * from mentorskills", function (err, res) {
            if (err) {
                console.log("error: ", err);
                result(null, err);
            } else {
                console.log('users : ', res);
                result(null, res);
            }
        });
    };

    static findAllMentorSkills(result) {
        const sql = "SELECT u.id,u.name,lf.id as idLF FROM user u " +
            "INNER JOIN mentorsskills ms ON ms.idMentor=u.id " +
            "INNER JOIN languages_frameworks lf ON ms.idLF=lf.id " +
            "INNER JOIN mentor m ON m.id=u.id " +
            "WHERE m.valid=1;"
        dbConn.query(sql, function (err, res) {
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