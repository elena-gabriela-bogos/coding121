import express from 'express';
import path from 'path';
import User from "../../domain/user";
import {checkAuth} from "../api/authentification";
import {checkSession} from "../api/session-check";

export const mentorDashboardRouter = express.Router()

mentorDashboardRouter.get('/', checkAuth, checkSession, (req, res) => {
    User.findById(req.session.userId, (err, user) => {
        res.render(path.resolve('public/views/dashboardMentor.ejs'),
            {
                name: user[0].name,
                picture: user[0].picture,
                id: user[0].id,
                chatOpen: req.session.chatOpen,
                chatPartner: req.session.chattingWith,
                chatHistoryOpen: req.session.chatHistoryOpen
            });
    });
});

