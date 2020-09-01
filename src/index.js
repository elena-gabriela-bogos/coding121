import express from "express"
import path from "path";
import bodyParser from "body-parser";
import {loginRouter} from "./router/login-router.js"
import {menteeDashboardRouter} from "./router/mentee/mentee-dashboard-router";
import cors from 'cors';
import session from 'express-session';
import {config} from 'dotenv';
import './passport'
import helmet from 'helmet';
import {userRouter} from "./router/api/user-router";
import {welcomePageRouter} from "./router/welcome-router";
import {menteeRouter} from "./router/api/mentee_router";
import {mentorRouter} from "./router/api/mentor_router";
import {mentorDashboardRouter} from "./router/mentor/mentor-dashboard-router";
import {logoutRouter} from "./router/logout-router";
import {requestApiRouter} from "./router/api/request-api-router";
import {socialAuthRouter} from "./auth/socialAuth";
import {signupMenteeRouter} from "./auth/signupMentee-router";
import {signupMentorRouter} from "./auth/signupMentor-router";
import {mailSentRouter} from "./auth/mailSent";
import {phoneRouter} from "./auth/2fa";
import {verifyEmail} from "./auth/verifyEmail";
import {searchRouter} from "./router/search-router";
import {sessionRouter} from "./router/session-router";
import {languagesFrameworksRouter} from "./router/api/languages-frameworks-router";


import http from "http";
import socketIO from "socket.io";
import sharedsession from "express-socket.io-session";
import {bindSocketChatEvents} from "./router/chat";
import {messageRouter} from "./router/api/message_router";
config();


const app = express();
const server = http.createServer(app);
const port = 3000;

const io = socketIO(server);
io.on('connection', function (socket) {
    const s = socket.handshake.session;
    socket.join(s.userId);

    bindSocketChatEvents(socket, io);
});

app.use(bodyParser.urlencoded({extended: true}))

app.use(bodyParser.json())

app.use(cors())
const sessionRef = session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false
});
app.use(sessionRef);

io.use(sharedsession(sessionRef, {
    autoSave: true
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
app.use('/signupMentee',signupMenteeRouter);
app.use('/signupMentor',signupMentorRouter);
app.use('/mailSent',mailSentRouter);
app.use('/phoneConfirmation',phoneRouter);
app.use('/verifyEmail',verifyEmail);
app.use('/search', searchRouter);
app.use('/m/history', sessionRouter);
app.use('/api/request', requestApiRouter);
app.use('/api/skills', languagesFrameworksRouter);
app.use('/api/message', messageRouter);
app.use('/socialAuth',socialAuthRouter);

app.use(express.static(path.join(__dirname,'../public')));
server.listen(port,()=>{
    console.log(`Example app listening at http://localhost:${port}`)
})