import express from 'express';
import bodyparser from 'body-parser';
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


app.listen(3000, ()=>{
 console.log("Server up and running on port 3000!");
});

   