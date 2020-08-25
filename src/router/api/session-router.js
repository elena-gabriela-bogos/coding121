import express from "express";
import {checkAuth} from "./authentification";
import LanguagesFrameworks from "../../domain/languages-frameworks";
import {languagesFrameworksRouter} from "./languages-frameworks-router";
import Session from "../../domain/session";
import Mentor from "../../domain/mentor";
import {mentorRouter} from "./mentor_router";
import {loginRouter} from "../login-router";
import path from "path";

export const sessionRouter = express.Router()
var id = 3;

sessionRouter.get('/', (req, res) => {
    { res.render(path.resolve('public/views/menteeSessionHistory.ejs'),);

        let mentees = req.query.mentee; //skills
        console.log(req.mentee);
        if (!(req.query.mentee instanceof Array)) {
            mentees = [mentees];
        }

        Session.findByMentee(mentees[0], (err, sessions) => {
            if (err) {
                res.send(err);
            } else {
                res.send(sessions);
            }
        });
    }
});

sessionRouter.post('/', (req, res) => {
    const session = new Session(req.body);

    Session.create(session, function (err, lf) {
        if (err) {
            res.send(err);
        } else {
            res.json({error: false, message: "Session added successfully!", data: lf});
        }
    });
});

mentorRouter.get('/:id', (req, res) => {
    Session.findById(req.params.id, function (err, mentor) {
        if (err) {
            res.send(err);
        } else {
            res.json(mentor);
        }
    });


});