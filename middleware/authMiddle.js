import { validateToken } from "../util/auth.js";

function checkAuthCookie(cookie){
    return (req, res, next) =>{
        const tokenCookieVal = req.cookies[cookie];
        res.locals.condition = false;
        if(!tokenCookieVal){
            return next();
        }
        try {
            const userPayload = validateToken(tokenCookieVal);
            req.user = userPayload;
            res.locals.condition = true;
        } catch (error) { res.locals.condition = false; }
        return next();
    }
}

export  default checkAuthCookie;