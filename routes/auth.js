import express from 'express';
import Joi from 'joi';
import bcrypt from 'bcrypt';
import {User} from "../db.js";
import {validateEmail} from "../validators.js";


const router = express.Router();

router.post("/", async (req,res) => {

    if(!req.body.email || !req.body.password) return res.status(400).send("Email and password are required");
    if(!validateEmail(req.body.email)) return res.status(400).send("Enter a valid email");

    const user = await User.findOne({email: req.body.email});

    if(!user) return res.status(400).send("Invalid email or password");

    const validPass = await bcrypt.compare(req.body.password, user.password);

    if(!validPass) return res.status(400).send("Invalid email or password");

    const token = user.generateAuthToken();

    return res.status(200).send({token});

})


export default router;