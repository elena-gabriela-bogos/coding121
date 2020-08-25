import express from 'express';
import {checkAuth} from "./authentification";
import Message from "../../domain/message";

export const messageRouter = express.Router()

messageRouter.get('/', checkAuth, (req, res) => {
    if (!req.query.user) {
        Message.findAll((err, message) => {
            if (err) {
                res.send(err);
            } else {
                res.send(message);
            }
        });
    } else {
        let users = req.query.user;
        if (users.length === 2) {
            Message.getMessagesBetweenUsers(users, (err, messages) => {
                if (err) {
                    res.send(err);
                } else {
                    res.send(messages);
                }
            });
        }
    }
});

messageRouter.post('/', checkAuth, (req, res) => {
    const newMessage = new Message(req.body);

    Message.create(newMessage, function (err, message) {
        if (err) {
            res.send(err);
        } else {
            res.json({error: false, message: "Message added successfully!", data: message});
        }
    });
});

messageRouter.get('/:id', checkAuth, (req, res) => {
    Message.findById(req.params.id, function (err, message) {
        if (err) {
            res.send(err);
        } else {
            res.json(message);
        }
    });
});