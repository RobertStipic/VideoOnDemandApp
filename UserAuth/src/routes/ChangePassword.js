import express from 'express';
import { body, validationResult } from 'express-validator';
import { currentUser } from '@robstipic/middlewares';
import { userAuthorization } from '@robstipic/middlewares';
import { User } from '../../models/user.js';
import { PasswordEncription } from '../../services/passwordHash.js';
const ChangePasswordRouter = express.Router();

ChangePasswordRouter.patch('/users/changepassword',[
    body('password')
    .trim()
    .notEmpty()
    .withMessage('Please supply current password'),
    body('newPassword')
    .trim()
    .notEmpty()
    .withMessage('Please supply new password'),
    body('confirmNewPassword')
    .trim()
    .notEmpty()
    .withMessage('Please confirm new password')
], 
currentUser, userAuthorization, 
async (req, res) =>{
    const errors = validationResult(req);
    if (!errors.isEmpty()){
    return res.status(400).send(errors.array());
    }
    const {email} = req.currentUser;
    const{password, newPassword, confirmNewPassword} = req.body;
    if (password === newPassword){
        return res.status(400).send("New password is same as current password");
    }
    else if (newPassword === confirmNewPassword){
        const user = await User.findOne({email});
        const passwordsMatch = PasswordEncription.comparePassword(
            password, 
            user.password
        );
        if(!passwordsMatch){
            return res.status(400).send("Provided current password doesn't match user password");
        }
        const doc = await User.findOne({email: email});
        doc.password = newPassword;
        doc.save();
    }
    else {
        res.status(400).send("New passwords doesn't match");
    }
    res.status(200).send("Password succesfully changed");
});

export {ChangePasswordRouter};