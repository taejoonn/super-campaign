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
const express_1 = require("express");
const typeorm_1 = require("typeorm");
const check_1 = require("express-validator/check");
const User_1 = require("../backend/entity/User");
const fs = require("fs");
const userManager = require("../util/userManagementSystem");
const authSystem = require("../config/auth");
const logger = require('../util/logger');
const middleware = require('../middleware');
let passwordValidator = require('password-validator');
const router = express_1.Router();
exports.adminRouter = router;
const adminLogger = logger.getLogger('adminLogger');
const passwordSchema = new passwordValidator();
passwordSchema
    .is().min(8) // Minimum length 8
    .is().max(100) // Maximum length 100
    .has().uppercase() // Must have uppercase letters
    .has().lowercase() // Must have lowercase letters
    .has().digits() // Must have digits
    .has().not().spaces() // Should not have spaces
    .is().not().oneOf(['Passw0rd', 'Password123',
    'Password', 'password', 'Qwert1!']);
/**
 * View and Edit Global Parameters
 */
router.get('/globals', middleware.isAdmin, (req, res) => __awaiter(this, void 0, void 0, function* () {
    let raw_gp = fs.readFileSync('src/globals.json');
    // @ts-ignore
    let global_params = JSON.parse(raw_gp);
    let taskLimit = global_params.taskTimeLimit;
    let avgSpeed = global_params.averageSpeed;
    res.render('edit-globals', { avgSpeed, taskLimit });
}));
// Can't be run when checking for changes in files. Will cause app to crash
// Needs to be run with 'npm start'
router.post('/globals', middleware.isAdmin, (req, res) => __awaiter(this, void 0, void 0, function* () {
    let taskLimit = req.body.global.taskLimit;
    let avgSpeed = req.body.global.avgSpeed;
    adminLogger.info(`${req.user[0]._username} changed globals. Avgspeed is now ${avgSpeed} and taskLimit is now ${taskLimit}`);
    let global_params = {
        taskTimeLimit: taskLimit,
        averageSpeed: avgSpeed
    };
    let data = JSON.stringify(global_params, null, 2);
    yield fs.writeFileSync('src/globals.json', data);
    res.status(200).redirect(req.get('referer'));
}));
/**
 * Create/Edit/Delete User
 */
