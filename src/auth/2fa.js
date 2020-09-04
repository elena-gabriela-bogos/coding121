import auth from "../domain/auth";

const express = require("express");
const speakeasy = require("speakeasy");
const fetch = require("node-fetch");
import path from 'path';
import User from "../domain/user";
import Mentee from "../domain/mentee";
import Auth from "../domain/auth";
import Mentor from "../domain/mentor";
export const phoneRouter = express.Router();



// phoneRouter.get("/",((req, res) => {
//   res.render(path.resolve('public/views/phoneConfirmation.ejs'), {en:req.session.lang});
// }));


phoneRouter.get("/:id", async(req, res) => {
  await User.findById(req.params.id,(err,user)=>{
    if(err){
    }
    else {
      const secret = speakeasy.generateSecret({ length: 20 });
      const token = speakeasy.hotp({ secret: secret.base32, encoding: "base32" });

      Auth.phoneverified(user[0].id,token,false,(err,verified)=>{
        if(err){
          console.log(err);
        }
        else {
          //console.log(user[0].phone,token);
          const message = "Codul este:" + token;
          const fetch_url =
              "https://app.smso.ro/api/v1/send?to=4" +
              user[0].phone +
              "&sender=4&body=" +
              message +
              "&apiKey=mTr3xmoP3M9usuncicnqdD57DbxHlXWTpz4uePpz";
          fetch(fetch_url)
              .then((res) => res.json())
              .then((json) => console.log(json))
              .catch((err) => console.log(err.message));

          res.render(path.resolve('public/views/phoneConfirmation.ejs'), {en:req.session.lang});
        }
      });
    }
  });
});

phoneRouter.post("/validate-phone/:id", async(req, res) => {
  const {phone} = req.body;
  if(phone.match(/^(\+4|)?(07[0-8]{1}[0-9]{1}|02[0-9]{2}|03[0-9]{2}){1}?(\s|\.|\-)?([0-9]{3}(\s|\.|\-|)){2}$/igm)){
    await User.findById(req.params.id,(err,user)=>{
      if(err){
      }
      else {
        User.setPhone(req.params.id,phone,(err,user)=>{

        })
        const secret = speakeasy.generateSecret({ length: 20 });
        const token = speakeasy.hotp({ secret: secret.base32, encoding: "base32" });

        Auth.phoneverified(user[0].id,token,false,(err,verified)=>{
          if(err){
            console.log(err);
          }
          else {
            //console.log(user[0].phone,token);
            const message = "Codul este:" + token;
            const fetch_url =
                "https://app.smso.ro/api/v1/send?to=4" +
                phone +
                "&sender=4&body=" +
                message +
                "&apiKey=mTr3xmoP3M9usuncicnqdD57DbxHlXWTpz4uePpz";
            fetch(fetch_url)
                .then((res) => res.json())
                .then((json) => console.log(json))
                .catch((err) => console.log(err.message));

            res.render(path.resolve('public/views/phoneConfirmation.ejs'), {en:req.session.lang});
          }
        });
      }
    });
  }
  else {
    res.render(path.resolve('public/views/phoneConfirmation_social.ejs'), {"phoneMessage": "Invalid phone number","id":req.params.id});

  }
});


phoneRouter.post("/validate-secret", (req, res) => {
  Auth.findByPhoneToken(req.body.token,(err,auth)=>{
    if(err){
      res.render(path.resolve('public/views/phoneConfirmation.ejs'),{en:req.session.lang, "message" : "Token do not match"});
    }
    else {
      console.log(auth[0]);
      Auth.phoneverified(auth[0].id,'',true,()=>{

      });
      Auth.changeStatus(auth[0].id,true,()=>{

      });
      User.findById(auth[0].id, (err, user) => {
        if(err){
          send(err);

        }
        else {
          if (user.length === 1) {
            req.session.loggedin = true;
            req.session.username = user[0].mail;
            req.session.userId = user[0].id;
            req.session.name = user[0].name;
            Mentor.findById(user[0].id, (err, mentor) => {
              if (mentor.length === 1) {
                res.redirect("/m/dashboard");
              } else {
                res.redirect("/u/dashboard");
              }
            });
          }
        }
      });
    }
  });
});

