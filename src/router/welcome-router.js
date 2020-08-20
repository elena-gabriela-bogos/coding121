import express from 'express';
import path from 'path';
import User from "../domain/user";

export const welcomePageRouter = express.Router()

welcomePageRouter.get('/', (req, res) => {
    if (req.session.loggedin) {
        res.redirect('/u/dashboard');
    } else {
        res.render(path.resolve('public/index.ejs'));
    }
});
