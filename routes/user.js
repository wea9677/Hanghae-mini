const express = require("express");
const User = require("../models/user");
const router = express.Router();
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const authMiddelware = require("../middlewares/auth-middleware");

//회원가입 양식
const postUsersSchema = Joi.object({
    email: Joi.string().required(), //이메일 형식 'com','net'만 허용
    password: Joi.string().required(), //최소8자, 하나 이상의 문자, 하나의 숫자, 하나의 특수문자
    repeat_password: Joi.string().required(),
    nickName: Joi.string().required(),
  });

  router.post("/signup", async (req, res) => {//회원가입
    try {
        // console.log("민ㅇ랃")
      const { nickName, password, repeat_password, email} =
        await postUsersSchema.validateAsync(req.body);
        console.log(req.body)
  
      if (password !== repeat_password) {
        res.status(400).send({
          errorMesssage: "패스워드와 패스워드 확인란이 동일하지 않습니다.",
        });
        return;
      }

      const existUsers = await User.find({
        $or: [{ nickName, email }],
      });
         console.log(existUsers)
      if (existUsers.length) {// 이미 있는경우 에러메세지 추가
        return res
          .status(400)
          .json({ success: false, errorMesssage: "이미 있는 데이터입니다." });
      }
  
      const users = new User({ nickName, password, email });
      await users.save();

      res.status(201).send({});
    } catch (error) {
      res.status(400).send({
        errorMesssage: "요청한 데이터 형식이 올바르지 않습니다.",
      });
    }
  });

  const postAuthSchema = Joi.object({ //로그인
    email: Joi.string().required(),//로그인 이메일 형식
    password: Joi.string().required(),//최소 8자, 하나 이상의 문자, 하나의 숫자, 하나의 특수문자
  });
  
  router.post("/login", async (req, res) => {//로그인
    try {
      const { email, password } = await postAuthSchema.validateAsync(req.body);
  
      const user = await User.findOne({ where: { email, password } });
  
      if (!user) {
        res.status(400).send({
          errorMesssage: "닉네임또는 패스워드가 잘못됐습니다.",
        });
        return;
      }
  
      const token = jwt.sign({ userId: user.userId }, "mini-secret-key");
      res.send({
        token,
      });
    } catch (error) {
      res.status(400).send({
        errorMesssage: "요청한 데이터 형식이 올바르지 않습니다.",
      });
    }
  });

  router.get("/signup/me",authMiddelware, async (req, res) => { //로그인 조회
    const { user } = res.locals;
    res.send({
      userId: user.userId,
      nickName: user.nickName,
    });
  });

  module.exports = router;