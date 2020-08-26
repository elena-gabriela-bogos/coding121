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

sessionRouter.get('/', (req, res) => {
    res.render(path.resolve('public/views/menteeSessionHistory.ejs'));

});



sessionRouter.post('/', (req, res) => {
    console.log(req.body);
    const session = new Session(req.body);
    Session.findByMentee(req.body.id);
    res.render(path.resolve('public/views/menteeSessionHistory.ejs'));


});

