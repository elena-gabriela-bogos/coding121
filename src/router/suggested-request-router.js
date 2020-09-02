import express from 'express';
import Request from "../domain/request";
import {dbConn} from "../../config/db.config";

export const suggestedRequestRouter = express.Router()

suggestedRequestRouter.get('/', (req, res) => {

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

        Request.findSuggestedRequests(req.session.userId, (err, request) => {
            if (err) {
                res.send(err);
            } else {

                res.send(request);
            }
        });
    }
});

suggestedRequestRouter.post('/', (req, res) => {
    const request = new Request(req.body);

    Request.create(request, function (err, request) {
        if (err) {
            res.send(err);
        } else {
            res.json({error: false, message: "User added successfully!", data: request});
        }
    });
});

suggestedRequestRouter.get('/:id', (req, res) => {
    Request.findById(req.params.id, function (err, request) {
        if (err) {
            res.send(err);
        } else {
            res.json(request);
        }
    });
});