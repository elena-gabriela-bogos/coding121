import express from 'express';
import Mentor from "../../domain/mentor";
import {checkAuth} from "./authentification";

export const mentorRouter = express.Router()

mentorRouter.get('/', checkAuth, (req, res) => {
    if (!req.query.skill) {
        Mentor.findAll((err, mentor) => {
            if (err) {
                res.send(err);
            } else {
                console.log('res', mentor);
                res.send(mentor);
            }
        });
    } else {
        let skills = req.query.skill;
        if (!(req.query.skill instanceof Array)) {
            skills = [skills];
        }
        Mentor.filterByLF(skills, (err, mentors) => {
            console.log(mentors);
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