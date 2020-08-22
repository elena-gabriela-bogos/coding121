import express from 'express';
import path from 'path';
import User from "../domain/user";
import Mentor from "../domain/mentor";

export const logoutRouter = express.Router()

logoutRouter.get('/', (req, res) => {
    if (req.session.loggedin) {
        req.session.destroy();
    }
    res.redirect("/");
});