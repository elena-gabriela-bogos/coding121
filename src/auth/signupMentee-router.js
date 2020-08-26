import express from 'express';
import path from 'path';
import User from "../domain/user";
import Mentee from "../domain/mentee";
import {config} from 'dotenv'
import jwt from 'jsonwebtoken'

config();

//import passport from 'passport';

const speakeasy = require("speakeasy");
const nodemailer = require("nodemailer");
const fs = require("fs");
const { promisify } = require("util");
const readFile = promisify(fs.readFile);
var ejs = require("ejs");

export const signupMenteeRouter = express.Router()
// // get required data from .env file
// const { JWT_SECRET, CLIENT_REDIRECT_URL: REDIRECT } = process.env
//
// // Login Route
// signupMenteeRouter.get('/googleSignup', passport.authenticate('google', { scope: ['email', 'profile'] }))
//
// // Google Callback Route
// signupMenteeRouter.get('/callback', passport.authenticate('google', { session: false, failureRedirect: REDIRECT + '?error=true' }), (req, res) => {
//     // sign a JWT with user id
//     const token = jwt.sign({ id: req.user.gid }, JWT_SECRET, { expiresIn: '12h' })
//
//     try {
//         // send the freshly new token as a quary string back to client
//         res.redirect(REDIRECT + '?token=' + token)
//     } catch (err) {
//         console.log(err)
//     }
// })

// // Login Route
// signupMenteeRouter.get('/facebookSignup', passport.authenticate('facebook', { scope: ['email', 'profile'] }))
//
// // Facebook Callback Route
// signupMenteeRouter.get('/callback', passport.authenticate('faccebook', { session: false, failureRedirect: REDIRECT + '?error=true' }), (req, res) => {
//     // sign a JWT with user id
//     const token = jwt.sign({ id: req.user.gid }, JWT_SECRET, { expiresIn: '12h' })
//
//     try {
//         // send the freshly new token as a quary string back to client
//         res.redirect(REDIRECT + '?token=' + token)
//     } catch (err) {
//         console.log(err)
//     }
// })


signupMenteeRouter.get('/', (req, res) => {
    if (req.session.loggedin) {
        Mentee.findById(req.session.userId, (err, mentee) => {
            if (mentee.length === 1) {
                res.redirect("/u/dashboard");
            } else {
                res.redirect("/m/dashboard");
            }
        });
    } else {
        res.render(path.resolve('public/views/signupMentee.ejs'));
    }
});

// signupMenteeRouter.post('/mailSent', (req, res) => {
//     const {name, username, password} = req.body;
//     if (name&& username && password && password) {
//         User.findByUsernameAndPassword(username, password, (err, user) => {
//                 if (err) {
//                     res.render(path.resolve('public/views/signupMentee.ejs'), {"message": "Invalid datas"});
//
//                 } else {
//                     res.send(err);
//                     res.render(path.resolve('public/views/phoneConfirmation.ejs'), {"message": "Invalid datas"});
//
//
//                 }
//             }
//         );
//     } else {
//         res.render(path.resolve('public/views/signupMentee.ejs'), {"message": "Invalid datas"});
//     }
// });
signupMenteeRouter.post("/", async (req, res) => {
    const {name, username, password, repassword} = req.body;
    if(name && username && password && repassword && password === repassword) {
        let testAccount = await nodemailer.createTestAccount();

        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
            host: "smtp.coding121.net",
            port: 465,
            //server: "mail.coding121.net"
            //service: "SMTP",
            secure: true, // use SSL
            auth: {
                user: "contact@coding121.net",
                pass: "7lbq2YO2i7",
            },
            tls: {
                secure: false,
                ignoreTLS: true,
                rejectUnauthorized: false
            }
        });

        //token
        const secret = speakeasy.generateSecret({ length: 20 });
        const emailToken = speakeasy.hotp({ secret: secret.base32, encoding: "base32" });
        const url = `http://localhost:3000/phoneConfirmation/${emailToken}`;


        //ejs
        //res.render(path.resolve("public/views/emailTExt.ejs"), {"message": url })
        const html = await ejs
            .renderFile(path.resolve("public/views/emailTExt.ejs"), {"message": url })
            .then(output => output)
            .catch(err=>{console.log(err)});

        // send mail with defined transport object
        let info = await transporter
            .sendMail({
                from: "contact@coding121.net", // sender address
                to: username, // list of receivers
                subject: "Confirmation", // Subject line
                html: html,
            })
            .then(
                res.send({
                    status: "sent",
                },
                res.redirect("/mailSent")
                )
            )
            .catch(
                err=>{console.log(err)}
                //res.render(path.resolve('public/views/signupMentee.ejs'), {"message": "Something went wrong"})
            );
        //res.redirect("/mailSent");
    }
    else{
        res.render(path.resolve('public/views/signupMentee.ejs'), {"message": "Invalid datas"});

    }
});
