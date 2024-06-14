import { NextFunction, Request, Response } from "express";
import ErrorHandler from "../utils/ErrorHandler";

export const ErrorMiddleware = (err:any,req:Request, res:Response, next:NextFunction) => {
    err.statusCode = err.statusCode || 500 ;
    err.message = err.message || 'internal server error';

    //wrong mongodb id error
    if (err.name === 'CastError') {
        const message = `resources not found , invalid ${err.path}`;
        err = new ErrorHandler(message,400);
    }

    //duplicate key error
    if (err.code === 11000) {
        const message = `Duplicate ${Object.keys(err.keyValue)} entered`;
        err = new ErrorHandler(message,400);
    }

    //wrong jwt error
    if (err.code === 'JsonWebTokenError') {
        const message = `Json web token invalid try again`;
        err = new ErrorHandler(message,400);
    }

    // jwt expired error
    if (err.code === 'TokenExpiredError') {
        const message = `Json web token expired try again`;
        err = new ErrorHandler(message,400);
    }

    res.status(err.statusCode).json({
        success:false,
        message:err.message
    })
}