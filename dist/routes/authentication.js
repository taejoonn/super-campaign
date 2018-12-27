"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const passport = require('passport');
const router = express_1.Router();
exports.authRouter = router;
const logger = require('../util/logger');
const authLogger = logger.getLogger('authLogger');
/**
 * GET and POST routes for Log In / Authentications
 */
router.get('/', (req, res) => {
    // res.render('login', {message: ""});
    res.render('login');
});
router.post('/', passport.authenticate('local', {
    successRedirect: '/home',
    failureRedirect: '/'
}));
// TODO: leave a better message on log
router.get('/logout', (req, res) => {
    if (req.user === undefined)
        return res.redirect('/');
    authLogger.info(`/logout - ${req.user[0]._username}`);
    req.logout();
    // @ts-ignore
    req.session.destroy();
    res.redirect('/');
});
router.get('/home', (req, res) => {
    authLogger.info(`/login -${req.user[0]._username}`);
    if (req.user[0]._permission === 1) {
        return res.redirect('/campaign/home');
    }
    else if (req.user[0]._permission === 2) {
        return res.redirect('/canvasser/home');
    }
    else {
        return res.redirect('/admin/home');
    }
});
//# sourceMappingURL=authentication.js.map