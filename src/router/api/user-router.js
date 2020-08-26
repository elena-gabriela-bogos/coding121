import express from 'express';
import User from "../../domain/user";
import {checkAuth} from "./authentification";

export const userRouter = express.Router()

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