import express from 'express';
import path from 'path';
import User from "../domain/user";
import Mentor from "../domain/mentor";
import Admin from "../domain/admin";

export const loginRouter = express.Router()

loginRouter.get('/', (req, res) => {
    if (req.session.loggedin) {
        Admin.findById(req.session.userId, (err, admin) => {
            if (admin.length !== 0) {
                res.redirect("/admin");
            } else {
                Mentor.findById(req.session.userId, (err, mentor) => {
                    if (mentor.length === 1) {
                        res.redirect("/m/dashboard");
                    } else {
                        res.redirect("/u/dashboard");
                    }
                });
            }
        })
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
                        const userId = user[0].id;
                        req.session.loggedin = true;
                        req.session.username = username;
                        req.session.userId = userId;
                        req.session.name = user[0].name;
                        Admin.findById(req.session.userId, (err, admin) => {
                            if (admin.length !== 0) {
                                res.redirect("/admin");
                            } else {
                                Mentor.findById(req.session.userId, (err, mentor) => {
                                    if (mentor.length === 1) {
                                        res.redirect("/m/dashboard");
                                    } else {
                                        res.redirect("/u/dashboard");
                                    }
                                });
                            }
                        })
                    } else {
                        res.render(path.resolve('public/views/login.ejs'), {"message": "Invalid email or password"});
                    }
                }
            }
        );
    } else {
        res.render(path.resolve('public/views/login.ejs'), {"message": "Invalid email or password"});
    }
});