import express from 'express';
import Mentor from "../../domain/mentor";

export const mentorRouter = express.Router()

mentorRouter.get('/', (req, res) => {
    Mentor.findAll((err, mentor) => {
        if (err) {
            res.send(err);
        } else {
            console.log('res', mentor);
            res.send(mentor);
        }
    });
});

mentorRouter.post('/', (req, res) => {
    const newMentor = new Mentor(req.body);

    Mentor.create(newMentor, function (err, mentor) {
        if (err) {
            res.send(err);
        } else {
            res.json({error: false, message: "Mentor added successfully!", data: mentor});
        }
    });
});

mentorRouter.get('/:id', (req, res) => {
    Mentor.findById(req.params.id, function (err, mentor) {
        if (err) {
            res.send(err);
        } else {
            res.json(mentor);
        }
    });
});