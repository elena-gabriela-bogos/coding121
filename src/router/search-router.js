import express from 'express';

import path from 'path';
import {dbConn} from "../../config/db.config";
import {checkAuth} from "./api/authentification";
import {checkSession} from "./api/session-check";
import User from "../domain/user";


export const searchRouter = express.Router();

// searchRouter.get('/', checkAuth, checkSession, (req, res) => {
//     res.render(path.resolve('public/views/search.ejs'), {
//         chatOpen: req.session.chatOpen,
//         id: req.session.userId,
//         chatPartner: req.session.chattingWith,
//         chatHistoryOpen: req.session.chatHistoryOpen, en: req.session.lang
//     });
// });



searchRouter.post('/', checkAuth, checkSession, (req, res) => {
    // console.log(req.body);
    let q = req.body.q;
    let sql = "select u.id as userId, u.name as userName, ms.yearsOfExperience from user u inner join mentorsskills ms on ms.idMentor=u.id inner join languages_frameworks lf on ms.idLF=lf.id inner join mentor m on m.id=u.id where m.valid=1 and u.name=? group by u.name;"
        + " select u.id as userId, u.name as userName, lf.name as lfName, ms.yearsOfExperience from user u inner join mentorsskills ms on ms.idMentor=u.id inner join languages_frameworks lf on ms.idLF=lf.id AND lf.name=? inner join mentor m on m.id=u.id where m.valid=1;"
        + "select  lf.name as lfName from user u inner join mentorsskills ms on ms.idMentor=u.id inner join languages_frameworks lf on ms.idLF=lf.id inner join mentor m on m.id=u.id where m.valid=1 and u.name=?;"
    dbConn.query(sql, [q, q, q], function (err, result) {
        if (err) throw err;
        // console.log(result);
        User.findById(req.session.userId, (err, user) => {
            res.render(path.resolve('public/views/search.ejs'), {
                dataByName: result[0], dataByLf: result[1], lfByName: result[2],
                chatOpen: req.session.chatOpen,
                id: req.session.userId,
                name: user[0].name,
                picture: user[0].picture,
                chatPartner: req.session.chattingWith,
                chatHistoryOpen: req.session.chatHistoryOpen,
                en: req.session.lang
            });
        })
    });
});

  