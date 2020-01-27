const UsersModel = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const env = require('../../env');
const status = require('../helpers/statuses');
const messages = require('../helpers/messages');
const errorCodes = require('../helpers/errorCodes');

const signUpUser = async (req, res) => {
    try {
        req.body.password = await bcrypt.hash(req.body.password, 10);
        const user = await UsersModel.create(req.body);
        const response = user.toJSON();

        delete response.password;

        const token = jwt.sign({ id: user.id }, env.secret, { expiresIn: '1h' });
        res.status(200).json({
            status: status.ok,
            message: messages.signUp.success,
            data: { user: response, token }
        });
    } catch (err) {
        console.log(err.code);
        if (err.code === errorCodes.duplicateCode){
            res.status(409).json({
                status: status.conflict,
                message: messages.signUp.duplicateEmail
            });
        } else {
            res.status(500).json({
                status: status.error,
                message: messages.signUp.error
            });
        }

    }
};


const signInUser = async (req, res) => {
    try {
        const user = await UsersModel.findOne(
            { email: req.body.email },
            '+password'
        );

        if (!user)
            return res
                .status(404)
                .json({ status: status.notfound, message: messages.signIn.notfound });

        const isPasswordValid = await bcrypt.compare(
            req.body.password,
            user.password
        );

        if (!isPasswordValid)
            return res
                .status(401)
                .json({ status: status.unauthorized, message: messages.signIn.invalid });

        const token = jwt.sign({ id: user.id }, env.secret);
        res.json({status: status.ok, message: messages.signIn.success, data: { token }});
    } catch (err) {
        res.status(500).json({ status: status.error, message: messages.signIn.error });
    }
};


module.exports = {
    signUpUser,
    signInUser
};