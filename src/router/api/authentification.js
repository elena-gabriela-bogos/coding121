import Mentee from "../../domain/mentee";
import Admin from "../../domain/admin";
import Mentor from "../../domain/mentor";

export const checkAuth = (req, res, next) => {
    if (!req.session.loggedin) {
        res.redirect("/login");
    } else {
        next();
    }
}

export const checkMentee = (req, res, next) => {
    Mentee.findById(req.session.userId, (err, user) => {
        if (user.length === 0) {
            res.redirect("/login");
        } else {
            next();
        }
    });
}

export const checkAdmin = (req, res, next) => {
    Admin.findById(req.session.userId, (err, user) => {
        if (user.length === 0) {
            res.redirect("/login");
        } else {
            next();
        }
    });
}

export const checkMentor = (req, res, next) => {
    Mentor.findById(req.session.userId, (err, user) => {
        if (user.length === 0) {
            res.redirect("/login");
        } else {
            next();
        }
    });
}