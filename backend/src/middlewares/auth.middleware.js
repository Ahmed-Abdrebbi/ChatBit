
const jwt = require('jsonwebtoken');
const env = require('../config/env');

function authenticate(req, res, next) {
    const header = req.headers.authorization;

    if (!header || !header.startsWith('Bearer ')) {
        const err = new Error('Missing or malformed Authorization header');
        err.statusCode = 401;
        return next(err);
    }

    const token = header.slice('Bearer '.length);

    try {
        const payload = jwt.verify(token, env.jwt.secret);
        req.user = { id: payload.sub, role: payload.role };
        next();
    } catch (error) {
        const err = new Error('Invalid or expired token');
        err.statusCode = 401;
        next(err);
    }
}

module.exports = authenticate;