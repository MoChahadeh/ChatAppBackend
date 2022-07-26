import express from 'express';
import { User, Conversation } from '../db.js';
import authMidWare from '../middleware/auth.js';
import EmailSender from '../emailsender.js'

const router = express.Router();


router.post("/", authMidWare, async (req, res) => {

    const from = await User.findById(req.user._id);

    if(!from) return res.status(400).send("invalid sender");

    const to = await User.findById(req.body.to);

    if(!to) return res.status(404).send("Contact not found");

    let convo = await Conversation.findOne({users: {$all: [from._id, to._id]}});


    if(!convo) {

        convo = new Conversation({users: [from._id, to._id], messages: []});

        convo.messages.push({sender: from._id, message: req.body.message});

        try {

            await convo.save();

            EmailSender.sendMessage(from, to, req.body.message);
    
            return res.status(200).send(await convo.populate("users"));
    
        } catch(err) {

            return res.status(400).send(err.message);

        }
    } else {

        try{
            convo.messages.push({sender: from._id, message: req.body.message});

            await convo.save();

            EmailSender.sendMessage(from, to, req.body.message);

            return res.status(200).send(await convo.populate("users"));

        } catch(err) {

            return res.status(400).send(err.message);

        }

    }

    

})

export default router;