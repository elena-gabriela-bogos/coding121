import express from 'express';
import path from 'path';
import User from "../../domain/user";
import {checkAuth} from "../api/authentification";
import Request from "../../domain/request";
import RequestSkills from "../../domain/request-skills";

export const menteeDashboardRouter = express.Router()

menteeDashboardRouter.get('/', checkAuth, (req, res) => {
    User.findById(req.session.userId, (err, user) => {
        res.render(path.resolve('public/views/dashboardMentee.ejs'), {
            name: user[0].name,
            picture: user[0].picture,
            id: user[0].id,
            chatOpen: req.session.chatOpen,
            chatPartner: req.session.chattingWith
        });
    });
});

menteeDashboardRouter.get('/request', checkAuth, (req, res) => {
    User.findById(req.session.userId, (err, user) => {
        res.render(path.resolve('public/views/request.ejs'), {
            name: user[0].name,
            picture: user[0].picture,
            id: user[0].id,
            chatOpen: req.session.chatOpen,
            chatPartner: req.session.chattingWith
        });
    });
});

menteeDashboardRouter.post('/request', checkAuth, (req, res) => {
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
        User.findById(req.session.userId, (err, user) => {
            res.render(path.resolve('public/views/request.ejs'), {
                id: user[0].id,
                name: user[0].name,
                picture: user[0].picture,
                message: "Fill in all fields",
                chatOpen: req.session.chatOpen,
                chatPartner: req.session.chattingWith
            });
        });
    }
});

menteeDashboardRouter.get("/request/:id", checkAuth, (req, res) => {
    Request.findById(req.params.id, function (err, request) {
            if (err) {
                res.send(err);
            } else {
                if (request.length !== 0 && request[0].idMentee === req.session.userId) {
                    User.findById(req.session.userId, (err, user) => {
                        res.render(path.resolve('public/views/requestDetails.ejs'), {
                            name: user[0].name,
                            picture: user[0].picture,
                            id: user[0].id,
                            request: request[0],
                            chatOpen: req.session.chatOpen,
                            chatPartner: req.session.chattingWith
                        });
                    });
                } else {
                    res.redirect("/u/dashboard");
                }
            }
        }
    );
});
