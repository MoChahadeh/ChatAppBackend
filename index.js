import express from 'express';
import mongoose from 'mongoose';

const app = express();

app.use(express.json());

app.get("/", (req,res) => {

    res.send("NIGGAAA");

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

    return app.listen(process.env.PORT || 3001, ()=> console.log("Listening on port " + process.env.PORT));

}

launch();