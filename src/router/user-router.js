import express from 'express';
import User from "../domain/user";

export const userRouter = express.Router()

userRouter.get('/', (req, res) => {
    User.findAll((err, user) => {
        if (err) {
            res.send(err);
        } else {
            console.log('res', user);
            res.send(user);
        }
    });
});

userRouter.post('/', (req, res) => {
    const newUser = new User(req.body);

    User.create(newUser, function (err, user) {
        if (err) {
            res.send(err);
        } else {
            res.json({error: false, message: "User added successfully!", data: user});
        }
    });
});

userRouter.get('/:id', (req, res) => {
    User.findById(req.params.id, function (err, user) {
        if (err) {
            res.send(err);
        } else {
            res.json(user);
        }
    });
});