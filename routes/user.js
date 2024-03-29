import express from 'express';
import Joi from 'joi';
import bcrypt from 'bcrypt';
import authMidWare from '../middleware/auth.js';
import {User, Conversation} from "../db.js";
import {validateEmail ,validatePass} from "../validators.js";
import emailSender from "../emailsender.js";

const router = express.Router();

router.get("/me", authMidWare, async (req, res) => {

    try {
        const user = await User.findOne({_id: req.user._id}).select(["-password"]);
        if(!user) throw new Error("User not found");

        const convos = await user.getConvos();

        res.status(200).send({...user._doc, convos});
    } catch(err) {
        console.log(err);
        res.status(400).send(err);
    }

})

router.post("/signup", async (req, res) => {

    if(!validateEmail(req.body.email)) return res.status(400).send("Enter a valid email");
    if(!validatePass(req.body.password)) return res.status(400).send("Password must be at least 8 characters");

    const user = await User.findOne({email: req.body.email});
    if(user) return res.status(400).send("Email already in use");

    const hash = await bcrypt.hash(req.body.password, await bcrypt.genSalt(10));

    const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: hash,
        isAdmin: false,
        verified: false
    });

    try {
        await newUser.save();

        const verificationToken = newUser.generateVerificationToken();

        await emailSender.sendVerification(newUser.email, verificationToken);

        res.status(200).send("Verification Email was sent, please verify your email then log in");
    } catch(err) {
        res.status(400).send(err.message);
    }

})

router.get("/search", authMidWare, async (req, res) => {

    let users;

    if(req.query.email && req.query.email.length > 0) {
        users = await User.find(
            {$and: [
                {email: {$regex: req.query.email, $options: "i"}},
                {email: {$not: {$eq: req.body.email}}},
                {activated: true}
            ]}
        ).select(["_id","email", "name"]);
    } else {
        users = await User.find().select(["_id","email", "name"]);
    }
    
    if(!users) return res.status(404).send("No users found");

    res.status(200).send(users.filter(obj => obj.email != req.user.email));

})

export default router;