const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const env = require('../config/env');
const userRepository = require('../repositories/user.repository');

const SALT_ROUNDS = 10;

function signToken(user) {
    return jwt.sign(
        { sub: user.id, role: user.role },
        env.jwt.secret,
        { expiresIn: env.jwt.expiresIn }
    );
}

async function register(req, res, next) {
    const { fullname, email, password, role } = req.body;

    if (!fullname || !email || !password || !role) {
        const err = new Error('fullname, email, password and role are required');
        err.statusCode = 400;
        return next(err);
    }

    if (!['client', 'agent'].includes(role)) {
        const err = new Error('role must be either "client" or "agent"');
        err.statusCode = 400;
        return next(err);
    }

    try {
        const passwordhash = await bcrypt.hash(password, SALT_ROUNDS);
        const user = await userRepository.createUser({ fullname, email, passwordhash, role });
        const token = signToken(user);
        res.status(201).json({ user, token });
    } catch (error) {
        if (error.code === '23505') {
            const err = new Error('This email is already registered');
            err.statusCode = 409;
            return next(err);
        }
        next(error);
    }
}

async function login(req, res, next) {
    const { email, password } = req.body;

    if (!email || !password) {
        const err = new Error('email and password are required');
        err.statusCode = 400;
        return next(err);
    }

    try {
        const user = await userRepository.findByEmail(email);
        if (!user) {
            const err = new Error('Invalid email or password');
            err.statusCode = 401;
            return next(err);
        }

        const passwordMatches = await bcrypt.compare(password, user.passwordhash);
        if (!passwordMatches) {
            const err = new Error('Invalid email or password');
            err.statusCode = 401;
            return next(err);
        }

        const token = signToken(user);
        const { passwordhash, ...safeUser } = user;
        res.status(200).json({ user: safeUser, token });
    } catch (error) {
        next(error);
    }
}

module.exports = { register, login };