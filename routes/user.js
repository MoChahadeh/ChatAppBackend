import express from 'express';
import Joi from 'joi';
import bcrypt from 'bcrypt';
import authMidWare from '../middleware/auth.js';
import {User} from "../db.js";
import {validateEmail ,validatePass} from "../validators.js";

const router = express.Router();

router.get("/me", authMidWare, async (req, res) => {

    try {
        const user = await User.findOne({_id: req.user._id}).select(["-password", "-_id"]);
        if(!user) throw new Error("User not found");
        res.status(200).send(user);
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
    });

    try {
        await newUser.save();
        res.status(200).send({token: newUser.generateAuthToken()});
    } catch(err) {
        res.status(400).send(err.message);
    }

})

router.get("/search", authMidWare, async (req, res) => {

    let users;

    if(req.query.email){
        users = await User.find({email: {$not: req.user.email}}).select(["_id","email", "name"]);
    } else {
        users = await User.find().select(["_id","email", "name"]);
    }
    
    if(!users) return res.status(404).send("No users found");
    res.status(200).send([]);


})

export default router;