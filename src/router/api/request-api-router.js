import express from 'express';
import Request from "../../domain/request";
import RequestSkills from "../../domain/request-skills";
import {checkAuth} from "./authentification";

export const requestApiRouter = express.Router()

requestApiRouter.get('/', checkAuth, (req, res) => {
    if (!req.query.status) {
        Request.findAll((err, request) => {
            if (err) {
                res.send(err);
            } else {
                console.log('res', request);
                res.send(request);
            }
        });
    } else {
        RequestSkills.findByMenteeAndStatus(req.session.userId, req.query.status, (err, requests) => {
            if (err) {
                res.send(err);
            } else {
                const requestDTOs = [];
                let distinctRequestIds = requests
                    .map(item => item.id)
                    .filter((v, i, a) => a.indexOf(v) === i);
                distinctRequestIds.forEach(id => {
                    const requestSkills = requests.filter((x, a) => x.id === id);
                    let requestDTO = requestSkills[0];
                    requestDTO.technologies = [requestDTO.name];
                    delete requestDTO.name;
                    requestSkills.shift();
                    requestSkills.forEach((skill) => {
                        requestDTO.technologies.push(skill.name);
                    });
                    requestDTOs.push(requestDTO);
                });
                res.send(requestDTOs);
            }
        });
    }
});

requestApiRouter.post('/', checkAuth, (req, res) => {
    const request = new Request(req.body);

    Request.create(request, function (err, request) {
        if (err) {
            res.send(err);
        } else {
            res.json({error: false, message: "Request added successfully!", data: request});
        }
    });
});

requestApiRouter.get('/:id', checkAuth, (req, res) => {
    if (!req.query.status) {
        Request.findById(req.params.id, function (err, request) {
            if (err) {
                res.send(err);
            } else {
                res.json(request);
            }
        });
    } else {
        Request.updateStatus(req.params.id, req.query.status, (err, request) => {
            if (err) {
                res.send(err);
            } else {
                res.send();
            }
        });
    }


});

requestApiRouter.get('/:id/skills', checkAuth, (req, res) => {
    RequestSkills.findSkillsById(req.params.id, function (err, requests) {
        if (err) {
            res.send(err);
        } else {
            let skills = [];
            requests.forEach(request => {
                skills.push({"id": request.idLF, "name": request.name});
            });
            res.json(skills);
        }
    });
});
