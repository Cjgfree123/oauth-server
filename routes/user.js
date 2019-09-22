const logger = require("debug")("server-oauth");
var express = require('express');
var router = express.Router();
const gravatar = require('gravatar');
const { User } = require("../model.js");

// /user/signup
// 注意: 表单提交方式, 必须和请求方式保持一致
router.post('/signup',async function (req, res, next) {
  res.render("signup", {
    title: "注册"
  });
  let body = req.body; // {username,password,email,gender}
  body.avatar = gravatar.url(body.email); // 通过邮件得到头像
  let user = new User(body);
  await user.save();
  console.log("====","保存user成功");
  res.redirect("/user/signin");
});

// /user/signin
router.post('/signin',async function (req, res, next) {
  res.render("signin", {
    title: "登录"
  });

  // let body = req.body;
  // let oldUser = User.findOne({ body });
  // if(oldUser){
  //   res.redirect("/");
  // }else{
  //   res.redirect("/back");
  // }
});


module.exports = router;
