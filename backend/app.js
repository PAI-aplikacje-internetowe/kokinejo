const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');

const corsOptions = {
    origin: "http://localhost:8080",
    optionsSuccessStatus: 200 // legacy browser support
}

const gameUtilsFactory = require('./games/gameUtils');
const indexRouter = require('./routes/index');
const signupRouter = require('./routes/signup');

const kikGame = require('./games/kik');
const kikUtils = gameUtilsFactory('tic-tac-toe');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());

app.use(cors(corsOptions));

// static files from 'public' directory
app.use('/static', express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/signup', signupRouter);

// games routing
app.use('/kik', kikGame);

// games initialization
kikUtils.init();

app.use((req, res) => {
    res.status(404);
    res.json({
        status: "error",
        error: "Not found"
    });
});

module.exports = app;
