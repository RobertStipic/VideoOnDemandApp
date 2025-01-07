import express from 'express';


const CurrentUserRouter = express.Router();

CurrentUserRouter.get('/users/currentuser', (req, res) =>{
res.send('ngnix-test');
});

export {CurrentUserRouter};