import express from 'express';
import Request from "../domain/request";

export const requestRouter = express.Router()

requestRouter.get('/', (req, res) => {
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
        Request.findByStatus(req.session.userId, req.query.status, (err, request) => {
            if (err) {
                res.send(err);
            } else {
                console.log('res', request);
                res.send(request);
            }
        });
    }
});

requestRouter.post('/', (req, res) => {
    const request = new Request(req.body);

    Request.create(request, function (err, request) {
        if (err) {
            res.send(err);
        } else {
            res.json({error: false, message: "User added successfully!", data: request});
        }
    });
});

requestRouter.get('/:id', (req, res) => {
    Request.findById(req.params.id, function (err, request) {
        if (err) {
            res.send(err);
        } else {
            res.json(request);
        }
    });
});