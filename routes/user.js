const logger = require("debug")("server-oauth");
var express = require('express');
var router = express.Router();
const gravatar = require('gravatar');
const { User } = require("../model.js");

// /user/signup [get]
router.get('/signup', async function (req, res, next) {
  res.render("signup", {
    title: "注册"
  });
});

// user/signup [post]
router.post('/signup', async function (req, res, next) {
  // res.json({a:1})
  let body = req.body; // {username,password,email,gender}
  body.avatar = gravatar.url(body.email); // 通过邮件得到头像
  let user = new User(body);
  await user.save();
  console.log("====", "保存user成功");
  res.redirect("/user/signin");
});

// /user/sign [get]
router.get('/signin', async function (req, res, next) {
  res.render("signin", {
    title: "登录"
  });
});

// /user/signin [post]
router.post('/signin', async function (req, res, next) {
  let body = req.body;
  let oldUser = User.findOne({ body });
  if (oldUser) {
    // req.session.user = oldUser;
    // console.log("req.session", req.session)
    res.redirect("/");
  } else {
    res.redirect("/back");
  }
});

// /user/signout [get]
router.get("/signout", function (req, res, next) {
  res.redirect("/user/signup");
})

// /user/get_user_info [get]
router.get("/get_user_info", function (req, res, next) {
  let options = {
    access_token,
    openid, // user_id
    oauth_consumer_key: appId, // client_id
  };

  let accessToken = await AccessToken.findOne({
    access_token,
  });
  // 此处拿到的是: 权限id,所以通过item.route进行判断权限名称
  let { permissions } = await AccessToken.findById(accessToken).populate("permissions");
  let findItem = permissions.find(item => item.route.toString() === "get_user_info");
  if (findItem) {
    userInfo.oauth = "QQ";
    userInfo.create(userInfo);
    let oldUser = await User.create(userInfo);
    req.session.user = oldUser;
    console.log("用户详情", user);
    res.json(user);
  } else {
    return res.json({
      error: "你的token无权限访问此接口",
    })
  }

});

module.exports = router;
