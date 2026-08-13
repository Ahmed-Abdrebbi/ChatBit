module.exports = function requireRole(role) {
    return (req, res, next) => {
        next();
    };
};
