import express from 'express';
import 'express-async-errors';
import bodyparser from 'body-parser';
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
    app.listen(3000, ()=>{
 console.log("Server up and running on port 3000!");
});

};

startApp();
   
