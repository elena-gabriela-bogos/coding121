import User from "../domain/user";

const express = require("express");
import Auth from "../domain/auth";
import path from "path";

const randomstring = require('randomstring');
require("speakeasy");
const nodemailer = require("nodemailer");
const fs = require("fs");
const { promisify } = require("util");
promisify(fs.readFile);
const ejs = require("ejs");

export const verifyEmail = express.Router();

verifyEmail.get('/send/:id/:username',async (req,res)=>{

    //console.log('id',req.params.id);
    //console.log('mail',req.params.username);
    const{ USER_MAIL ,PASS_MAIL } = process.env;
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: "smtp.coding121.net",
        port: 465,
        //server: "mail.coding121.net"
        //service: "SMTP",
        secure: true, // use SSL
        auth: {
            user: USER_MAIL,
            pass: PASS_MAIL,
        },
        tls: {
            secure: false,
            ignoreTLS: true,
            rejectUnauthorized: false
        }
    });

    //token
    const emailToken = randomstring.generate();
    Auth.create(new Auth({
            "id": req.params.id,
            emailToken,
            "emailStatus": false,
            "phoneToken": null,
            "phoneStatus": false,
            "status": false
        }), (err,auth) => {
            console.log("auth: ", auth)
        });

    //ejs
    const html = await ejs
        .renderFile(path.resolve("public/views/emailTExt.ejs"), {"emailToken": emailToken,"path": path.resolve('src/auth/2fa')})
        .then(output => output)
        .catch(err => {
            console.log(err)
        });

    // send mail with defined transport object
    let info = await transporter
        .sendMail({
            from: "contact@coding121.net", // sender address
            to: req.params.username, // list of receivers
            subject: "Confirmation", // Subject line
            html: html,
        })
        .then(
            //res.status(status).send(body),
            res.redirect("/mailSent")
        )
        .catch(
            err => {
                console.log(err);
                res.render(path.resolve('public/views/signupMentee.ejs'), {"message": "Something went wrong"});
            }

        );
});

verifyEmail.get('/:token',async (req,res,next)=>{
    try{
        console.log("token",req.params.token);
        await Auth.findByEmailToken(req.params.token,(error,auth)=>{
            if(error){
                console.log("erare");
            }
            else if(auth.length !== 0){
                Auth.emailverified(auth[0].id,'',true,(err,verified)=>{
                    if(err){
                        console.log(err);
                    }
                    else {
                        res.redirect('/phoneConfirmation/' + auth[0].id);
                    }
                });

            }
        });
    }catch (error){
        next(error);
    }
});