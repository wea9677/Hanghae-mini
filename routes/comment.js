const express = require('express');
const Comments = require('../models/comment');
const Posts = require('../models/post');
const router = express.Router();
const authMiddleware = require('../middlewares/auth-middleware');

//댓글 조회
router.get("/main/:contentId/comment", authMiddleware, async (req, res) => { //댓글 조회
    const allcomment = await Comments.find({});
    res.send(allcomment);
  });
//댓글 작성
router.post("/main/:contentId/comment", authMiddleware, async (req, res) => {
    try {
        const { user } = res.locals;
        const nickName = user.nickName;
        const { comment } = req.body;
        const { contentId } = req.params;
        console.log(user, comment, contentId)

        if(comment === null || comment === ""){
            res.status(400).send("댓글을 입력해주세요!")
        }
        const commentContent = await Comment.create({
            nickName, comment, contentId
        });
        res.status(201).json(commentContent);   
    } catch (err) {
        res.status(400).json({errorMassage: "댓글 작성 실패"})
    }
});
//댓글 삭제
router.delete("/main/:contentId/comment/:commentId", authMiddleware, async (req, res) => {
    const { commentId } = res.params;
    const existsComment = await Comment.findById(commentId);

    if(existsComment){
        await Comment.findByIdAndDelete(commentId);
        res.status(201).json({ result: "success", msg: "댓글 삭제 완료!"});
    }

});

module.exports = router;