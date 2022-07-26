import express from 'express';
import {User} from '../db.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

router.get("/:token", async (req, res) => {

    if(!req.params.token) return res.status(400).send("No token was passed");

    let tokenObj;

    try{
        tokenObj = jwt.verify(req.params.token, process.env.JWT_KEY);
    } catch {
        return res.status(400).send("Invalid token");
    }

    const user = await User.findById(tokenObj._id);

    if(!user) return res.status(400).send("User not found, invalid token");

    if(user.verified) return res.status(400).send("User already verified");


    try {
        await user.update({verified: true});
        return res.status(200).send("User verified");
    } catch(err) {
        return res.status(400).send("Error verifying user: " + err.message);
    }


});

export default router;