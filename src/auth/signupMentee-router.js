import express from 'express';
import path from 'path';
import User from "../domain/user";
import Mentee from "../domain/mentee";
import jwt from 'jsonwebtoken';
import passport from 'passport';
import Auth from "../domain/auth";
import Mentor from "../domain/mentor";

//config();




export const signupMenteeRouter = express.Router()


// // Login Route
// signupMenteeRouter.get('/facebookSignup', passport.authenticate('facebook', { scope: ['email', 'profile'] }))
//
// // Facebook Callback Route
// signupMenteeRouter.get('/callback', passport.authenticate('faccebook', { session: false, failureRedirect: REDIRECT + '?error=true' }), (req, res) => {
//     // sign a JWT with user id
//     const token = jwt.sign({ id: req.user.gid }, JWT_SECRET, { expiresIn: '12h' })
//
//     try {
//         // send the freshly new token as a quary string back to client
//         res.redirect(REDIRECT + '?token=' + token)
//     } catch (err) {
//         console.log(err)
//     }
// })


signupMenteeRouter.get('/', (req, res) => {
    if (req.session.loggedin) {
        Mentee.findById(req.session.userId, (err, mentee) => {
            if (mentee.length === 1) {
                res.redirect("/u/dashboard");
            } else {
                res.redirect("/m/dashboard");
            }
        });
    } else {
        res.render(path.resolve('public/views/signupMentee.ejs'), {en: req.session.lang});
    }
});

signupMenteeRouter.post("/", async (req, res) => {
    const {name, username, password, repassword,phone} = req.body;
    if (name && username && password && repassword && phone.match(/^(\+4|)?(07[0-8]{1}[0-9]{1}|02[0-9]{2}|03[0-9]{2}){1}?(\s|\.|\-)?([0-9]{3}(\s|\.|\-|)){2}$/igm)) {
        if (password === repassword) {
            await User.findByUsername(username, (err, user) => {
                        if (err) {
                        } else {
                            if (user.length !== 0) {
                                console.log(user);
                                res.render(path.resolve('public/views/signupMentee.ejs'), {"message": "Email already used"});

                            }
                            else{
                                User.create(new User({name, "mail": username, phone, password}), (err, user) => {
                                    Mentee.create(new Mentee({"id": user}), (err,mentee) => {
                                        console.log("mentee: ", mentee)
                                    });
                                    res.redirect('/verifyEmail/send/' + user +'/' + username);
                                });
                            }
                        }
                    });
        } else {
            res.render(path.resolve('public/views/signupMentee.ejs'), {"message": "Passwords do not match"});
        }
    } else {
        res.render(path.resolve('public/views/signupMentee.ejs'), {"message": "Invalid datas"});

    }
});

signupMenteeRouter.get('/:error',(req,res)=>{
    res.render(path.resolve('public/views/signupMentee.ejs'),{"message":"Email already used"});

})



