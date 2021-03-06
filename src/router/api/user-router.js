import express from 'express';
import User from "../../domain/user";
import {checkAuth} from "./authentification";

export const userRouter = express.Router()

userRouter.get('/status', checkAuth, (req, res) => {
    if (req.session.busy) {
        res.send({userStatus: "busy"});
    } else {
        res.send({userStatus: "available"});
    }
});

userRouter.post('/language', (req, res) => {
    req.session.lang = req.body.lang;
    res.send();
});

userRouter.get('/', checkAuth, (req, res) => {
    User.findAll((err, user) => {
        if (err) {
            res.send(err);
        } else {
            console.log('res', user);
            res.send(user);
        }
    });
});

userRouter.post('/', checkAuth, (req, res) => {
    const newUser = new User(req.body);

    User.create(newUser, function (err, user) {
        if (err) {
            res.send(err);
        } else {
            res.json({error: false, message: "User added successfully!", data: user});
        }
    });
});

userRouter.get('/:id', checkAuth, (req, res) => {
    User.findById(req.params.id, function (err, user) {
        if (err) {
            res.send(err);
        } else {
            res.json(user);
        }
    });
});
