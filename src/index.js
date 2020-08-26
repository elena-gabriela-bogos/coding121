import express from "express";
import path from "path";
import bodyParser from "body-parser";
import {loginRouter} from "./router/login-router.js"
import {menteeDashboardRouter} from "./router/mentee/mentee-dashboard-router";
import cors from 'cors';
import session from 'express-session';
import {config} from 'dotenv';
import {userRouter} from "./router/user-router";
import {welcomePageRouter} from "./router/welcome-router";
import {menteeRouter} from "./router/mentee/mentee_router";
import {mentorRouter} from "./router/mentor/mentor_router";
import {mentorDashboardRouter} from "./router/mentor/mentor-dashboard-router";
import {logoutRouter} from "./router/logout-router";
import {requestRouter} from "./router/request-router";
import {signupMenteeRouter} from "./auth/signupMentee-router";
import {signupMentorRouter} from "./auth/signupMentor-router";
import {mailSentRouter} from "./auth/mailSent";
import {searchRouter} from "./router/search-router";

const app = express();
const port = 3000;
config();

app.use(bodyParser.urlencoded({extended: true}))

app.use(bodyParser.json())

app.use(cors())

app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false
}));

app.set('view engine', 'ejs');

app.use("/", welcomePageRouter);
app.use('/login', loginRouter);
app.use('/logout', logoutRouter);
app.use('/u/dashboard', menteeDashboardRouter);
app.use('/m/dashboard', mentorDashboardRouter);
app.use('/api/user', userRouter);
app.use('/api/mentee', menteeRouter);
app.use('/api/mentor', mentorRouter);
app.use('/api/request', requestRouter);
app.use('/signupMentee',signupMenteeRouter);
app.use('/signupMentor',signupMentorRouter);
app.use('/mailSent',mailSentRouter);
app.use('/search', searchRouter);

app.use(express.static(path.join(__dirname, '../public')));

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
});

