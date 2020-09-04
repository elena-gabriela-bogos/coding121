import express from 'express';
import path from 'path';
import User from "../../domain/user";
import {checkAuth, checkMentee} from "../api/authentification";
import Request from "../../domain/request";
import RequestSkills from "../../domain/request-skills";
import {checkSession} from "../api/session-check";
import Mentee from "../../domain/mentee";
import Mentor from "../../domain/mentor";

export const menteeDashboardRouter = express.Router()

menteeDashboardRouter.get('/', checkAuth, checkSession, checkMentee, (req, res) => {
    Mentor.findById(req.session.userId, (err, mentor) => {
        let isMentor = false;
        if (mentor.length > 0) {
            isMentor = true;
        }
        User.findById(req.session.userId, (err, user) => {
            let picture = null;
            if (user[0].picture) {
                renderBasedOnPicture(req, res, user, isMentor, 'public/views/dashboardMentee.ejs', null);
            } else {
                res.render(path.resolve('public/views/dashboardMentee.ejs'), {
                    name: user[0].name,
                    picture: picture,
                    id: user[0].id,
                    chatOpen: req.session.chatOpen,
                    chatPartner: req.session.chattingWith,
                    chatHistoryOpen: req.session.chatHistoryOpen,
                    mentor: isMentor,
                    en: req.session.lang
                });
            }
        });
    })
});

menteeDashboardRouter.get('/request', checkAuth, checkSession, checkMentee, (req, res) => {
    Mentor.findById(req.session.userId, (err, mentor) => {
        let isMentor = false;
        if (mentor.length > 0) {
            isMentor = true;
        }
        User.findById(req.session.userId, (err, user) => {
            let picture = null;
            if (user[0].picture) {
                renderBasedOnPicture(req, res, user, isMentor, 'public/views/request.ejs', null);
            } else {
                res.render(path.resolve('public/views/request.ejs'), {
                    name: user[0].name,
                    picture: picture,
                    id: user[0].id,
                    chatOpen: req.session.chatOpen,
                    chatPartner: req.session.chattingWith,
                    chatHistoryOpen: req.session.chatHistoryOpen,
                    mentor: isMentor,
                    en: req.session.lang
                });
            }
        });
    });
});

menteeDashboardRouter.post('/request', checkAuth, checkSession, checkMentee, (req, res) => {
    const {description, skills} = req.body;
    if (description && skills && skills.length > 0) {
        Request.create(new Request({description, "idMentee": req.session.userId}), (err, request) => {
                skills.forEach(skill => {
                    RequestSkills.create({"idrequest": request, "idLF": parseInt(skill)}, () => {

                    });
                });
            }
        );
        res.redirect("/u/dashboard");
    } else {
        Mentor.findById(req.session.userId, (err, mentor) => {
            let isMentor = false;
            if (mentor.length > 0) {
                isMentor = true;
            }
            User.findById(req.session.userId, (err, user) => {
                let picture = null;
                if (user[0].picture) {
                    renderBasedOnPicture(req, res, user, isMentor, 'public/views/request.ejs', null);
                } else {
                    res.render(path.resolve('public/views/request.ejs'), {
                        id: user[0].id,
                        name: user[0].name,
                        picture: picture,
                        message: "Fill in all fields",
                        chatOpen: req.session.chatOpen,
                        chatPartner: req.session.chattingWith,
                        chatHistoryOpen: req.session.chatHistoryOpen,
                        mentor: isMentor,
                        en: req.session.lang
                    });
                }
            });
        });
    }
});

menteeDashboardRouter.get("/request/:id", checkAuth, checkSession, checkMentee, (req, res) => {
    Mentor.findById(req.session.userId, (err, mentor) => {
        let isMentor = false;
        if (mentor.length > 0) {
            isMentor = true;
        }
        Request.findById(req.params.id, function (err, request) {
                if (err) {
                    res.send(err);
                } else {
                    if (request.length !== 0 && request[0].idMentee === req.session.userId) {
                        User.findById(req.session.userId, (err, user) => {
                            let picture = null;
                            if (user[0].picture) {
                                renderBasedOnPicture(req, res, user, isMentor, 'public/views/requestDetails.ejs', request[0]);
                            } else {
                                res.render(path.resolve('public/views/requestDetails.ejs'), {
                                    name: user[0].name,
                                    picture: picture,
                                    id: user[0].id,
                                    request: request[0],
                                    chatOpen: req.session.chatOpen,
                                    chatPartner: req.session.chattingWith,
                                    chatHistoryOpen: req.session.chatHistoryOpen,
                                    mentor: isMentor,
                                    en: req.session.lang
                                });
                            }
                        });
                    } else {
                        res.redirect("/u/dashboard");
                    }
                }
            }
        );
    });
});

const renderBasedOnPicture = (req, res, user, isMentor, ejsPath, request) => {
    let picture = user[0].picture;
    if (request) {
        res.render(path.resolve(ejsPath), {
            name: user[0].name,
            picture: picture,
            id: user[0].id,
            chatOpen: req.session.chatOpen,
            chatPartner: req.session.chattingWith,
            chatHistoryOpen: req.session.chatHistoryOpen,
            mentor: isMentor,
            request: request,
            en: req.session.lang
        });
    } else {
        res.render(path.resolve(ejsPath), {
            name: user[0].name,
            picture: picture,
            id: user[0].id,
            chatOpen: req.session.chatOpen,
            chatPartner: req.session.chattingWith,
            chatHistoryOpen: req.session.chatHistoryOpen,
            mentor: isMentor,
            en: req.session.lang
        });
    }
}
