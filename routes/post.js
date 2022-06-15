const express = require("express");

const moment = require("moment");
const authMiddleware = require("../middlewares/auth-middleware");
const Post = require("../models/post");
const Comment = require("../models/comment");

const router = express.Router();



//게시물 등록하기
router.post("/post", authMiddleware, async (req, res) =>{
    
    try {
        
        const createAt = moment().format('YYYY-MM-DD HH:mm:ss');
        // const updateAt = moment().format('YYYY-MM-DD HH:mm:ss');
        // console.log(nDate);
        const {nickName} = res.locals.user;
        // const  date = new date
        const {title, content, imageUrl} = req.body;
        const createPost = await Post.create({
             title, content, imageUrl, nickName, createAt
        });
      
        res.json({createPost, msg:"작성 완료 되었습니다.", });
    } catch (err) {
        // console.log(err)
        res.status(400).json({result:"fail", meg:"작성 실패"}, )
    }
    
  

});
//게시물 조회



router.get("/post/list", async (req, res) =>{
   const contentId = req.params;
   const contents = await Post.find(contentId).sort({ createAt : 'desc' });
   
    // let lastdate = createdAt



    res.status(200).json(contents);
   
});





//게시물 상세조회


router.get("/post/list/:contentId",  async (req, res)=>{


    const {contentId} = req.params;
    const post = await Post.findById(contentId);


    res.status(200).json(post);
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
    // const updateAt = moment().format('YYYY-MM-DD HH:mm:ss');
   
    const existsPost = await Post.findById(contentId);
    // const chackPost = await res.locals.posts(nickName);
   
    if (existsPost.nickName !== nickName) {
        return res.status(400).json({existsPost, message: "닉네임이 일치하지 않습니다."
    });
        } else if (existsPost.nickName === nickName) {
            await Post.findByIdAndUpdate( contentId , { $set: { title, content, imageUrl, createAt }});
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
    const {nickName} = res.locals.user;
    const {contentId} = req.params;

    const existsPost = await Post.findById(contentId);
    if (existsPost.nickName !== nickName) {
        return res.status(400).json({existsPost, message: "닉네임이 일치하지 않습니다."
    });
    } else {

    await Comment.deleteMany({contentId: contentId}); 
    await Post.findByIdAndDelete(contentId);
    }

    // const existsPost = await Post.findById(contentId);
    //     // if(existsPost.length > 0) {
    //         await Post.deleteOne({contentId});
    //     //}
    res.json({result:"success"});

});



module.exports = router;