import express from 'express';
import User from "../../domain/user";
import LanguagesFrameworks from "../../domain/languages-frameworks";
import {checkAuth} from "./authentification";

export const languagesFrameworksRouter = express.Router()

languagesFrameworksRouter.get('/', checkAuth, (req, res) => {
    LanguagesFrameworks.findAll((err, lf) => {
        if (err) {
            res.send(err);
        } else {
            res.send(lf);
        }
    });
});

languagesFrameworksRouter.post('/', checkAuth, (req, res) => {
    const languagesFrameworks = new LanguagesFrameworks(req.body);

    LanguagesFrameworks.create(languagesFrameworks, function (err, lf) {
        if (err) {
            res.send(err);
        } else {
            res.json({error: false, message: "LF added successfully!", data: lf});
        }
    });
});

languagesFrameworksRouter.get('/:id', checkAuth,(req, res) => {
    LanguagesFrameworks.findById(req.params.id, function (err, lf) {
        if (err) {
            res.send(err);
        } else {
            res.json(lf);
        }
    });
});