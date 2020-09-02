import express from 'express';
import path from 'path';
import User from "../domain/user";
import Mentor from "../domain/mentor";
import passport from "passport";

export const loginRouter = express.Router()

loginRouter.get('/googleLogin', passport.authenticate('googleLogin', { scope: ['email', 'profile'] }));

loginRouter.get('/callback', passport.authenticate('googleLogin', { session: false, failureRedirect: "http://localhost:3000/login/true" }), (req, res) => {
    try{
        req.session.loggedin = true;
        req.session.username = req.user[0].mail;
        req.session.userId = req.user[0].id;
        req.session.name = req.user[0].name;
        console.log('user',req.user[0].id);
        Mentor.findById(req.user[0].id, (err, mentor) => {
            if (mentor.length === 1) {
                res.redirect("/m/dashboard");
            } else {
                res.redirect("/u/dashboard");
            }
        });

    }catch (err){
        console.log(err)
    }
})

loginRouter.get('/facebookLogin', passport.authenticate('facebookLogin', { scope: ['email', 'public_profile'] }));

loginRouter.get('/facebook_callback', passport.authenticate('facebookLogin', { session: false, failureRedirect: "http://localhost:3000/Login/true" }), (req, res) => {
    try{
        req.session.loggedin = true;
        req.session.username = req.user[0].mail;
        req.session.userId = req.user[0].id;
        req.session.name = req.user[0].name;
        console.log('user',req.user[0].id);
        Mentor.findById(req.user[0].id, (err, mentor) => {
            if (mentor.length === 1) {
                res.redirect("/m/dashboard");
            } else {
                res.redirect("/u/dashboard");
            }
        });

    }catch (err){
        console.log(err)
    }
})

loginRouter.get('/', (req, res) => {
    if (req.session.loggedin) {
        Mentor.findById(req.session.userId, (err, mentor) => {
            if (mentor.length === 1) {
                res.redirect("/m/dashboard");
            } else {
                res.redirect("/u/dashboard");
            }
        });
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
                        Mentor.findById(userId, (err, mentor) => {
                            if (mentor.length === 1) {
                                `res.redirect("/m/dashboard");`
                            } else {
                                res.redirect("/u/dashboard");
                            }
                        });
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