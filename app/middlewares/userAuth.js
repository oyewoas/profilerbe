const jwt = require('jsonwebtoken');
const env = require('../../env');
const status = require('../helpers/statuses');
const messages = require('../helpers/messages');

/**
 * Auth middleware that checks if an authorization header exists in the request and if the token contained within is valid
 */

module.exports = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader)
            return res.status(401).json({
                status: status.unauthorized,
                message: messages.authorization.noHeader,
            });

        const token = authHeader.split(' ')[1];

        const tokenData = jwt.verify(token, env.secret);

        req.user = tokenData.id;

        next();
    } catch (err) {
        return res.status(401).json({
            status: status.unauthorized,
            message: messages.authorization.noAuth,
        });
    }
};