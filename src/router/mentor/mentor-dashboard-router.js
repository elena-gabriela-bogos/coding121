import express from 'express';
import path from 'path';
import User from "../../domain/user";
import {checkAuth, checkMentor} from "../api/authentification";
import {checkSession} from "../api/session-check";
import Mentor from "../../domain/mentor";
import Mentee from "../../domain/mentee";

export const mentorDashboardRouter = express.Router()

mentorDashboardRouter.get('/', checkAuth, checkSession, checkMentor, (req, res) => {
    Mentee.findById(req.session.userId, (err, mentee) => {
        let isMentee = false;
        if (mentee.length > 0) {
            isMentee = true;
        }
        User.findById(req.session.userId, (err, user) => {
            let picture = null;
            if (user[0].picture) {
                renderBasedOnPicture(req, res, user, isMentee, 'public/views/dashboardMentor.ejs');
            } else {
                res.render(path.resolve('public/views/dashboardMentor.ejs'),
                    {
                        name: user[0].name,
                        picture: picture,
                        id: user[0].id,
                        chatOpen: req.session.chatOpen,
                        chatPartner: req.session.chattingWith,
                        chatHistoryOpen: req.session.chatHistoryOpen,
                        mentee: isMentee
                    });
            }
        });
    });
});

const renderBasedOnPicture = (req, res, user, isMentee, ejsPath) => {
    let picture = user[0].picture;
    res.render(path.resolve(ejsPath), {
        name: user[0].name,
        picture: picture,
        id: user[0].id,
        chatOpen: req.session.chatOpen,
        chatPartner: req.session.chattingWith,
        chatHistoryOpen: req.session.chatHistoryOpen,
        mentee: isMentee
    });
}
