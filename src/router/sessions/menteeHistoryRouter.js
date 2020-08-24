import express from "express";
import Mentor from "../../domain/mentor";
import path from "path";
import Request from "../../domain/request";
import {requestRouter} from "../request-router";
import Session from "../../domain/sessions";
import {mentorRouter} from "../mentor/mentor_router";

export const menteeHistoryRouter = express.Router()



    menteeHistoryRouter.get('/', (req, res) => {
        Session.findAll((err, request) => {
            if (err) {
                res.send(err);
            } else {
                console.log('res', request);
                res.send(request);
            }
        });

    });

menteeHistoryRouter.get('/:id', (req, res) => {
    Session.findByMentee(req.params.id,function(err, request){
        if (err) {
            res.send(err);
        } else {
            console.log('res', request);
            res.send(request);
        }
    });

});


menteeHistoryRouter.post('/', (req, res) => {
    const newSession = new Session(req.body);

    Session.create(newSession, function (err, mentor) {
        if (err) {
            res.send(err);
        } else {
            res.json({error: false, message: "Session added successfully!", data: mentor});
        }
    });
});