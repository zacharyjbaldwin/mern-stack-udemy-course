const { v4: uuidv4 } = require('uuid');
const { validationResult } = require('express-validator');
const HttpError = require('../models/http-error.model');

const DUMMY_USERS = [
    {
        id: 'u1',
        name: 'Zachary Baldwin',
        email: 'zacharyjbaldwin@gmail.com',
        password: 'password123'
    }
];

module.exports.getUsers = (req, res, next) => {
    res.status(200).json({ users: DUMMY_USERS });
};

module.exports.signUp = (req, res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors);
        return next(new HttpError('Bad request.', 400));
    }


    const { name, email, password } = req.body;

    if (DUMMY_USERS.find(u => u.email === email)) {
        return next(new HttpError('Email is already in use.', 422));
    }

    const createdUser = {
        id: uuidv4(),
        name: name,
        email: email,
        password: password
    };

    DUMMY_USERS.push(createdUser);

    res.status(201).json({ user: createdUser });
};

module.exports.login = (req, res, next) => {
    const { email, password } = req.body;

    const identifiedUser = DUMMY_USERS.find(u => u.email === email);
    if (!identifiedUser || identifiedUser.password !== password) {
        return next(new HttpError('Could not idenfity user. Credentials may be wrong.', 401));
    }

    res.json({ message: 'Logged in.' });


};