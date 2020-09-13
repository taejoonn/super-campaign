import "reflect-metadata";

/**
 * Import Libraries
 */
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as methodOverride from 'method-override'
import * as expressValidator from 'express-validator';
// import * as flash from 'connect-flash';
var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);
var passport = require('passport');
const logger = require('./util/logger');
const appLogger = logger.getLogger('appLogger');


/**
 * Import Route Handlers
 */
import { adminRouter } from './routes/admin';
import { authRouter } from './routes/authentication';
import { campaignRouter } from './routes/campaign';
import { managerRouter } from './routes/manager';
import { canvasserRouter } from './routes/canvasser';

const fs = require('fs');
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
app.use(expressValidator());    // This MUST come after bodyParser.
app.use(methodOverride('_method'));

const options = {
  host: '34.86.118.99',
  port: 3306,
  user: 'root',
  password: '',
  database: 'super',
};
const sessionStore = new MySQLStore(options);
app.use(session({
  secret: 'my super secret, secret, is a secret?',
  store: sessionStore,
  resave: false,
  saveUninitialized: false
}))
app.use(passport.initialize());
app.use(passport.session());
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.isAuthenticated();
  next();
});

/**
 * Use route handlers
 */
app.use('/user', adminRouter);
app.use('/admin', adminRouter);
app.use('/global', adminRouter);
app.use('/campaign', campaignRouter);
app.use('/manager', managerRouter);
app.use('/canvasser', canvasserRouter)
app.use('/', authRouter);

appLogger.info('Starting Application');
export default app;
