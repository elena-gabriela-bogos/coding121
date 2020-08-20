import express from 'express';
import path from 'path';
import User from "../domain/user";
import Mentor from "../domain/mentor";

export const welcomePageRouter = express.Router()

welcomePageRouter.get('/', (req, res) => {
    if (req.session.loggedin) {
        Mentor.findById(req.session.id, (err, mentor) => {
            if (mentor.length === 1) {
                res.redirect("/m/dashboard");
            } else {
                res.redirect("/u/dashboard");
            }
        });
    } else {
        res.render(path.resolve('public/index.ejs'));
    }
});
