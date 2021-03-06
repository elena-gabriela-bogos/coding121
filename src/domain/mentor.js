import {dbConn} from "../../config/db.config";
import MentorSkills from "./mentor-skills";
import User from "./user";

export default class Mentor {
    constructor({id}) {
        this.id = id;
        this.valid = 2;
        this.details = null;
    }

    static create(newMentor, result) {
        dbConn.query("INSERT INTO mentor set ?", newMentor, function (err, res) {
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
        dbConn.query("SELECT * from mentor", function (err, res) {
            if (err) {
                console.log("error: ", err);
                result(null, err);
            } else {
                // console.log('mentors : ', res);
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

    static filterByLF(skills, result) {
        MentorSkills.findAllMentorSkills((err, mentorSkills) => {
                if (err) {
                    result(err, null);
                } else {
                    let map = {}
                    mentorSkills.forEach(skill => {
                        if (!(skill.id in map)) {
                            map[skill.id] = [0, skill.name, skill.details];
                        }
                        if (skills.includes(skill.idLF.toString())) {
                            map[skill.id][0]++;
                        }
                    });
                    let mentors = [];
                    for (const [k, v] of Object.entries(map)) {
                        if (v[0] !== 0) {
                            mentors.push({"id": k, "name": v[1], "cmp": v[0], "details": v[2]});
                        }
                    }
                    result(null, mentors);
                }
            }
        );
    }

    static findByValidStatus(status, result) {
        dbConn.query("SELECT u.name, m.details, u.id from mentor m inner join user u on u.id=m.id where m.valid = ? ", status, function (err, res) {
            if (err) {
                console.log("error: ", err);
                result(err, null);
            } else {
                console.log(status);
                result(null, res);
            }
        });
    }

    static updateStatus(id, status, result) {
        dbConn.query("UPDATE mentor SET valid=? where id=?", [status, id], function (err, res) {
            if (err) {
                console.log("error: ", err);
                result(err, null);
            } else {
                result(null, res);
            }
        });
    }
}