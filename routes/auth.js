import express from 'express';
import Joi from 'joi';
import bcrypt from 'bcrypt';
import {User} from "../db.js";
import {validateEmail} from "../validators.js";
import emailSender from "../emailsender.js";


const router = express.Router();

router.post("/", async (req,res) => {
    if(!req.body.email || !req.body.password) return res.status(400).send("Email and password are required");
    if(validateEmail(req.body.email).error) return res.status(400).send("Enter a valid email");

    const user = await User.findOne({email: req.body.email});

    if(!user) return res.status(400).send("Invalid email or password");

    const validPass = await bcrypt.compare(req.body.password, user.password);

    if(!validPass) return res.status(400).send("Invalid email or password");

    if(!user.verified) {

        const verificationToken = user.generateVerificationToken();

        await emailSender.sendVerification(user.email, verificationToken);

        return res.status(400).send("please verify your email..");
    }

    const token = user.generateAuthToken();

    user.convos = await user.getConvos();

    return res.status(200).send({token, user});

})


export default router;