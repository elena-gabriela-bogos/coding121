import express from 'express';
import Mentee from "../../domain/mentee";
import {checkAuth} from "./authentification";

export const menteeRouter = express.Router()

menteeRouter.get('/', checkAuth, (req, res) => {
    Mentee.findAll((err, mentee) => {
        if (err) {
            res.send(err);
        } else {
            console.log('res', mentee);
            res.send(mentee);
        }
    });
});

menteeRouter.post('/', checkAuth, (req, res) => {
    const newMentee = new Mentee(req.body);

    Mentee.create(newMentee, function (err, mentee) {
        if (err) {
            res.send(err);
        } else {
            res.json({error: false, message: "Mentee added successfully!", data: mentee});
        }
    });
});

menteeRouter.get('/:id', checkAuth, (req, res) => {
    Mentee.findById(req.params.id, function (err, mentee) {
        if (err) {
            res.send(err);
        } else {
            res.json(mentee);
        }
    });
});