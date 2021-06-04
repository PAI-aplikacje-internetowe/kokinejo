const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');

const corsOptions = {
    origin: "http://localhost:8080",
    optionsSuccessStatus: 200 // legacy browser support
}

const indexRouter = require('./routes/index');
const signupRouter = require('./routes/signup');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(cors(corsOptions));

// static files from 'public' directory
app.use('/static', express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/signup', signupRouter);


app.use((req, res) => {
    res.status(404);
    res.json({
        "error": {
            "message": "Not found"
        }
    });
});

module.exports = app;
