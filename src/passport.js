import express from 'express';
import path from "path";
import passport from 'passport'
import { Strategy as JWTStrategy, ExtractJwt as ExtractJWT } from 'passport-jwt'
import { OAuth2Strategy as GoogleStrategy } from 'passport-google-oauth'
import User from './domain/user';
import Mentee from "./domain/mentee";
import Auth from "./domain/auth";
import Mentor from "./domain/mentor";

// get confidential credentials fron environment file
const { JWT_SECRET, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_CALLBACK_URL } = process.env
console.log(GOOGLE_CLIENT_ID);
// load Google Auth Strategy into the app
passport.use(
    "googleSignUpMentee",new GoogleStrategy(
    {
      clientID: "1033882064931-3sta80g9gt0gtt6hi6k3c3hrf3bdbng1.apps.googleusercontent.com",
      clientSecret: "8z-0uKtMa4MiilKRTjSM9cf-",
      callbackURL: "http://localhost:3000/socialAuth/callback/u",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
          const name = profile?.name || {};
          // check if user exists and get data about him
          await User.findByUsername(profile.emails[0].value,(err,user)=>{
              if(err){
                  done(null, false)
              }
              else{
                  if(user.length === 0)
                  {
                      const { givenName: firstName, familyName: lastName } = profile?.name || {}
                      User.create(new User({
                          "name": firstName + " " + lastName,
                          "mail": profile.emails[0].value,
                          "password": null,
                          "gid": profile.id,
                          "picture": profile?.photos[0]?.value,
                          "fid": null
                      }), (err, user) => {
                          //console.log("ce pula mea user",user)
                          Mentee.create(new Mentee({"id":user}),(err,mentee)=>{

                          })
                          Auth.create(new Auth({"id":user,"emailToken":null,"emailStatus":true}),(err,auth)=>{

                          })
                          return done(null, user)
                      });
                  }
                  else
                  {
                      User.update(new User({
                          'name': user[0].name,
                          "mail": user[0].mail,
                          "phone": user[0].phone,
                          "password": user[0].password,
                          "picture": profile?.photos[0]?.value,
                          "gid": profile.id,
                          "fid": user[0].fid
                      }), (err, res) => {
                          return done(null, user)

                      });
                      //console.log("user",user);

                      //res.render(path.resolve('public/views/login.ejs'), {"message": "Email already used"});
                  }
              }

          });

        // take id from user data
        //const { id } = user || {}

        // check if the user does not exists
        //if (!id) return done(null, false)

        // take specific element from user data object
        // const gid = profile.id
        // const picture = profile?.photos[0]?.value
        //const fieldsToUpdate = { gid, firstName, lastName, picture }

        // make sure that on the req.user object always exists a gid that is not null
        //user['gid'] = gid

        // return user data from database

      } catch (err) {
        done(err, false)
      }
    },
  )
)

passport.use(
    "googleSignUpMentor",new GoogleStrategy(
        {
            clientID: "1033882064931-3sta80g9gt0gtt6hi6k3c3hrf3bdbng1.apps.googleusercontent.com",
            clientSecret: "8z-0uKtMa4MiilKRTjSM9cf-",
            callbackURL: "http://localhost:3000/socialAuth/callback/m",
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                const name = profile?.name || {};
                // check if user exists and get data about him
                await User.findByUsername(profile.emails[0].value,(err,user)=>{
                    if(err){
                        done(null, false)
                    }
                    else{
                        if(user.length === 0)
                        {
                            const { givenName: firstName, familyName: lastName } = profile?.name || {}
                            User.create(new User({
                                "name": firstName + " " + lastName,
                                "mail": profile.emails[0].value,
                                "password": null,
                                "gid": profile.id,
                                "picture": profile?.photos[0]?.value,
                                "fid": null
                            }), (err, user) => {
                                //console.log("ce pula mea user",user)
                                Mentor.create(new Mentor({"id":user}),(err,mentor)=>{

                                })
                                Auth.create(new Auth({"id":user,"emailToken":null,"emailStatus":true}),(err,auth)=>{

                                })
                                return done(null, user)
                            });
                        }
                        else
                        {
                            const { givenName: firstName, familyName: lastName } = profile?.name || {}
                            User.update(new User({
                                "name": firstName + " " + lastName,
                                "mail": user[0].mail,
                                "phone": user[0].phone,
                                "password": user[0].password,
                                "picture": profile?.photos[0]?.value,
                                "gid": profile.id,
                                "fid": user[0].fid
                            }), (err, res) => {
                                return done(null, user)

                            });
                            //console.log("user",user);

                            //res.render(path.resolve('public/views/login.ejs'), {"message": "Email already used"});
                        }
                    }

                });
            } catch (err) {
                done(err, false)
            }
        },
    )
)

passport.use(
    "googleLogin",new GoogleStrategy(
        {
            clientID: "1033882064931-3sta80g9gt0gtt6hi6k3c3hrf3bdbng1.apps.googleusercontent.com",
            clientSecret: "8z-0uKtMa4MiilKRTjSM9cf-",
            callbackURL: "http://localhost:3000/login/callback",
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                const name = profile?.name || {};
                // check if user exists and get data about him
                await User.findByUsername(profile.emails[0].value,(err,user)=>{
                    if(err){
                        done(null, false)
                    }
                    else{
                        if(user.length === 0)
                        {
                            done(null, false)
                            // const { givenName: firstName, familyName: lastName } = profile?.name || {}
                            // User.create(new User({
                            //     "name": firstName + " " + lastName,
                            //     "mail": profile.emails[0].value,
                            //     "password": null,
                            //     "gid": profile.id,
                            //     "picture": profile?.photos[0]?.value,
                            //     "fid": null
                            // }), (err, user) => {
                            //     //console.log("ce pula mea user",user)
                            //     Mentor.create(new Mentee({"id":user}),(err,mentee)=>{
                            //
                            //     })
                            //     Auth.create(new Auth({"id":user,"emailToken":null,"emailStatus":true}),(err,auth)=>{
                            //
                            //     })
                            //     return done(null, user)
                            // });
                        }
                        else
                        {
                            const { givenName: firstName, familyName: lastName } = profile?.name || {}
                            User.update(new User({
                                "name": firstName + " " + lastName,
                                "mail": user[0].mail,
                                "phone": user[0].phone,
                                "password": user[0].password,
                                "picture": profile?.photos[0]?.value,
                                "gid": profile.id,
                                "fid": user[0].fid
                            }), (err, res) => {
                                return done(null, user)

                            });
                            //console.log("user",user);

                            //res.render(path.resolve('public/views/login.ejs'), {"message": "Email already used"});
                        }
                    }

                });
            } catch (err) {
                done(err, false)
            }
        },
    )
)


// load Passport JWT Verify Strategy into the app
passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      secretOrKey: "mW17KlyRxNd01ddd",
    },
    async (jwtPayload, done) => {
      try {
        // get user data by Google id from the database
          await User.findById(jwtPayload.id,(err,user)=>{
              if(err){
                  done(err,false);
              }
              else{
                  if(user.length === 0){
                      done(null,false);
                  }
                  else {
                      return done(null,user);
                  }
              }
          });
        // const user = await User.findOne({
        //   attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
        //   raw: true,
        //   where: { gid: jwtPayload.id },
        // })

        // return it in every protected route in the object req.user
        //return done(null, user)
      } catch (error) {
        done(error, false)
      }
    },
  ),
)
