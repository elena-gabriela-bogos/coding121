import express from 'express';
import path from 'path';

export const menteeDashboardRouter = express.Router()

menteeDashboardRouter.get('/', (req, res) => {
    if (req.session.loggedin) {
        res.render(path.resolve('public/views/dashboardMentee.ejs'), {user: req.session.username});
    } else {
        res.redirect('/login');
    }
});
