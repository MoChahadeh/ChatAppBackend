import jwt from 'jsonwebtoken';


export default function authMidWare(req, res, next) {

    const token = req.header("x-auth-token");

    if (!token) {
        return res.status(401).send("No token, authorization denied");
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        req.user = decoded._id;
        next();
    } catch (err) {
        res.status(401).json({ msg: "Token is not valid" });
    }

}