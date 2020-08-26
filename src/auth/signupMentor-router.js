import express from 'express';
import path from 'path';
import User from "../domain/user";
import Mentor from "../domain/mentor";
import {signupMenteeRouter} from "./signupMentee-router";


export const signupMentorRouter = express.Router()

signupMentorRouter.get('/', (req, res) => {
    if (req.session.loggedin) {
        Mentor.findById(req.session.userId, (err, mentor) => {
            if (mentor.length === 1) {
                res.redirect("/m/dashboard");
            } else {
                res.redirect("/u/dashboard");
            }
        });
    } else {
        res.render(path.resolve('public/views/signupMentor.ejs'));
    }
});

signupMentorRouter.post("/", async (req, res) => {
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
                html: await readFile("./src/auth/emailTExt.ejs"),
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