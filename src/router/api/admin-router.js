import express from 'express';
import {checkAuth} from "./authentification";
import Admin from "../../domain/admin";

export const adminRouter = express.Router()

adminRouter.get('/', checkAuth, (req, res) => {
    Admin.findAll((err, admin) => {
        if (err) {
            res.send(err);
        } else {
            console.log('res', admin);
            res.send(admin);
        }
    });
});

adminRouter.post('/', checkAuth, (req, res) => {
    const newAdmin = new Admin(req.body);

    Admin.create(newAdmin, function (err, admin) {
        if (err) {
            res.send(err);
        } else {
            res.json({error: false, message: "Admin added successfully!", data: admin});
        }
    });
});

adminRouter.get('/:id', checkAuth, (req, res) => {
    Admin.findById(req.params.id, function (err, admin) {
        if (err) {
            res.send(err);
        } else {
            res.json(admin);
        }
    });
});