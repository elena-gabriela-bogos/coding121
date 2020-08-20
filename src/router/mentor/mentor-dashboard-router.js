import express from 'express';
import path from 'path';

export const mentorDashboardRouter = express.Router()

mentorDashboardRouter.get('/', (req, res) => {
    if (req.session.loggedin) {
        console.log("mentor");
        // res.render(path.resolve('public/views/dashboardMentee.ejs'), {user: req.session.username});
    } else {
        res.redirect('/login');
    }
});
