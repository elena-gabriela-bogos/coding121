import express from 'express';
import path from 'path';
import User from "../domain/user";
import Mentor from "../domain/mentor";

export const welcomePageRouter = express.Router()

welcomePageRouter.get('/', (req, res) => {
    if (req.session.loggedin) {
        Mentor.findById(req.session.userId, (err, mentor) => {
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

welcomePageRouter.get('/gdpr', (req, res) => {
    let loggedIn = false;
    if (req.session.loggedin) {
        loggedIn = true;
    }
    res.render(path.resolve('public/views/gdpr.ejs'), {loggedIn});
});


welcomePageRouter.get('/cookie-policy', (req, res) => {
    let loggedIn = false;
    if (req.session.loggedin) {
        loggedIn = true;
    }
    res.render(path.resolve('public/views/cookie-policy.ejs'), {loggedIn});
});
