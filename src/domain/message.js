import {dbConn} from "../../config/db.config";

export default class Message {
    constructor({content, to, from}) {
        this.user_id1 = from;
        this.user_id2 = to;
        this.status = "unread";
        this.deliveredTime = Date.now();
        this.content = content;
    }

    static create(newMessage, result) {
        dbConn.query("INSERT INTO chat_message set ?", newMessage, function (err, res) {
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
        dbConn.query("SELECT * from chat_message", function (err, res) {
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
        dbConn.query("SELECT * from chat_message where id = ? ", id, function (err, res) {
            if (err) {
                console.log("error: ", err);
                result(err, null);
            } else {
                result(null, res);
            }
        });
    };

    static getMessagesBetweenUsers(users, result) {
        users.push(users[0]);
        users.push(users[1]);
        dbConn.query("SELECT * from chat_message where (user_id1 = ? AND user_id2 = ?) " +
            "OR  (user_id2 = ? AND user_id1 = ?) ORDER BY deliveredTime", users, function (err, res) {
            if (err) {
                console.log("error: ", err);
                result(err, null);
            } else {
                result(null, res);
            }
        });
    }

    static getMessagesInfoOfUser(user, result) {
        dbConn.query(
            "SELECT user_id1, user_id2, deliveredTime, u.name from chat_message " +
            "INNER JOIN user u ON ((u.id=user_id1 and u.id!=?) or (u.id=user_id2 and u.id!=?)) where user_id1 = ? OR user_id2 = ? ORDER BY deliveredTime DESC",
            [user, user, user, user], function (err, res) {
                if (err) {
                    console.log("error: ", err);
                    result(err, null);
                } else {
                    result(null, res);
                }
            });
    }
}