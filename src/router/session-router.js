import express from "express";


import path from "path";
import {checkAuth} from "./api/authentification";
import User from "../domain/user";

export const sessionRouter = express.Router();

sessionRouter.get('/', checkAuth, (req, res) => {
    res.render(path.resolve('public/views/menteeSessionHistory.ejs'));

});


sessionRouter.post('/', checkAuth, (req, res) => {
    const session = new Session(req.body);
});

sessionRouter.get('/session', checkAuth, (req, res) => {
    if (req.session.partnerId) {
        User.findById(req.session.partnerId, (err, user) => {
            if (err) {
                res.send(err);
            } else {
                res.render(path.resolve('public/views/session.ejs'), {
                    myId: req.session.userId,
                    partnerId: req.session.partnerId,
                    partnerName: user[0].name
                });
            }
        })
    } else {
        res.redirect("/login");
    }
});

sessionRouter.post('/session', checkAuth, (req, res) => {
    req.session.partnerId = req.body.partner;
    res.send();
});
