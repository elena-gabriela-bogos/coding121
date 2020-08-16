import express from 'express';
import path from 'path';

export const dashboardRouter = express.Router()

dashboardRouter.get('/', (req, res) => {
    if (req.session.loggedin) {
        res.render(path.resolve('public/views/dashboard.ejs'), {user: req.session.username});
    } else {
        res.redirect('/login');
    }
});
