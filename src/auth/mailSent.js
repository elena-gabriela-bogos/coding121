import express from 'express';
import path from 'path';
import Mentor from "../domain/mentor";

export const mailSentRouter = express.Router()

mailSentRouter.get('/', (req, res) => {
    if (req.session.loggedin) {
        Mentor.findById(req.session.userId, (err, mentor) => {
            if (mentor.length === 1) {
                res.redirect("/m/dashboard");
            } else {
                res.redirect("/u/dashboard");
            }
        });
    } else {
        res.render(path.resolve('public/views/mailSent.ejs'), {en: req.session.lang});
    }
});

