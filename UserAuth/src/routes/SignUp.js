import express from 'express';
import {body , validationResult} from 'express-validator';

const SingUpRouter = express.Router();

SingUpRouter.post('/users/signup',[
    body('email')
    .isEmail()
    .withMessage("Email is not valid"),
    body('password')
    .exists({ checkFalsy: true })
    .withMessage('Please enter password')
    .isString()
    .withMessage('Password should be string')
    .isLength({min: 8, max: 20})
    .withMessage('Password must be between 8 and 20 characters'),
    body('firstName')
    .exists({ checkFalsy: true })
    .withMessage("Please enter firstname")
    .isAlpha('sr-RS@latin')
    .withMessage('first name is not valid(only characters)'),
    body('lastName')
    .exists({ checkFalsy: true })
    .withMessage("Please enter lastname")
    .isAlpha('sr-RS@latin')
    .withMessage('first name is not valid(only characters)'),
    body('dateOfBirth')
    .exists({ checkFalsy: true })
    .withMessage("Please provide Date of Birth")
    .isDate()
    .withMessage("Date format must be: YYYY-MM-DD")
    .custom(value =>{
        let userDate = new Date(value);
        let todayDate = new Date();
        let nowYear = todayDate.getFullYear();
        let nowMonth = todayDate.getMonth();
        let nowDay = todayDate.getDate();
        let userAge = userDate.getFullYear();
        let userMonth = userDate.getMonth();
        let userDay = userDate.getDate();

        if(((nowYear-userAge) == 18 && (nowMonth-userMonth)<=0 &&(nowDay-userDay)<=0) || (nowYear-userAge)< 18){
            throw new Error("User must be 18 years or older");
        }
        return true;
    }),
    body('country')
    .isISO31661Alpha2()
    .withMessage('Please provide valid 2 letter ISO 3166-1 Country code'),
    body('city')
    .exists({ checkFalsy: true })
    .isAlpha('sr-RS@latin')
    .withMessage('City name is not valid(only characters)'),
    body('gender')
    .exists({checkFalsy: true})
    .withMessage('Please provide gender')
    .isIn(["Male", "Female", "Other"])
    .withMessage("Valid gender values: Male,Female,Other")
], (req, res) =>{
    const errors = validationResult(req);
    if (!errors.isEmpty()){
            return res.status(400).send(errors.array());
    }
 const {email, password, firstName, lastName, dateOfBirth, country, city, gender } = req.body;

 res.status(200).send('user created');
});

export {SingUpRouter};