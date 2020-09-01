export const checkSession = (req, res, next) => {
    if (req.session.partnerId) {
        res.redirect("/session/session");
    } else {
        next();
    }
}