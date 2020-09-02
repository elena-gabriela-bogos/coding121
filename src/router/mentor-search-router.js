import express from 'express';

import path from 'path';
import {dbConn} from "../../config/db.config";
import {checkAuth} from "./api/authentification";


export const mentorSearchRouter = express.Router();

mentorSearchRouter.get('/', checkAuth, (req, res) => {
    res.render(path.resolve('public/views/mentorSearch.ejs'));
});


mentorSearchRouter.post('/', checkAuth, (req, res) => {

    console.log(req.body + "mentorrr");
    let q = req.body.q;
    let sql = " select distinct user.id,user.name,request.description,request.postedAt from request inner join requestskills on request.id=requestskills.idrequest inner join languages_frameworks on languages_frameworks.name=? inner join user on user.id=request.idMentee";
     dbConn.query(sql, [q], function (err, result) {
         if (err) throw err;
         console.log(result);
         console.log(result.length);

         res.render(path.resolve('public/views/mentorSearch.ejs'), {data: result,
             chatOpen: req.session.chatOpen,
             id: req.session.userId,
             chatPartner: req.session.chattingWith,
             chatHistoryOpen: req.session.chatHistoryOpen});

     });
});

