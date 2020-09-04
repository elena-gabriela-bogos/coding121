import express from 'express';

import path from 'path';
import {dbConn} from "../../config/db.config";
import {checkAuth} from "./api/authentification";
import {checkSession} from "./api/session-check";
import LanguagesFrameworks from "../domain/languages-frameworks";
import Mentor from "../domain/mentor";


export const setUpMentorRouter = express.Router();

setUpMentorRouter.get('/', checkAuth, checkSession, (req, res) => {
    res.render(path.resolve('public/views/setUpMentor.ejs'));
});

setUpMentorRouter.get('/pending', checkAuth, checkSession, (req, res) => {
    res.render(path.resolve('public/views/pendingMentor.ejs'));
});


setUpMentorRouter.get('/search', checkAuth, function(req, res){
    dbConn.query('SELECT name from languages_frameworks where name like "%'+req.query.key+'%"', function(err, rows, fields) {
        if (err) throw err;
        var data=[];
        for(let i=0;i<rows.length;i++)
        {
            data.push(rows[i].name);
        }
        res.end(JSON.stringify(data));
    });
    // console.log(req.body);

});

setUpMentorRouter.post('/submitSkills',checkAuth,function(req, res){
    console.log(req.body.skills);
    req.body.skills.forEach(skill=>{
        LanguagesFrameworks.findByName(skill.name,(err,lang)=>{
            dbConn.query("INSERT INTO mentorsskills (idMentor,idLF,yearsOfExperience,details) VALUES (?,?,?,?)",[req.session.userId,lang[0].id,skill.years,null], function (err,result){
                if(err) throw err;
                console.log(result);
            })

        });
    })
    Mentor.updateStatus(req.session.userId,0,(err,mentor)=>{

    })
    res.send();


})

