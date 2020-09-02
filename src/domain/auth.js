import {dbConn} from "../../config/db.config";

export default class Auth{
    constructor({id, emailToken=null, emailStatus=false, phoneToken=null,phoneStatus =false, status=false}) {
        this.id = id;
        this.emailToken = emailToken;
        this.emailStatus = emailStatus;
        this.phoneToken = phoneToken;
        this.phoneStatus = phoneStatus;
        this.status = status;
    }

    static  create(newAuth, result){
        dbConn.query("INSERT INTO auth set ?", newAuth, function (err, res){
            if(err){
                console.log("error: ",err);
                result(err,null);
            }else {
                result(null,res.insertId);
            }
        });
    };

    static emailverified(id,emailToken,emailStatus,result){
        dbConn.query("UPDATE auth set emailToken = ?, emailStatus=? where id = ?",[emailToken,emailStatus,id], function (err,res){
            if(err){
                console.log("error",err);
                result(err,null);
            }
            else {
                result(null,res);
            }
        });
    }

    static phoneverified(id,phoneToken,phoneStatus,result){
        dbConn.query("UPDATE auth set phoneToken = ?, phoneStatus=? where id = ?",[phoneToken,phoneStatus,id], function (err,res){
            if(err){
                console.log("error",err);
                result(err,null);
            }
            else {
                result(null,res);
            }
        });
    }

    static changeStatus(id,status,result){
        dbConn.query("UPDATE auth set status = ? where id = ?",[status,id], function (err,res){
            if(err){
                console.log("error",err);
                result(err,null);
            }
            else {
                result(null,res);
            }
        });
    }

    static findByEmailToken(token, result){
        dbConn.query("SELECT * from auth where emailToken = ?", token, function (err,res){
            if(err){
                console.log("error: ",err);
                result(err,null);
            }else {
                result(null,res);
            }
        });
    };


    static findByPhoneToken(token, result){
        dbConn.query("SELECT * from auth where phoneToken = ?",token, function (err,res){
            if(err){
                console.log("error: ",err);
                result(err,null);
            }else {
                result(null,res);
            }
        });
    };

}

