import {dbConn} from "../../config/db.config";

export default class User {
    constructor({name, mail, phone, password=null,picture = null,gid=null, fid=null}) {
        this.name = name;
        this.mail = mail;
        this.phone = phone;
        this.password = password;
        this.picture = picture;
        this.gid = gid;
        this.fid = fid;
    }

    static create(newUser, result) {
        dbConn.query("INSERT INTO user set ?", newUser, function (err, res) {
            if (err) {
                console.log("error: ", err);
                result(err, null);
            } else {
                // console.log(res.insertId);
                result(null, res.insertId);
            }
        });
    };

    static findByGid(gid,result){
        dbConn.query("SELECT * from user where gid=?", gid, function (err,res){
            if(err){
                console.log("error: ",err);
                result(err,null);
            }
            else {
                result(null,res);
            }
        });
    }

    static update(newUser, result){
        dbConn.query("UPDATE user set ? where mail = ?", [newUser,newUser.mail], function (err,res){
            if(err){
                console.log("error: ",err);
                result(err,null);
            }
            else {
                result(null,res);
            }
        });
    }

    static setPhone(id,phone,result){
        dbConn.query("UPDATE user set phone=? where id=?",[phone,id], function (err,res){
            if(err){
                console.log("error: ",err);
                result(err,null);
            }
            else {
                result(null,res);
            }
        });
    }

    static findAll(result) {
        dbConn.query("SELECT * from user", function (err, res) {
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
        dbConn.query("SELECT * from user where id = ? ", id, function (err, res) {
            if (err) {
                console.log("error: ", err);
                result(err, null);
            } else {
                result(null, res);
            }
        });
    };

    static findByUsername(username, result){
        dbConn.query("SELECT * from user where mail = ?", username, function (err,res){
            if(err){
                console.log("error: ",err);
                result(err,null);
            }else {
                result(null,res);
            }
        });
    };

    static findByUsernameAndPassword(username, password, result) {
        dbConn.query("SELECT * FROM user WHERE mail=? AND password=?", [username, password], function (err, res) {
            if (err) {
                console.log("error: ", err);
                result(err, null);
            } else {
                result(null, res);
            }
        });
    };
}