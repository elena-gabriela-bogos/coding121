import express from 'express';
import path from 'path';
import {checkAdmin, checkAuth} from "./api/authentification";
import User from "../domain/user";

export const adminDashboardRouter = express.Router()

adminDashboardRouter.get('/', checkAuth, checkAdmin, (req, res) => {
    User.findById(req.session.userId, (err, user) => {
        res.render(path.resolve('public/views/dashboardAdmin.ejs'), {
            name: user[0].name,
            picture: user[0].picture,
            id: user[0].id,
            en: req.session.lang
        });
    });
});