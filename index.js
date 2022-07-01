import express from 'express';

const app = express();

app.use(express.json());

app.get("/", (req,res) => {

    res.send("NIGGAAA");

})

app.listen(3000, () => console.log("listening on port 6930"));