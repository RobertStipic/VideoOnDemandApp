import express from 'express';
import { body, validationResult } from 'express-validator';
import { User } from '../../models/user.js';
import { PasswordEncription } from '../../services/passwordHash.js';
import bcrypt from 'bcrypt';
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
    return res.status(404).send("Provided information doesn't match any record, Email");
}

const passwordsMatch = PasswordEncription.comparePassword(
    password, 
    existingEmail.password
);

if(!passwordsMatch){
    return res.status(404).send("Provided information doesn't match any record");
}

res.status(400).send('User logged in');

});

export {LogInRouter};