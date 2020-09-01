import express from 'express';
import path from 'path';
import User from "../domain/user";
import Mentor from "../domain/mentor";
import passport from "passport";

export const loginRouter = express.Router()

loginRouter.get('/googleLogin', passport.authenticate('googleLogin', { scope: ['email', 'profile'] }));

loginRouter.get('/callback', passport.authenticate('googleLogin', { session: false, failureRedirect: "http://localhost:3000/login/true" }), (req, res) => {
    // sign a JWT with user id
    // const token = jwt.sign({ id: req.user.gid }, JWT_SECRET, { expiresIn: '12h' })
    //
    // try {
    //     // send the freshly new token as a quary string back to client
    //     res.redirect(REDIRECT + '?token=' + token)
    // } catch (err) {
    //     console.log(err)
    // }
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
        //res.render(path.resolve('public/views/phoneConfirmation_social.ejs'), {"id": req.user});

    }catch (err){
        console.log(err)
    }
    //res.redirect('/phoneConfirmation/' + req.user.id);
    //console.log("google auth mere");
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