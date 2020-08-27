import express from "express";



import path from "path";
import {checkAuth} from "./api/authentification";

export const sessionRouter = express.Router();

sessionRouter.get('/', checkAuth, (req, res) => {
    res.render(path.resolve('public/views/menteeSessionHistory.ejs'));

});



sessionRouter.post('/', checkAuth, (req, res) => {
    console.log(req.body);
    const session = new Session(req.body);
    Session.findByMentee(req.body.id);
    res.render(path.resolve('public/views/menteeSessionHistory.ejs'));
});

