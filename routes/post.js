const express = require("express");
const authMiddleware = require("../middlewares/auth-middleware");
const Post = require("../models/post");

const router = express.Router();



//게시물 등록하기
router.post("/post", authMiddleware, async (req, res) =>{
    
    try {
        
        const {nickName} = res.locals.user;
        const {title, content, imageUrl} = req.body;
        const createPost = await Post.create({
             title, content, imageUrl, nickName
        });
        // console.log(createPost);
        // console.log(nickName);
        res.json({post : createPost});
        // res.json({result : "success", msg:"작성 완료 되었습니다."});
    } catch (err) {
        console.log(err)
        res.status(400).json({result:"fail", meg:"작성 실패"})
    }
    
  

});
//게시물 조회
router.get("/post/list", async (req, res) =>{
   const contents = await Post.find().sort({createdAt : 'desc'}).limit(3);
    // let lastdate = createdAt


    res.json({contents});
   
});


//게시물 상세조회

router.get("/post/list/:contentId",  async (req, res)=>{
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

router.put("/post/:contentId/modify", authMiddleware, async (req, res)=> {
    // const nickName = res.locals.user.nickName;
    const nickName = res.locals.user.nickName;
    // console.log(nickName);
    const {contentId} = req.params;
    // console.log(contentId);
    const {title, content, imageUrl} = req.body;
   
    const existsPost = await Post.findById(contentId);
    // const chackPost = await res.locals.posts(nickName);
   
    if (existsPost.nickName !== nickName) {
        return res.status(400).json({existsPost, message: "닉네임이 일치하지 않습니다."
    });
        } else if (existsPost.nickName === nickName) {
            await Post.findByIdAndUpdate( contentId , { $set: { title, content, imageUrl }});
        }
        res.status(200).json({existsPost, errorMessage: "수정 성공",
        });

 });
   
    // const modifyPost =  await Post.findByIdAndUpdate(contentId, {
    //        $set : {title:title, content:content, imageUrl : imageUrl} ,
    //     });
    //     res.status(201).json({
    //         result:'success',
    //         msg:"글이 수정되었습니다.",
    //     })
        
// });





//게시물 삭제
router.delete("/post/:contentId/delete", authMiddleware, async (req, res)=>{
    const nickName = res.locals.user.nickName;
    const {contentId} = req.params;

    const existsPost = await Post.findById(contentId);
    if (existsPost.nickName !== nickName) {
        return res.status(400).json({existsPost, message: "닉네임이 일치하지 않습니다."
    });
    } else if (existsPost.nickName === nickName) {
    await Post.findByIdAndDelete(contentId);
    }

    // const existsPost = await Post.findById(contentId);
    //     // if(existsPost.length > 0) {
    //         await Post.deleteOne({contentId});
    //     //}
    res.json({result:"success"});

});



module.exports = router;