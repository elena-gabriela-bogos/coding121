import express from 'express';
import path from 'path';
import User from "../../domain/user";
import {checkAuth} from "../api/authentification";

export const menteeDashboardRouter = express.Router()

menteeDashboardRouter.get('/', checkAuth, (req, res) => {
    User.findById(req.session.userId, (err, user) => {
        res.render(path.resolve('public/views/dashboardMentee.ejs'), {name: user[0].name, picture: user[0].picture});
    });
});
