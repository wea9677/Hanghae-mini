const express = require('express');
const Comments = require('../models/comment');
const router = express.Router();
const authMiddleware = require('../middlewares/auth-middleware');

//댓글 조회 .sort({createAt : 'desc'})

router.get("/comment/:contentId",  async (req, res) => { //댓글 조회
    const { contentId } = req.params;
    const allcomment = await Comments.find({contentId}).sort({createAt : 'desc'});
    res.send(allcomment);
  });
//댓글 작성

router.post("/comment/:contentId", authMiddleware, async (req, res) => {

    try {
        const { nickName } = res.locals.user;
        const { comment, createAt } = req.body;
        const { contentId } = req.params;
        // console.log(nickName, comment, contentId)

        if(comment === null || comment === ""){
            res.status(400).send("댓글을 입력해주세요!")
        }
        const commentContent = await Comments.create({
            nickName, comment, contentId, createAt
        });
        res.status(201).json(commentContent);
        // console.log(commentContent)
    } catch (error) {
        res.status(400).json({errorMassage: "댓글 작성 실패"})
        // console.log(error)
    }
});

router.put("/comment/:contentId/:commentId/modify", authMiddleware, async (req, res) =>{
    const {nickName} = res.locals.user;
    const {commentId} = req.params;
    const {comment, createAt} = req.body;

    const existComment = await Comments.findById(commentId)

  
    if (existComment.nickName !== nickName){
        return res.status(400).json({errorMassage : "댓글 작성자만 수정 할 수 있습니다."
    });

    } else if (existComment.nickName === nickName) {
       const modifyComment = await Comments.findByIdAndUpdate(commentId, {$set:{comment:comment, createAt:createAt},
        });
        console.log(modifyComment);
    }
    res.status(201).json({result:"success" , msg : "댓글 수정 완료!"});
        

    
});


//댓글 삭제

router.delete("/comment/:contentId/:commentId", authMiddleware, async (req, res) => {

    const { commentId } = req.params;
    await Comments.deleteOne({ _id: commentId });
    res.send({result : "삭제 완료!"});
});

module.exports = router;