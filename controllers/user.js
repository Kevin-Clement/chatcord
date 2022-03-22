const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config();
const maxAge = 24 * 60 * 60

exports.signUp = (req, res, next) => {
    const { username = "", password = "" } = req.body;
    bcrypt.hash(password, 10)
        .then(hash => {
            const user = new User({
                username: username,
                password: hash
            })
            user.save()
                .then(() => res.status(201).json({
                    message: "Created user"
                }))
                .catch(err => res.status(400).json(err))
        })
        .catch(err => res.status(500).json(err))
};

exports.login = async (req, res, next) => {
    const { username = "", password = "" } = req.body;
    const expiresIn = 3600;

    const token = jwt.sign(
        { username: username },
        process.env.SECRET,
    );

    User.findOne({ username: username})
    .then(user => {
        if(!user){
            return res.status(401).json({
                error: "User not found"
            })
        }
        let _id = user._id
        bcrypt.compare(password, user.password)
            .then(valid => {
                if(!valid) {
                    return res.status(401).json({
                        error: "Invalid password"
                    })
                }
                res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 })
                res.status(200).json({
                    token,
                    _id,
                    username,
                    expiresIn
                })
            }).catch(err => res.status(500).json({
                err
            }))
        })
        .catch(err => res.status(500).json({
            err
        }))
};

exports.getAllUser = (req, res, next) => {
    User.find()
    .then(users => res.status(200).json(users))
    .catch(err => res.status(404).json(err))
}

