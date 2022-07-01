import { Jwt } from "jsonwebtoken";

export default function authMidWare(req, res, next) {

    const token = req.header("x-auth-token");

    if (!token) {
        return res.status(401).send("No token, authorization denied");
    }

    try {
        const decoded = Jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.user;
        next();
    } catch (err) {
        res.status(401).json({ msg: "Token is not valid" });
    }

}