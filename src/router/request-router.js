import express from 'express';
import path from 'path';
import User from "../domain/user";
import Request from "../domain/request";
import RequestSkills from "../domain/request-skills";
import {checkAuth} from "./api/authentification";

export const requestRouter = express.Router()

requestRouter.get('/', checkAuth, (req, res) => {
    User.findById(req.session.userId, (err, user) => {
        res.render(path.resolve('public/views/request.ejs'), {name: user[0].name, picture: user[0].picture});
    });
});

requestRouter.post('/', checkAuth, (req, res) => {
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
                name: user[0].name,
                picture: user[0].picture,
                message: "Fill in all fields"
            });
        });
    }
});

requestRouter.get("/:id", checkAuth, (req, res) => {
    Request.findById(req.params.id, function (err, request) {
            if (err) {
                res.send(err);
            } else {
                if (request.length !== 0 && request[0].idMentee === req.session.userId) {
                    User.findById(req.session.userId, (err, user) => {
                        res.render(path.resolve('public/views/requestDetails.ejs'), {
                            name: user[0].name,
                            picture: user[0].picture,
                            request: request[0]
                        });
                    });
                } else {
                    res.redirect("/u/dashboard");
                }
            }
        }
    );
});