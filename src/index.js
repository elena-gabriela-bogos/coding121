import express from "express";
import path from "path";
import bodyParser from "body-parser";
import {loginRouter} from "./router/login-router.js"
import {menteeDashboardRouter} from "./router/mentee/mentee-dashboard-router";
import cors from 'cors';
import session from 'express-session';
import {config} from 'dotenv';
import {userRouter} from "./router/api/user-router";
import {welcomePageRouter} from "./router/welcome-router";
import {menteeRouter} from "./router/api/mentee_router";
import {mentorRouter} from "./router/api/mentor_router";
import {mentorDashboardRouter} from "./router/mentor/mentor-dashboard-router";
import {logoutRouter} from "./router/logout-router";
import {requestApiRouter} from "./router/api/request-api-router";
import {signupMenteeRouter} from "./auth/signupMentee-router";
import {signupMentorRouter} from "./auth/signupMentor-router";
import {mailSentRouter} from "./auth/mailSent";
import {searchRouter} from "./router/search-router";
import {suggestedRequestRouter} from "./router/suggested-request-router";

import {sessionRouter} from "./router/session-router";

import {languagesFrameworksRouter} from "./router/api/languages-frameworks-router";
import http from "http";
import socketIO from "socket.io";
import sharedsession from "express-socket.io-session";
import {bindSocketChatEvents} from "./router/chat";
import {messageRouter} from "./router/api/message_router";
import {bindSocketAudioVideoEvents} from "./router/audio-video";
import {bindSocketButtonEvents} from "./router/buttons";


const app = express();
const server = http.createServer(app);
const port = 3000;
config();

const io = socketIO(server);

io.on('connection', function (socket) {
    const s = socket.handshake.session;
    socket.join(s.userId);
    socket.userId = s.userId;

    bindSocketChatEvents(socket, io);
  
    socket.on('drawing', (data) => socket.broadcast.emit('drawing', data));


    bindSocketAudioVideoEvents(socket, io);
    bindSocketButtonEvents(socket, io);

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
app.use('/signupMentee', signupMenteeRouter);
app.use('/signupMentor', signupMentorRouter);
app.use('/mailSent', mailSentRouter);
app.use('/search', searchRouter);
app.use('/api/suggested_request', suggestedRequestRouter);

app.use('/m/history', sessionRouter);
app.use('/api/request', requestApiRouter);
app.use('/api/skills', languagesFrameworksRouter);
app.use('/api/message', messageRouter);
app.use('/session', sessionRouter);


app.use(express.static(path.join(__dirname, '../public')));

server.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
});

