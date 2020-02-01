const UsersModel = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const env = require('../../env');
const status = require('../helpers/statuses');
const messages = require('../helpers/messages');
const errorCodes = require('../helpers/errorCodes');
const uploadImg = require('../middlewares/uploadImg')

const uploadImage = async (req, res) => {
    console.log('req.file:', req.file)
    try{
        const response = await uploadImg.cloudinary.v2.uploader.upload(req.file.path);
        res.status(200).json({
            status: status.ok,
            message: messages.signUp.success,
            imageUrl: response.url
        });
    } catch(err){
        res.status(500).json({
            status: status.error,
            message:'Error uploading image'
        });
    }
   
    
}

  
const signUpUser = async (req, res) => {
    try {
        const profImg = await uploadImg.cloudinary.v2.uploader.upload(req.file.path);
        req.body.profileImg = profImg.url
        req.body.password = await bcrypt.hash(req.body.password, 10);
        const user = await UsersModel.create(req.body);
        const response = user.toJSON();
        delete response.password;

        const token = jwt.sign({
            id: user.id
        }, env.secret, {
            expiresIn: '1h'
        });
        res.status(200).json({
            status: status.ok,
            message: messages.signUp.success,
            data: {
                user: response,
                token
            }
        });
    } catch (err) {
        if (err.code === errorCodes.duplicateCode) {
            res.status(409).json({
                status: status.conflict,
                message: messages.signUp.duplicateEmail
            });
        } else {
            console.log(err.message, 'error')
            res.status(500).json({
                status: status.error,
                message: messages.signUp.error
            });
        }

    }
};


const signInUser = async (req, res) => {
    try {
        const user = await UsersModel.findOne({
                email: req.body.email
            },
            '+password'
        );

        if (!user)
            return res
                .status(404)
                .json({
                    status: status.notfound,
                    message: messages.signIn.notfound
                });

        const isPasswordValid = await bcrypt.compare(
            req.body.password,
            user.password
        );

        if (!isPasswordValid)
            return res
                .status(401)
                .json({
                    status: status.unauthorized,
                    message: messages.signIn.invalid
                });

        const token = jwt.sign({
            id: user.id
        }, env.secret);
        res.json({
            status: status.ok,
            message: messages.signIn.success,
            data: {
                token
            }
        });
    } catch (err) {
        res.status(500).json({
            status: status.error,
            message: messages.signIn.error
        });
    }
};

const userProfile = async function (req, res) {
    try {
        const user = await UsersModel.findById(req.user);

        res.json({
            status: 'success',
            data: user
        });
    } catch (err) {
        console.log(err);

        res.status(401).json({
            status: 'error',
            message: err.message
        });
    }
};

const editProfile = async (req, res) => {
    try {
        const userId = req.params.userId
        const user = await UsersModel.findById(userId);

        res.json({
            status: 'success',
            data: user
        });
    } catch (err) {
        console.log(err);

        res.status(401).json({
            status: 'error',
            message: err.message
        });
    }
};


const updateProfile = async (req, res) => {
    try {
        const userId = req.params.userId
        let user = await UsersModel.findById(userId);
        if (!user) {
            res.json({
                status: 'Not Found',
                message: 'User Not Found'
            })
        } else {
            const {
                profileImg,
                phone_number,
                address,
                date_of_birth,
                security_question,
                answer,
            } = req.body
            user.profileImg = profileImg
            user.phone_number = phone_number
            user.address = address
            user.date_of_birth = date_of_birth
            user.security_question = security_question
            user.answer = answer
            user.save();
        }
        res.json({
            status: 'success',
            data: user
        });
    } catch (err) {
        console.log(err, 'update error');

        res.status(401).json({
            status: 'error',
            message: err.message
        });
    }
};

module.exports = {
    signUpUser,
    signInUser,
    userProfile,
    editProfile,
    updateProfile,
    uploadImage
};