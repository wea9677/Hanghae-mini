const express = require("express");
const authMiddleware = require("../middlewares/auth-middleware");
const Post = require("../models/post");

const router = express.Router();



//게시물 등록하기
router.post("/write", authMiddleware, async (req, res) =>{
    
    try {
        
        const nickName = res.locals.user.nickName;
        const {title, content, imageUrl} = req.body;
        const createPost = await Post.create({
             title, content, imageUrl, nickName
        });
        console.log(createPost);
        console.log(nickName);
        res.json({post : createPost});
        // res.json({result : "success", msg:"작성 완료 되었습니다."});
    } catch (err) {
        console.log(err)
        res.status(400).json({result:"fail", meg:"작성 실패"})
    }
    
  

});
//게시물 조회
router.get("/main", async (req, res) =>{
   const contents = await Post.find().sort({createdAt : 'desc'});

    res.json({contents});
   
});


//게시물 상세조회

router.get("/main/:contentId", authMiddleware, async (req, res)=>{
    const {contentId} = req.params;
    const post = await Post.findById(contentId);


    res.json({post});
});


//게시물 수정 페이지

// router.get("/main/:contentId/modify", async (req, res) => {
//     const { contentId } = req.params;

//     const post = await Post.findById(contentId);
//     // console.log("article은 : " , article);
//     // console.log("articleId는 : ", article.articleId);
//     res.json({post})
//     // res.status(200).render('write', { post: post });
// });


//게시물 수정

router.patch("/write/:contentId", async (req, res)=> {
    // const nickName = res.locals.user.nickName;
    const {contentId} = req.params;
    const {title, content, imageUrl} = req.body;
   
    const existsPost = await Post.findById(contentId);
    // const chackPost = await Post.findOne(nickName);
    // if (!nickName.length) {
    //     res.status(400).send({
    //         errorMesssage:"작성한 닉네임과 일치하지 않습니다."
    //     });
    //     return;

    // }
   
    const modifyPost =  await Post.findByIdAndUpdate(contentId, {
           $set : {title:title, content:content, imageUrl : imageUrl} ,
        });
        res.status(201).json({
            result:'success',
            msg:"글이 수정되었습니다.",
        })
        
});





//게시물 삭제
router.delete("/main/:contentId/delete", async (req, res)=>{
    
    const {contentId} = req.params;

    const existsPost = await Post.findById(contentId);
        // if(existsPost.length > 0) {
            await Post.deleteOne({contentId});
        //}
    res.json({result:"success"});

});



module.exports = router;