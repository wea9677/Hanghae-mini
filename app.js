const express = require('express');
const mongoose = require('mongoose');

const port = 3000;

mongoose.connect('mongodb://0.0.0.0/goodnight', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));

const app = express();

app.use("/", (req, res) =>{
    res.send('테스트 페이지')
});




app.listen(port, () => {
    console.log(port, "포트로 서버가 켜졌어요!")
});