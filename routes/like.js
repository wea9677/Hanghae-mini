const express = require('express')
const Like = require('../models/like')
const router = express.Router()
const authMiddleware = require('../middlewares/auth-middleware')



// 게시물 좋아요
router.post('/post/:contentId/like', authMiddleware, async (req, res) => {
    const { nickName } = res.locals.user;
    const { contentId } = req.params;

    const findLike = await Like.findOne({contentId, nickName});
    
  
    if(findLike){
      return res.status(400).send({ errorMessage: "이미 좋아요를 하셨습니다!"});
    }else{

    const like = await Like.create({
        nickName, contentId
    });
    await like.save()

    res.status(201).json({ result: 'success', msg: "좋아요 완료!"});
    }
  });

 //좋아요 조회
router.get('/post/:contentId/like',  async (req,res) => {
   
    const { contentId } = req.params;
    // console.log(contentId);
    const findAllLike = await Like.find({contentId});
    console.log(findAllLike);

    res.status(200).json(findAllLike);
});





//좋아요 취소
router.delete('/post/:contentId/unlike', authMiddleware, async (req,res) =>{
    const { nickName } = res.locals.user;
    // const { contentId } = req.params;

    const findLike = await Like.findOne({ nickName });

    if(!findLike){
        res.status(400).send({errorMessage: "좋아요를 하지 않았습니다."});
    }

    const unLike = await Like.findByIdAndDelete(findLike);
    console.log(unLike);
    res.status(200).json({result: 'success', msg: "좋아요 취소 완료!", unLike})
});





module.exports = router;