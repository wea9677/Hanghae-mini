const express = require("express");
const User = require("../models/user");
const router = express.Router();
const Joi = require("joi");
const jwt = require("jsonwebtoken")
const authMiddelware = require("../middlewares/auth-middleware")



//회원가입 양식
const postUsersSchema = Joi.object({
    email: Joi.string().required().pattern(new RegExp('^[a-zA-Z0-9]+@+[0-9a-zA-Z-.]{3,30}$')), //이메일 형식 'com','net'만 허용
    password: Joi.string().required().pattern(new RegExp('^(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$')), //최소8자, 하나 이상의 영문자, 하나의 숫자, 하나의 특수문자
    repeat_password: Joi.string().required(),
    nickName: Joi.string().required(),
  });

  router.post("/signup", async (req, res) => {//회원가입
    try {
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
        $or:[{email}, {nickName}]
        
    });
    console.log(email, nickName);
    if (existUsers.length) {
        res.status(400).send({
            errorMesssage:"중복된 닉네임, 또는 이메일이 존재합니다."
        });
        return;
    }
  
      const users = new User({ nickName, password, email });
      await users.save();
      console.log(users)
      res.status(201).send({});
    } catch (error) {
      res.status(400).send({
        errorMesssage: "요청한 데이터 형식이 올바르지 않습니다.",
        
      });
      console.log(error)
    }
  });

  // const postAuthSchema = Joi.object({ //로그인
  //   email: Joi.string().required(),//로그인 이메일 형식
  //   password: Joi.string().required(),//최소 8자, 하나 이상의 문자, 하나의 숫자, 하나의 특수문자
  // });
  
  router.post("/login", async (req, res) => {//로그인
        const {email, password} = req.body;

        const user = await User.findOne({ email, password }).exec();
        if (!user) {
            res.status(400).send({
                errorMessage: '닉네임 또는 패스워드를 확인해주세요.',
            });
            return;
        }

        // const id = user.userId;
        const token = jwt.sign({ userId: user.userId }, "mini-secret-key"); 
        res.status(200).send({ message: "로그인에 성공했습니다", token });
        console.log(token);
        console.log(user);
    });

        // const { email, password } = await postAuthSchema.validateAsync(req.body)
        // const user = await User.findOne({email});
        // console.log(user);
       
        // const userCompared = await User.findOne(password, user.password);
        // if(!userCompared){
        //     return res.status(400).send({errorMessage: "이메일이나 비밀번호가 올바르지 않습니다."})
        // }
        // console.log(userCompared);
    
   
      // const { email, password } = await postAuthSchema.validateAsync(req.body);
  
      // const existUser = await User.findOne({ email, password });
  
      // if (!existUser) {
      //   res.status(400).send({
      //     errorMesssage: "이메일이 잘못되었습니다.",
      //   });
      //   return;
      // }
      // if (!password ){
      //   res.status(400).send({
      //     errorMesssage: "비밀번호가 틀렸습니다.",
      //   });
      //   return;
      // }

  
  //     const token = jwt.sign({ userId: User.userId }, "mini-secret-key");
  //     res.send({
  //       token,
  //     });
    
  //     res.status(400).send({
  //       errorMesssage: "요청한 데이터 형식이 올바르지 않습니다.",
  //     });
    
  // });

  router.get("/signup/me", authMiddelware, (req, res) => { //로그인 조회
    // const { user } = res.locals;
    // console.log(res.locals);
    
    // res.send({ user: { userId: user.userId, nickName: user.nickName, }, });
    
    
    const  { user }  = res.locals;
    // console.log(res.locals)
    res.send({
     user, 
    });
    console.log(user)
  });

  module.exports = router;