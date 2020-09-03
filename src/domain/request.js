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
                // console.log(res);
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
                // console.log('users : ', res);
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

    static updateStatus(id, status, result) {
        dbConn.query("UPDATE request SET status=? WHERE id=?", [status, id], function (err, res) {
            if (err) {
                console.log("error: ", err);
                result(err, null);
            } else {
                // console.log(res);
                result(null, res.insertId);
            }
        });
    };

    static findSuggestedRequests(idMentor,result){
        dbConn.query("select distinct user.id,user.name,request.description,request.idmentee,request.postedAt from request inner join requestskills on request.id=requestskills.idrequest and request.status=? inner join mentorsskills on mentorsskills.idLF= requestskills.idLF  and mentorsskills.idMentor=? inner join user on user.id=request.idmentee  ", ["open", idMentor], function (err, res) {
            if (err) {

                console.log("error: ", err);
                result(err, null);
            } else {
                result(null, res);

            }
        });

    }



}