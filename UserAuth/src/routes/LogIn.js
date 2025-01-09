import express from 'express';
import { body, validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import { User } from '../../models/user.js';
import { PasswordEncription } from '../../services/passwordHash.js';

const LogInRouter = express.Router();

LogInRouter.post('/users/login',[
    body('email')
    .isEmail()
    .withMessage('Email must be valid'),
    body('password')
    .trim()
    .notEmpty()
    .withMessage('Please supply password')
], 
async (req, res) =>{
    const errors = validationResult(req);
    if (!errors.isEmpty()){
    return res.status(400).send(errors.array());
    }
const {email, password} = req.body;

const existingEmail = await User.findOne({email});
if (!existingEmail){
    return res.status(404).send("Provided information doesn't match any record");
}

const passwordsMatch = PasswordEncription.comparePassword(
    password, 
    existingEmail.password
);

if(!passwordsMatch){
    return res.status(404).send("Provided information doesn't match any record");
}
    const userJwt = jwt.sign({
        id: existingEmail.id,
        email: existingEmail.email,
        subscription: existingEmail.isSubscribed
    }, process.env.JWT_PRIVATE_KEY);
    //process.env.JWT_PRIVATE_KEY is saved in secret inside kubernetes cluster
    req.session.jwt = userJwt;
res.status(200).send(existingEmail);

});

export {LogInRouter};