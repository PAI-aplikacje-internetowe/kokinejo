const express = require('express');
const path = require('path');
const logger = require('morgan');
const cors = require('cors');
const debug = require('debug')('backend:app');

const corsOptions = {
    origin: 'http://localhost:8080',
    optionsSuccessStatus: 200 // legacy browser support
}

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const BasicStrategy = require('passport-http').BasicStrategy;
const BearerStrategy = require('passport-http-bearer').Strategy;
const userRepository = require('./repositories/user');

const gameUtilsFactory = require('./games/gameUtils');
const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');

const kikGame = require('./games/kik');
const kikUtils = gameUtilsFactory('tic-tac-toe');

const app = express();
app.disable('x-powered-by');

// disable logging during tests
app.use(logger('dev', { skip: () =>
  typeof global.it === 'function'
}));
app.use(express.urlencoded({extended: false}));

app.use(cors(corsOptions));

// login stuff...
app.use(passport.initialize());
passport.use(new LocalStrategy(
  {
    usernameField: 'name',
  },
  userRepository.check
));
passport.use(new BasicStrategy(userRepository.check));
passport.use(new BearerStrategy(userRepository.checkToken));

app.use('/', indexRouter);
app.use('/auth', authRouter);

// everything else requires authentication using one of the following:
// - Header: Authorization: bearer <token>
// - HTTP basic auth scheme
const requireAuth = passport.authenticate(['basic', 'bearer'], {
  session: false,
  failWithError: true,
});

// games routing
app.use('/kik', requireAuth, express.json(), kikGame);

app.init = () => {
  // games initialization
  kikUtils.init();
}

app.use((req, res, next) => {
  next({
    status: 404,
    message: 'Not Found',
  });
});

// always eeturn json
app.use((err, req, res, next) => {
  // respect err.statusCode
  if (err.statusCode) {
    res.statusCode = err.statusCode;
  }
  // respect err.status
  if (err.status) {
    res.statusCode = err.status;
  }
  // default status code to 500
  if (res.statusCode < 400) {
    res.statusCode = 500;
  }

  // "log" the error
  debug(err);
  // cannot actually respond
  if (res._header) {
    return next();
  }

  res
    .json({
      error: err.message
    });
});

module.exports = app;
