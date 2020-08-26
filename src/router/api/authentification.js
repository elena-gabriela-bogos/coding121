import path from "path";

export const checkAuth = (req, res, next) => {
    if (!req.session.loggedin) {
        res.render(path.resolve('public/views/login.ejs'));
    } else {
        next();
    }
}