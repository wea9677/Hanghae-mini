const jwt = require("jsonwebtoken");
const User  = require("../models/user");

module.exports = (req, res, next) => {
    try {
    const { authorization } = req.headers;
    const [ tokenType, tokenValue ] = authorization.split(' ');
    console.log(tokenType, tokenValue)

    if(tokenType !== 'Bearer') {
        res.status(401).send({
<<<<<<< HEAD
            errorMessaage: '로그인 후 사용하세요!'
=======
            errorMessaage: '!로그인 후 사용하세요'
>>>>>>> f747c0bf2998d10075b1d17947ba68c32b191835
        });
    }
        const { userId } = jwt.verify(tokenValue, "mini-secret-key");
        console.log("asdfe") //decoded가 제대로된 값

        User.findById(userId).then((user) => {
            res.locals.user = user;
            console.log("asdw")
            next();
        });
    } catch (error) { //제대로 안된 값
        res.status(401).send({
            errorMessaage: "로그인 후 사용하세요",
        });
        return;
    }
};