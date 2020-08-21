import express from 'express';
import path from 'path';
import User from "../domain/user";
import Mentor from "../domain/mentor";
import {checkAuth} from "./api/authentification";

export const logoutRouter = express.Router()

logoutRouter.get('/', checkAuth, (req, res) => {
    req.session.destroy();
    res.redirect("/");
});