router.get('/new', (req, res) => __awaiter(this, void 0, void 0, function* () {
    res.status(200).render('create-user', { message: "" });
}));
router.get('/home', middleware.isAdmin, (req, res) => __awaiter(this, void 0, void 0, function* () {
    let users = yield typeorm_1.getManager()
        .createQueryBuilder(User_1.User, "userscampaigns")
        .getMany();
    res.render('AdminHome', { users });
}));
router.post('/', [
    // Validation
    check_1.check('username').isLength({ min: 5, max: 20 }),
    check_1.check('password').isLength({ min: 5, max: 50 })
], (req, res) => __awaiter(this, void 0, void 0, function* () {
    const userRepository = typeorm_1.getRepository(User_1.User);
    const user = yield userRepository.find({ where: { "_username": req.body.user.username } })
        .catch(e => adminLogger.error(`Could not find user in ${req.body.user.username} in database, ${e}`));
    if (user.length > 0) {
        return res.render('create-user', { message: `${req.body.user.username} already exist` });
    }
    const validationErrors = yield check_1.validationResult(req);
    if (validationErrors.isEmpty()) {
        adminLogger.error(`Invalid Username or Password during registration`);
        return res.status(422).send('Username or Password is of an invalid length. Needs to be between 5-20 characters');
    }
    let newUser;
    let roledUser;
    /**
     * Create User from data in request from client.
     */
    req.body.user.password = yield authSystem.hashPassword(req.body.user.password);
    newUser = userManager.createBaseUser(req.body.user);
    /**
     * Create specialized user based off permission of user.
     */
    roledUser = userManager.createRoledUser(newUser.permission, newUser);
    /**
     * Save the new user into user table and table for
     * their specific role.
     */
    const entityManager = typeorm_1.getManager();
    yield entityManager.save(newUser)
        .then((newUser) => __awaiter(this, void 0, void 0, function* () {
        yield entityManager.save(roledUser);
        return newUser;
    }))
        .then((newUser) => adminLogger.info(`/user/new - Created user: ${newUser.username} with id: ${newUser.employeeID}. Has permission ${newUser.permission}.`))
        .catch(e => {
        adminLogger.error(`/user/new Error occured while creating ${newUser.username}, ${e}`);
    });
    res.render('create-user', { message: "" });
}));
router.get('/edit/:username', middleware.isAdmin, (req, res) => __awaiter(this, void 0, void 0, function* () {
    const userRepository = typeorm_1.getRepository(User_1.User);
    const username = req.params.username;
    const user = yield userRepository.find({ where: { "_username": username } })
        .catch(e => adminLogger.error(`Could not find user in ${username} in database, ${e}`));
    if (user[0] === undefined) {
        adminLogger.info(`/user/${username} - Could not find ${username}s profile`);
        res.status(404).render('view-user', {
            missing: username,
            username: "",
            name: "",
            role: "",
            id: 0
        });
    }
    else {
        adminLogger.info(`/user/${username} - ${req.user[0]._username} accessed ${username}s profile`);
        res.status(200).render('edit-user', {
            username,
            name: user[0]._name,
            role: user[0]._permission,
            id: user[0]._employeeID,
        });
    }
}));
router.get('/view/:username', middleware.isAdmin, (req, res) => __awaiter(this, void 0, void 0, function* () {
    const userRepository = typeorm_1.getRepository(User_1.User);
    const username = req.params.username;
    const user = yield userRepository.find({ where: { "_username": username } })
        .catch(e => adminLogger.error(`Could not find user in ${username} in database, ${e}`));
    if (user[0] === undefined) {
        adminLogger.info(`/user/${username} - Could not find ${username}s profile`);
        res.status(404).render('view-user', {
            missing: username,
            username: "",
            name: "",
            role: "",
            id: 0
        });
    }
    else {
        adminLogger.info(`/user/${username} - ${req.user[0]._username} accessed ${username}s profile`);
        res.status(200).render('view-user', {
            username,
            name: user[0]._name,
            role: user[0]._permission,
            id: user[0]._employeeID,
        });
    }
}));
router.post('/:username', middleware.isAdmin, (req, res) => __awaiter(this, void 0, void 0, function* () {
    let originalUsername = req.params.username;
    const userRepository = typeorm_1.getRepository(User_1.User);
    const unchangedUser = yield userRepository.find({ where: { "_username": req.params.username } })
        .catch(e => adminLogger.error(`Could not find user in ${username} in database, ${e}`));
    let user = req.body.user;
    let password = unchangedUser[0]._password;
    let name = user.name;
    let username = user.username;
    let role = user.role;
    /**
     * Update the user on the database
     */
    yield userRepository.query(`Update supercampaign.user 
        SET username = '${username}', fullname = '${name}', permission = '${role}', passwd = '${password}' 
        WHERE username = '${originalUsername}';`).catch(e => adminLogger.error(`Error occured while updating ${username} in database, ${e}`));
    /**
     * If role has changed, erase from orignal
     * role table and add to new
     */
    let id = unchangedUser[0]._employeeID;
    let originalRole = unchangedUser[0]._permission;
    if (role !== originalRole) {
        // Delete this user from old role table         
        userManager.deleteUserFromRole(unchangedUser[0]._permission, id);
        // Create new instance of roled user
        let updatedUser = userManager.createBaseUser(user);
        updatedUser.employeeID = id;
        let updatedRoledUser = userManager.createRoledUser(role, updatedUser);
        // Add this user to their new role table
        const entityManager = typeorm_1.getManager();
        yield entityManager
            .save(updatedRoledUser)
            .then(() => adminLogger.info(`/user/${originalUsername} - ${req.user[0]._username} edited ${originalUsername}`))
            .catch(e => adminLogger.error(`Error occured while updating role tables of${username} in database, ${e}`));
    }
    res.redirect('/home');
}));
router.delete('/:username', middleware.isAdmin, (req, res) => __awaiter(this, void 0, void 0, function* () {
    // EmployeeID is required to remove user from roled table
    const userRepository = typeorm_1.getRepository(User_1.User);
    const user = yield userRepository.find({ where: { "_username": req.params.username } })
        .catch(e => adminLogger.error(`Could not find ${req.params.username} in database, ${e}`));
    /**
     * Delete User from Specific Role Table
     * This record must be deleted first due
     * to foreign key constraing. THEN
     * Delete User from User table
     */
    yield userRepository
        .createQueryBuilder()
        .delete()
        .where("_employeeID = :ID", { ID: user[0].employeeID })
        .execute()
        .then(() => adminLogger.info(`/${req.params.username} ${req.user[0]._username} deleted ${user[0]._name}`));
    res.redirect('/home');
}));
//# sourceMappingURL=admin.js.map