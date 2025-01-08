import express from 'express';
import 'express-async-errors';
import bodyparser from 'body-parser';
import mongose from 'mongoose';
import {CurrentUserRouter} from './routes/CurrentUser.js';
import { LogInRouter } from './routes/LogIn.js';
import { LogOutRouter } from './routes/LogOut.js';
import { SingUpRouter } from './routes/SignUp.js';
import { ChangePasswordRouter } from './routes/ChangePassword.js';




const {json} = bodyparser;
const app = express();
app.use(json());


app.use(CurrentUserRouter);
app.use(LogInRouter);
app.use(LogOutRouter);
app.use(SingUpRouter);
app.use(ChangePasswordRouter);

app.all('*', (req, res) =>{
 res.status(404).send('Route not found');
});
const startApp = async() =>{
    try { 
        await mongose.connect('mongodb://userauth-mongo-srv:27017/userauth');
        console.log("Connected to Database");
         }
    catch (err){
        console.log(err);
    }
    app.listen(3000, ()=>{
 console.log("Server up and running on port 3000!");
});
};


startApp();
   