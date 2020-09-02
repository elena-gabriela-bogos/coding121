import express from 'express';
import Mentor from "../../domain/mentor";
import {checkAuth} from "./authentification";

export const mentorRouter = express.Router()

mentorRouter.get('/', checkAuth, (req, res) => {
    if (!req.query.skill && !req.query.validStatus) {
        Mentor.findAll((err, mentor) => {
            if (err) {
                res.send(err);
            } else {
                console.log('res', mentor);
                res.send(mentor);
            }
        });
    } else if (req.query.skill) {
        let skills = req.query.skill;
        if (!(req.query.skill instanceof Array)) {
            skills = [skills];
        }
        Mentor.filterByLF(skills, (err, mentors) => {
            if (err) {
                res.send(err);
            } else {
                mentors.sort((a, b) => (a.cmp > b.cmp) ? 1 : ((b.cmp < a.cmp) ? -1 : 0));
                mentors = mentors.map(mentor => {
                    delete mentor["cmp"];
                    return mentor;
                });
                res.send(mentors);
            }
        });
    } else {
        let status = req.query.validStatus;
        Mentor.findByValidStatus(status, (err, mentors) => {
            if (err) {
                res.send(err);
            } else {
                res.send(mentors);
            }
        })
    }
});

mentorRouter.post('/', checkAuth, (req, res) => {
    const newMentor = new Mentor(req.body);

    Mentor.create(newMentor, function (err, mentor) {
        if (err) {
            res.send(err);
        } else {
            res.json({error: false, message: "Mentor added successfully!", data: mentor});
        }
    });
});

mentorRouter.get('/:id', checkAuth, (req, res) => {
    Mentor.findById(req.params.id, function (err, mentor) {
        if (err) {
            res.send(err);
        } else {
            res.json(mentor);
        }
    });
});

mentorRouter.post('/:id', checkAuth, (req, res) => {
    Mentor.updateStatus(req.params.id, req.body.status, function (err, mentor) {
        if (err) {
            res.send(err);
        } else {
            res.json(mentor);
        }
    });
});