import express from "express";
import path from "path";
import bodyParser from "body-parser";
import {loginRouter} from "./router/login-router.js"
import {dashboardRouter} from "./router/dashboard-router";
import cors from 'cors';
import session from 'express-session';
import {userRouter} from "./router/user-router";

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({extended: true}))

app.use(bodyParser.json())

app.use(cors())

app.use(express.static(path.join(__dirname, '../public')));

app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false
}));

app.set('view engine', 'ejs');

app.use('/login', loginRouter);
app.use('/u/dashboard', dashboardRouter);
app.use('/api/user', userRouter);

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
});