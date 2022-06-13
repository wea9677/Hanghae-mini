const express = require('express');
const mongoose = require('mongoose');
const port = 8080;
const cors = require("cors")
const postRouter = require("./routes/post");
const userRouter = require("./routes/user");
const likeRouter = require("./routes/like");
const commentRouter = require("./routes/comment");

 

//mongoose.connect('mongodb://0.0.0.0/miniproject', {
mongoose.connect('mongodb+srv://wea9677:tmxkdlfl@cluster0.xmzro.mongodb.net/GoodNight', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));

const app = express();


//body 읽기
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// app.use("/api", [postRouter, userRouter, commentRouter]);


app.use('/api', express.urlencoded({ extended: false }), [ 
    postRouter, userRouter, commentRouter, likeRouter ]);

app.use("/", (req, res) =>{
    res.send('테스트 페이지')
});



app.listen(port, () => {
    console.log(port, "포트로 서버가 켜졌어요!")
});