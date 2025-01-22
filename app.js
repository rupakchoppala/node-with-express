import express from 'express';

import morgan from 'morgan';
import movieRouter from './Routes/moviesRoute.js';
import CustomError from './utils/custom error.js';
import GlobalErrorHandle from './Controllers/errorController.js';
import authRouter from './Routes/authRouter.js';
let app=express();



const logger=function(req,res,next){
    console.log("custom middle ware");
    next();
}
app.use(express.json());
if(process.env.NODE_ENV==='development'){
app.use(morgan('dev'));
}
app.use(express.static('./public'));
app.use(logger);
app.use((req,res,next)=>{
    req.requestedAt=new Date().toISOString();
    next();
})

app.use((req, res, next) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.setHeader('Surrogate-Control', 'no-store');
    next();
});

app.use('/api/v1/movies',movieRouter);
app.use('/v1/users',authRouter);
//defalut route 
app.all('*',(req,res,next)=>{
    // res.status(404).json({   
    //     status:fail,
    //     message:`can't find ${req.originalUrl} on the server`

    // // });
    // const err=new Error(`can't find ${req.originalUrl} on the server`);
    // err.status='fail';
    // err.statusCode=404;
    const err=new CustomError(`can't find ${req.originalUrl} on the server`,404);
    next(err);
})
//global error handling middle ware
//console.log(rupak);

app.use(GlobalErrorHandle)
export default app;
