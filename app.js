const express = require('express');
const mongoose = require('mongoose');   
const port = 3000;

const userRouter = require("./routes/user")

mongoose.connect('mongodb://localhost:27017/miniproject', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api", userRouter);

app.use("/", (req, res) =>{
    res.send('테스트 페이지')
});


app.listen(port, () => {
    console.log(port, "포트로 서버가 켜졌어요!")
});