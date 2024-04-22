import express from 'express';

import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';

import authRoute from './routes/auth.js';
import userRoute from './routes/user.js';
import fetchRoute from './routes/fetch.js';
import sendRoute from './routes/send.js';
import verifyRoute from './routes/verify.js';


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


export default app;