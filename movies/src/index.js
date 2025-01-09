import express from 'express';
import 'express-async-errors';
import bodyparser from 'body-parser';
import mongose from 'mongoose';
import cookieSession from 'cookie-session';




const {json} = bodyparser;
const app = express();
app.set('trust proxy',true); //ingress-nginx uses proxies
app.use(json());
app.use(cookieSession({
    signed:false,
    secure: true
})
);

app.all('*', (req, res) =>{
 res.status(404).send('Route not found');
});
const startApp = async() =>{

    if(!process.env.JWT_PRIVATE_KEY){
        throw new Error('JWT_PRIVATE_KEY must be defined');
    }
    if(!process.env.DATABASE_URL){
        throw new Error('DATABASE_URL must be defined');
    }
    try { 
        await mongose.connect(process.env.DATABASE_URL);
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
   