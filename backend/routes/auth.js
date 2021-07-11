const express = require('express');
const router = express.Router();
const passport = require('passport');
const debug = require('debug')('backend:auth');

const db = require('../db');
const userRepository = require('../repositories/user');

const passport_options = {
  failWithError: true,
  session: false,
};
// ugly hack, but passport-local is not flexible at all...
const passport_local_middleware = (req, res, next) => {
  passport.authenticate('local', passport_options, (err, user, info, status) => {
    if (err) return next(err);
    if (!user) return res.sendStatus(401);
    req.user = user;
    return next();
  })(req, res, next);
};

router.post('/signup',
  express.json(),
  (req, res) => {
    if (!req.body.name) {
      return res.status(400).json({
        error: 'No nick specified',
      });
    }
    if (!req.body.password) {
      return res.status(400).json({
        error: 'No password specified',
      });
    }
    userRepository.create(
      req.body.name,
      req.body.password,
    )
      .then((user) =>
        userRepository.newToken(user.id)
      )
      .then((token) =>
        res.json({ token })
      )
      .catch((error) =>
        res.status(400).json({ error })
      );
  }
);

router.get('/token',
  passport.authenticate('basic', passport_options),
  (req, res) =>
    userRepository.newToken(req.user.id)
      .then((token) =>
        res.json({ token })
      )
      .catch((error) =>
        res.status(500).json({ error })
  ),
);
router.post('/token',
  express.json(),
  passport_local_middleware,
  (req, res) =>
    userRepository.newToken(req.user.id)
      .then((token) =>
        res.json({ token })
      )
      .catch((error) =>
        res.status(500).json({ error })
  ),
);

router.get('/logout',
  passport.authenticate(['bearer'], passport_options),
  (req, res) => {
    const authorization = req.header('Authorization');
    const token = authorization.substring(authorization.indexOf(' ') + 1);
    userRepository.removeToken(token)
      .then(() =>
        res.json({ status: "ok" })
      )
      .catch((error) =>
        res.status(500).json({ error })
      );
  },
);

router.get('/me',
  passport.authenticate(['basic', 'bearer'], passport_options),
  (req, res) => res.json({
    name: req.user.name,
    id: req.user.id,
  }),
);
router.post('/me',
  passport_local_middleware,
  (req, res) => res.json({
    name: req.user.name,
    id: req.user.id,
  }),
);

module.exports = router;
