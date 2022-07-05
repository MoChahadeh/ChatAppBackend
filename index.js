import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

import userRoute from "./routes/user.js";
import authRoute from "./routes/auth.js";
import fetchRoute from "./routes/fetch.js";
import sendRoute from "./routes/send.js";

const app = express();

app.use(express.json());
app.use(cors({
    exposedHeaders: "x-auth-token",
}));

app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/fetch", fetchRoute);
app.use("/api/send", sendRoute);

app.get("/", (req,res) => {

    res.send("Mohamad Chahadeh's ChatApp API!");

})


async function launch() {

    if(!process.env.MONGODB_URI) return console.error("No Mongodb url provided");

    console.log("Connecting...");
    try {

        const connection = await mongoose.connect(process.env.MONGODB_URI, {socketTimeoutMS: 1000});

        console.log("Connected to MongoDB");
    } catch(err) {

        console.error("Could not connected to Database...");
        console.log(err);
        return process.kill(1);

    }

    return app.listen(3011, ()=> console.log("Listening on port " + process.env.PORT));

}

launch();