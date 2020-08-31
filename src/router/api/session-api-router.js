import {checkAuth} from "./authentification";
import Session from "../../domain/session";
import * as express from "express";

export const sessionApiRouter = new express.Router();

sessionApiRouter.post("/", checkAuth, (req, res) => {
    Session.create(req.body, (err, session) => {
        if (err) {
            res.send(err);
        } else {
            req.session.session = session;
            res.json(session);
        }
    })
})

sessionApiRouter.put("/", checkAuth, (req, res) => {
    const id = req.session.session;
    Session.findById(id, (err, session) => {
        const duration = Date.now() - session[0].startingAt;
        Session.updateDuration([duration, id], (err, session) => {
            if (err) {
                res.send(err);
            } else {
                req.session.partnerId = null;
                req.session.busy = false;
                res.json(session);
            }
        })
    })
})