"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = require("../backend/entity/User");
const typeorm_1 = require("typeorm");
const bcrypt = require('bcryptjs');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const logger = require('../util/logger');
const authLogger = logger.getLogger('authLogger');
passport.serializeUser(function (user_id, done) {
    done(null, user_id);
});
passport.deserializeUser(function (user_id, done) {
    done(null, user_id);
});
exports.hashPassword = (password) => __awaiter(this, void 0, void 0, function* () {
    try {
        const salt = yield bcrypt.genSalt(10);
        return yield bcrypt.hash(password, salt);
    }
    catch (error) {
        authLogger.error(`An error occurred while hashing the password!`);
        throw new Error('Hashing failed: ' + error);
    }
});
exports.comparePasswords = (inputPassword, hashedPassword) => __awaiter(this, void 0, void 0, function* () {
    try {
        return yield bcrypt.compare(inputPassword, hashedPassword);
    }
    catch (error) {
        authLogger.error(`An error occurred while comparing the passwords!`);
        throw new Error('Comparing failed: ' + error);
    }
});
function authenticationMiddleware() {
    console.log('Before auth');
    return (req, res, next) => {
        if (req.isAuthenticated())
            return next();
        res.send('BAd'); //('/auth/', {errorMessage: 'You need to log in first.'});
    };
}
exports.authenticationMiddleware = authenticationMiddleware;
// TODO: Remove unnecessary logs
passport.use('local', new LocalStrategy((username, password, done) => __awaiter(this, void 0, void 0, function* () {
    try {
        const userRepository = typeorm_1.getRepository(User_1.User);
        const user = yield userRepository.find({
            where: { "_username": username }
        })
            .catch(e => {
            authLogger.error(`An error occured while searching for ${username}, ${e}`);
            return done(null, false);
        });
        // Does the user exist?
        if (user[0] === undefined) {
            authLogger.warn(`${username} was not found.`);
            return done(null, false, { message: 'User does not exist.' });
        }
        // Check if password is correct for this account
        const isValid = yield exports.comparePasswords(password, user[0]._password);
        if (!isValid) {
            authLogger.warn(`Login error incorrect password for ${username}.`);
            return done(null, false, { message: 'Incorrect Password' });
        }
        // Valid user and password
        return done(null, user);
    }
    catch (error) {
        return done(error, false);
    }
})));
//# sourceMappingURL=auth.js.map