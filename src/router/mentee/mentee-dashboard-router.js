import express from 'express';
import path from 'path';
import User from "../../domain/user";

export const menteeDashboardRouter = express.Router()

menteeDashboardRouter.get('/', (req, res) => {
    if (req.session.loggedin) {
        User.findById(req.session.userId, (err, user) => {
            res.render(path.resolve('public/views/dashboardMentee.ejs'), {name: user[0].name, picture: user[0].picture});
        });
    } else {
        res.redirect('/login');
    }
});
