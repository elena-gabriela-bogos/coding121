import express from 'express';
import path from 'path';
import {checkAuth} from "../api/authentification";

export const mentorDashboardRouter = express.Router()

mentorDashboardRouter.get('/', checkAuth, (req, res) => {
    console.log("mentor");
});
