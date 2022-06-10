const express = require("express");
const Post = require("../models/post");
const User = require("../models/user");
const router = express.Router();



//게시물 등록하기
router.post("/write", async (req, res) =>{
    const {nickName, title, content, imageUrl } = req.body;

    const createPost = await Post.create({
        nickName,
        title,
        content,
        imageUrl,
    })
    // res.json({post : createPost});
    res.status(201).json({result: 'success', msg: '글이 등록되었습니다.'});

})
//게시물 조회
router.get("/main", async (req, res) =>{
   const contents = await Post.find().sort({createdAt : 'desc'});

    res.json({contents});
   
});


//게시물 상세조회

router.get("/main/:contentId", async (req, res)=>{
    const {contentId} =req.params;
    const post = await Post.findById(contentId);
    res.json({post});
})


module.exports = router;