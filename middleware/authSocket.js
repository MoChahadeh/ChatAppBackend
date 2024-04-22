import jwt from 'jsonwebtoken';
import { User } from '../db.js';

export default async function socketAuthMidware(socket, next) {

    const token = socket.handshake.auth["token"];

    if (!token) {
        return next(new Error("No token, authentication denied"))
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_KEY);

        if (!decoded.dateCreated) return next(new Error("Token expired"))
        if (decoded.dateCreated < Date.now() - (process.env.JWT_EXPIRATION_HOURS * 60 * 60 * 1000)) return next(new Error("Token expired"));

        const user = await User.findById(decoded._id)

        if(!user) next(new Error("Invalid Token"));

        socket.user = user._doc;

        next();
    } catch (err) {
        return next(new Error("Invalid Token: "+ err.message))
    }

}