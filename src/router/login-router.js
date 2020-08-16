import express from 'express';
import path from 'path';
import User from "../domain/user";

export const loginRouter = express.Router()

loginRouter.get('/', (req, res) => {
    if (req.session.loggedin) {
        res.redirect('/u/dashboard');
    } else {
        res.render(path.resolve('public/views/login.ejs'));
    }
});

loginRouter.post('/', (req, res) => {
    const {username, password} = req.body;
    if (username && password) {
        User.findByUsernameAndPassword(username, password, (err, user) => {
                if (err) {
                    res.send(err);
                } else {
                    if (user.length === 1) {
                        req.session.loggedin = true;
                        req.session.username = username;
                        res.redirect("/u/dashboard");
                    } else {
                        res.render(path.resolve('public/views/login.ejs'), {"message": "Invalid username or password"});
                    }
                }
            }
        );
    } else {
        res.render(path.resolve('public/views/login.ejs'), {"message": "Invalid username or password"});
    }
});