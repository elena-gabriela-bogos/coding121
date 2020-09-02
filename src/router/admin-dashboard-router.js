import express from 'express';
import path from 'path';
import {checkAdmin, checkAuth} from "./api/authentification";
import User from "../domain/user";

export const adminDashboardRouter = express.Router()

adminDashboardRouter.get('/', checkAuth, checkAdmin, (req, res) => {
    User.findById(req.session.userId, (err, user) => {
        let picture = null;
        if (user[0].picture){
            picture = Buffer.from(user[0].picture).toString('base64');
        }
        res.render(path.resolve('public/views/dashboardAdmin.ejs'), {
            name: user[0].name,
            picture: picture,
            id: user[0].id
        });
    });
});