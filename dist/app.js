"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
/**
 * Import Libraries
 */
const express = require("express");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const expressValidator = require("express-validator");
// import * as flash from 'connect-flash';
var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);
var passport = require('passport');
const logger = require('./util/logger');
const appLogger = logger.getLogger('appLogger');
/**
 * Import Route Handlers
 */
const admin_1 = require("./routes/admin");
const authentication_1 = require("./routes/authentication");
const campaign_1 = require("./routes/campaign");
const manager_1 = require("./routes/manager");
const canvasser_1 = require("./routes/canvasser");
const app = express();
/**
 * Configurations
 */
app.set('trust proxy', true);
app.set('port', process.env.PORT || 8080);
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(expressValidator()); // This MUST come after bodyParser.
app.use(methodOverride('_method'));
const options = {
    host: '35.245.70.68',
    port: 3306,
    user: 'root',
    password: '',
    database: 'supercampaign'
};
const sessionStore = new MySQLStore(options);
app.use(session({
    secret: 'my super secret, secret, is a secret?',
    store: sessionStore,
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use((req, res, next) => {
    res.locals.isAuthenticated = req.isAuthenticated();
    next();
});
/**
 * Use route handlers
 */
app.use('/user', admin_1.adminRouter);
app.use('/admin', admin_1.adminRouter);
app.use('/global', admin_1.adminRouter);
app.use('/campaign', campaign_1.campaignRouter);
app.use('/manager', manager_1.managerRouter);
app.use('/canvasser', canvasser_1.canvasserRouter);
app.use('/', authentication_1.authRouter);
appLogger.info('Starting Application');
exports.default = app;
//# sourceMappingURL=app.js.map