import express from 'express';
import path from 'path';
import User from "../domain/user";
import Mentee from "../domain/mentee";
//import jwt from 'jsonwebtoken'
//import passport from 'passport';

const nodemailer = require("nodemailer");
const fs = require("fs");
const { promisify } = require("util");
const readFile = promisify(fs.readFile);

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
            host: "mail.it-labs.ro",
            port: 465,
            service: "SMTP",
            secure: false, // use SSL
            auth: {
                user: "",
                pass: "",
            },
        });

        // send mail with defined transport object
        let info = await transporter
            .sendMail({
                from: "internship@it-labs.ro", // sender address
                to: username, // list of receivers
                subject: "Confirmation", // Subject line
                html: await readFile("./src/auth/emailTExt.html"),
            })
            .then(
                res.send({
                    status: "sent",
                },
                res.redirect("/mailSent")
                )
            )
            .catch(
                res.send({
                    status: "error",
                },
                res.render(path.resolve('public/views/signupMentee.ejs'), {"message": "Something went wrong"}))
            );
        res.redirect("/mailSent");
    }
    else{
        res.render(path.resolve('public/views/signupMentee.ejs'), {"message": "Invalid datas"});

    }
});
