import express from 'express';

import path from 'path';
import {dbConn} from "../../config/db.config";
import {checkAuth} from "./api/authentification";
import User from "../domain/user";


export const mentorSearchRouter = express.Router();

mentorSearchRouter.get('/', checkAuth, (req, res) => {
    res.render(path.resolve('public/views/mentorSearch.ejs'));
});


mentorSearchRouter.post('/', checkAuth, (req, res) => {
    const moment = require('moment');
    let q = req.body.q;

    let sql = " select distinct user.id,user.name,request.description,request.postedAt from " +
        "request inner join requestskills on request.id=requestskills.idrequest and request.status=? " +
        "inner join languages_frameworks on languages_frameworks.name=? and languages_frameworks.id=requestskills.idLF inner join user on user.id=request.idMentee";
    dbConn.query(sql, ["open", q], function (err, result) {
        if (err) throw err;
        for (var i = 0; i < result.length; i++)
            result[i].postedAt = Math.round(moment.duration(Date.now() - result[i].postedAt).asDays())
        User.findById(req.session.userId, (err, user) => {
            res.render(path.resolve('public/views/mentorSearch.ejs'), {
                data: result,
                chatOpen: req.session.chatOpen,
                id: req.session.userId,
                chatPartner: req.session.chattingWith,
                chatHistoryOpen: req.session.chatHistoryOpen,
                name: user[0].name,
                picture: user[0].picture,
                en: req.session.lang
            });
        })
    });
});

