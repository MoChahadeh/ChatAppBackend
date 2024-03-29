import express from 'express';
import mongoose from 'mongoose';

import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';

import userRoute from "./routes/user.js";
import authRoute from "./routes/auth.js";
import fetchRoute from "./routes/fetch.js";
import sendRoute from "./routes/send.js";
import verifyRoute from "./routes/verify.js";

import 'dotenv/config'


const app = express();

app.use(express.json());
app.use(cors({
    origin: true,
    credentials: true,
    exposedHeaders: "x-auth-token",
}));

app.use(helmet());
app.use(compression());

app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/fetch", fetchRoute);
app.use("/api/send", sendRoute);
app.use("/api/verify", verifyRoute);


app.get("/", (req,res) => {

    res.send("Mohamad Chahadeh's ChatApp API!");

})


async function launch() {

    if(!process.env.MONGODB_URI) return console.error("ERROR No Mongodb url provided");
    if(!process.env.PORT) return console.error("ERROR No port provided");
    if(!process.env.JWT_KEY) return console.error("ERROR No JWT key provided");
    if(!process.env.EMAIL || !process.env.PASSWORD) return console.error("ERROR: Missing messaging email credentials");

    console.log("Connecting...");
    try {

        const connection = await mongoose.connect(process.env.MONGODB_URI, {socketTimeoutMS: 1000});

        console.log("Connected to MongoDB");
    } catch(err) {

        console.error("Could not connected to Database...");
        console.log(err);
        return process.kill(1);

    }

    return app.listen(process.env.PORT, ()=> console.log("Listening on port " + process.env.PORT));

}

launch();