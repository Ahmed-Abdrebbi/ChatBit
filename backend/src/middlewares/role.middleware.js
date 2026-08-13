
function requireRole(...allowedRoles) {
    return function roleGuard(req, res, next) {
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            const err = new Error('Forbidden: insufficient role');
            err.statusCode = 403;
            return next(err);
        }
        next();
    };
}

module.exports = requireRole;