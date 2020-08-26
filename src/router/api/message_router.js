import express from 'express';
import {checkAuth} from "./authentification";
import Message from "../../domain/message";

export const messageRouter = express.Router()

messageRouter.get('/', checkAuth, (req, res) => {
    if (!req.query.user && !req.query.status) {
        Message.findAll((err, message) => {
            if (err) {
                res.send(err);
            } else {
                res.send(message);
            }
        });
    } else if (req.query.status) {
        Message.getMessagesInfoOfUser(req.session.userId, (err, messages) => {
            if (err) {
                res.send(err);
            } else {
                let recentUsers = {};
                messages.forEach(message => {
                    if (req.session.userId == message.user_id2) {
                        let userId = message.user_id1;
                        if (!(userId in recentUsers) && message.status === req.query.status) {
                            recentUsers[userId] = {name: message.name, date: message.deliveredTime};
                        }
                    }
                });
                recentUsers = Object.entries(recentUsers);
                res.send(recentUsers);
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

messageRouter.get('/history', checkAuth, (req, res) => {
    Message.getMessagesInfoOfUser(req.session.userId, (err, messages) => {
        if (err) {
            res.send(err);
        } else {
            let recentUsers = {};
            messages.forEach(message => {
                let userId = message.user_id1;
                if (userId == req.session.userId) {
                    userId = message.user_id2;
                }
                if (!(userId in recentUsers)) {
                    recentUsers[userId] = {name: message.name, date: message.deliveredTime};
                }
            });
            recentUsers = Object.entries(recentUsers);
            recentUsers.sort((a, b) => {
                if (a[1]["date"] < b[1]["date"]) {
                    return 1;
                } else if (a[1]["date"] > b[1]["date"]) {
                    return -1;
                } else {
                    return 0;
                }
            });
            res.send(recentUsers);
        }
    });
});

messageRouter.post('/', checkAuth, (req, res) => {
    if (!req.query.user) {
        const newMessage = new Message(req.body);

        Message.create(newMessage, function (err, message) {
            if (err) {
                res.send(err);
            } else {
                res.json({error: false, message: "Message added successfully!", data: message});
            }
        });
    } else {
        let users = req.query.user;
        if (users.length === 2) {
            Message.setMessagesBetweenUsersRead(users, (err, messages) => {
                if (err) {
                    res.send(err);
                } else {
                    res.send(messages);
                }
            });
        }
    }
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



