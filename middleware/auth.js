import jwt from 'jsonwebtoken';
import { User } from '../db';

export default async function authMidWare(req, res, next) {

    const token = req.header("x-auth-token");

    if (!token) {
        return res.status(409).send("No token, authentication denied");
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_KEY);

        if(!decoded.dateCreated) return res.status(409).send("Token expired");
        if(decoded.dateCreated < Date.now() - (process.env.JWT_EXPIRATION_HOURS * 60 * 60 * 1000)) return res.status(409).send("Token expired");

        const user = await User.findById(decoded._id)

        if(!user) return res.status(409).send("Invalid Token");

        req.user = user._doc;

        next();
    } catch (err) {
        return res.status(409).send("Invalid Token: "+ err.message);
    }

}