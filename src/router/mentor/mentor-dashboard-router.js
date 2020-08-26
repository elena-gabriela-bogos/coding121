
import express from 'express';
import path from 'path';
import User from "../../domain/user";

export const mentorDashboardRouter = express.Router()

mentorDashboardRouter.get('/', (req, res) => {
    if (req.session.loggedin) {
        User.findById(req.session.userId, (err, user) => {
            res.render(path.resolve('public/views/dashboardMentor.ejs'), {name: user[0].name, picture: user[0].picture});
        });
    } else {
        res.redirect('/login');
    }
});

