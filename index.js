const express = require('express');
const mongoose = require("mongoose");
const cookie = require('cookie-parser');
const cors = require('cors');
const dotenv = require("dotenv");
dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started at port: ${PORT}`));

app.use(express.json());
app.use(cookie());
app.use(cors({
    origin: ["http://localhost:3000"],
    credentials: true
}));

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
},(err) => {
    if(err) return console.error(err);
    console.log("Connected to mongoDB");
});

app.use("/auth", require("./routers/auth/authRouter.js"));