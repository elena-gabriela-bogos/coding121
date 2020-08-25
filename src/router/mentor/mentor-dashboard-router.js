import express from 'express';
import path from 'path';
import {checkAuth} from "../api/authentification";
import User from "../../domain/user";

export const mentorDashboardRouter = express.Router()

mentorDashboardRouter.get('/', checkAuth, (req, res) => {
    User.findById(req.session.userId, (err, user) => {
        res.render(path.resolve('public/views/dashboardMentee.ejs'), {
            name: user[0].name,
            picture: user[0].picture,
            id: user[0].id
        });
    });
});
