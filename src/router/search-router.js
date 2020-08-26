import express from 'express';

import path from 'path';
import {dbConn} from "../../config/db.config";


export const searchRouter = express.Router()
searchRouter.get('/', (req, res) => {
    res.render(path.resolve('public/views/search.ejs'));
});


searchRouter.post('/', (req, res) => {
    // console.log(req.body);
    let q = req.body.q;
    let sql = "select u.id as userId, u.name as userName, lf.name as lfName, ms.yearsOfExperience from user u inner join mentorsskills ms on ms.idMentor=u.id inner join languages_frameworks lf on ms.idLF=lf.id inner join mentor m on m.id=u.id where m.valid=1 and u.name=?;"
        + " select u.id as userId, u.name as userName, lf.name as lfName, ms.yearsOfExperience from user u inner join mentorsskills ms on ms.idMentor=u.id inner join languages_frameworks lf on ms.idLF=lf.id AND lf.name=? inner join mentor m on m.id=u.id where m.valid=1;";
    dbConn.query(sql, [q, q], function (err, result) {
        if (err) throw err;
        // console.log(result);

        res.render(path.resolve('public/views/search.ejs'), {dataByName: result[0], dataByLf: result[1]});

    });
});

  