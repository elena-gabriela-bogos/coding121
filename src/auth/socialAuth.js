import express from 'express';
import path from 'path';
import jwt from 'jsonwebtoken';
import passport from 'passport';

export const socialAuthRouter = express.Router()

// get required data from .env file
//const { JWT_SECRET, CLIENT_REDIRECT_URL: REDIRECT } = process.env
//
// Login Route
socialAuthRouter.get('/googleSignup/u', passport.authenticate('googleSignUpMentee', { scope: ['email', 'profile'] }));

socialAuthRouter.get('/googleSignup/m',passport.authenticate('googleSignUpMentor',{scope: ['email','profile'] }));

// Google Callback Route
socialAuthRouter.get('/callback/u', passport.authenticate('googleSignUpMentee', { session: false, failureRedirect: "http://localhost:3000/signupMentee/true" }), (req, res) => {
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
        res.render(path.resolve('public/views/phoneConfirmation_social.ejs'), {"id": req.user});

    }catch (err){
        console.log(err)
    }
    //res.redirect('/phoneConfirmation/' + req.user.id);
    //console.log("google auth mere");
})

socialAuthRouter.get('/callback/m', passport.authenticate('googleSignUpMentor', { session: false, failureRedirect: "http://localhost:3000/signupMentee/true" }), (req, res) => {

    try{
        res.render(path.resolve('public/views/phoneConfirmation_social.ejs'), {"id": req.user});

    }catch (err){
        console.log(err)
    }
    //res.redirect('/phoneConfirmation/' + req.user.id);
    //console.log("google auth mere");
})