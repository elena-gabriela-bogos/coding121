import express from 'express';
import path from 'path';
import User from "../domain/user";
import Mentor from "../domain/mentor";
//import {config} from 'dotenv'
import jwt from 'jsonwebtoken'
import Auth from "../domain/auth";
import Mentee from "../domain/mentee";
import {signupMenteeRouter} from "./signupMentee-router";

//import passport from 'passport';
const randomstring = require('randomstring');
const speakeasy = require("speakeasy");
const nodemailer = require("nodemailer");
const fs = require("fs");
const { promisify } = require("util");
const readFile = promisify(fs.readFile);
var ejs = require("ejs");

export const signupMentorRouter = express.Router()

signupMentorRouter.get('/', (req, res) => {
    if (req.session.loggedin) {
        Mentor.findById(req.session.userId, (err, mentor) => {
            if (mentor.length === 1) {
                res.redirect("/m/dashboard");
            } else {
                res.redirect("/u/dashboard");
            }
        });
    } else {
        res.render(path.resolve('public/views/signupMentor.ejs'), {en: req.session.lang});
    }
});

signupMentorRouter.post("/", async (req, res) => {
    const {name, username, password, repassword,phone} = req.body;
    if (name && username && password && repassword && phone.match(/^(\+4|)?(07[0-8]{1}[0-9]{1}|02[0-9]{2}|03[0-9]{2}){1}?(\s|\.|\-)?([0-9]{3}(\s|\.|\-|)){2}$/igm)) {
        if (password === repassword) {
            User.findByUsername(username, (err, user) => {
                if (err) {
                } else {
                    if (user.length !== 0) {
                        res.render(path.resolve('public/views/signupMentor.ejs'), {"message": "Email already used"});

                    }
                    else{
                        User.create(new User({name, "mail": username, phone, password}), (err, user) => {
                            Mentor.create(new Mentee({"id": user}), (err,mentor) => {
                                console.log("mentee: ", mentor)
                            });
                            res.redirect('/verifyEmail/send/' + user +'/' + username);
                        });
                    }
                }
            });
        } else {
            res.render(path.resolve('public/views/signupMentor.ejs'), {"message": "Passwords do not match"});
        }
    } else {
        res.render(path.resolve('public/views/signupMentor.ejs'), {"message": "Invalid datas"});

    }
});

signupMentorRouter.get('/:error',(req,res)=>{
    res.render(path.resolve('public/views/signupMentor.ejs'),{"message":"Email already used"});

})
