import express from 'express';
import authMidWare from '../middleware/auth.js';
import {Conversation} from '../db.js';


const router = express.Router();

router.get("/", authMidWare, async (req, res) => {

    const convos = await Conversation.find({users: req.user._id}).populate("users", ["_id", "name", "email"]);

    if(!convos) return res.status(400).send("No conversations found");

    return res.status(200).send(convos);

})


export default router;