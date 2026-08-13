const userRepository = require('../repositories/user.repository');

async function getMe(req, res, next) {
    try {
        const user = await userRepository.findById(req.user.id);
        if (!user) {
            const err = new Error('User not found');
            err.statusCode = 404;
            return next(err);
        }
        res.status(200).json({ user });
    } catch (error) {
        next(error);
    }
}

module.exports = { getMe };