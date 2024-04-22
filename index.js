import 'dotenv/config'

import mongoose from 'mongoose';
import app from "./server.js"

import {init_socket} from './socket.js';

async function launch() {

    if(!process.env.MONGODB_URI) return console.error("ERROR No Mongodb url provided");
    if(!process.env.PORT) return console.error("ERROR No port provided");
    if(!process.env.JWT_KEY) return console.error("ERROR No JWT key provided");
    if(!process.env.EMAIL || !process.env.PASSWORD) return console.error("ERROR: Missing messaging email credentials");

    console.log("Connecting...");
    try {
        
        mongoose.set('strictQuery', true);
        const connection = await mongoose.connect(process.env.MONGODB_URI, {socketTimeoutMS: 1000});

        console.log("Connected to MongoDB");
    } catch(err) {

        console.error("Could not connected to Database...");
        console.log(err);
        return process.kill(1);

    }

    const server = app.listen(process.env.PORT, () => {
        console.log(`Server running on port ${process.env.PORT}`);
    });

    init_socket(server);
    
    return server;

}

launch();