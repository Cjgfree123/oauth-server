var express = require('express');
const { Application, Permission, AuthorizationCode, User } = require('../model.js');
const uuid = require("uuid");
const querystring = require("querystring");
var router = express.Router();

/**
 * 权限
 */
// oauth2.0/permission [get] 查询权限
router.get('/permission', function (req, res, next) {
    res.render("permission", {
        title: "创建权限",
    });
});

// oauth2.0/permission [post] 添加权限
router.post("/permission", async function (req, res, next) {
    let body = req.body;
    console.log("bbbb", req.body)
    let permission = await Permission.create(body);
    res.redirect("/oauth2.0/permissions");
});

// oauth2.0/permissions [get] 权限列表
router.get('/permissions', async function (req, res, next) {
    let permissions = await Permission.find();
    res.render("permissions", {
        title: "权限列表",
        permissions
    })
});

/**
 * 应用
 */
// oauth2.0/application [get] 查询应用
router.get('/application', function (req, res, next) {
    res.render("application", {
        title: "创建客户端应用",
    });
});

// oauth2.0/application [post] 添加应用
router.post('/application', async function (req, res, next) {
    let body = req.body; // website redirect_uri
    body.appKey = uuid.v4();
    let application = await Application.create(body);
    res.redirect("/");
});

// oauth2.0/authorizes [get]  应用列表
router.get("/applications", async function (req, res, next) {
    let applications = await Application.find();
    res.render("applications", {
        title: "客户端列表",
        applications,
    })
});

/**
 * 授权
 */
// oauth2.0/authorize [get] 获取权限通知
router.get('/authorize', async function (req, res, next) {
    let {
        client_id,
        redirect_uri,
        scope = "get_user_info",
    } = req.query;
    let application = await Application.findById(client_id);
    console.log("=====", application.redirect_uri)
    console.log("......", redirect_uri)
    if (application.redirect_uri !== redirect_uri) {
        throw new Error("参数中的uri和应用注册时的uri不匹配");
    };

    // get_user_info,list_album => [get_user_info, list_album]
    let query = {
        $or: scope.split(",").map(route => ({ route }))
    };
    let permissions = await Permission.find(query);
    res.render("authorize", {
        title: "授权第三方应用权限",
        permissions,
        application,
        user: {}, // 实际读全局会话
    });
});

router.post("/authorize", async function (req, res, next) {
    let { client_id, } = req.query;
    let { permissions = [], username, password } = req.body;

    if (!Array.isArray(permissions)) permissions = [permissions];

    let user;
    if (username && password) {
        user = await User.findOne({
            username,
            password
        });
        // 存储到会话中, 提供给下次用
        req.session.user = user;
        console.log("登录并授权", user)
    } else {
        // 从会话中获取当前用户的id
        user = req.session.user._id;
        console.log("从会话中获取用户信息", user);
    };
    if (!user) {
        return next(new Error("用户权限错误"));
    };

    let authorizationCode = await AuthorizationCode.create({
        appId: client_id,
        permissions,
        user,
    });
    console.log("生成授权码", authorizationCode._id);

    let user = req.session.user_id; // 从会话中获取当前用户的id
    redirect_uri = decodeURIComponent(redirect_uri);
    let redirectTo = redirect_uri + (redirect_uri.indexOf('?') === -1 ? "?" : "") + `code=${application._id}`;
    console.log("处理成功, 跳回回调路径 ", redirectTo);
    res.redirect(redirectTo);
});

// /oauth2.0/token [get]
router.get("/token", async function (req, res, next) {
    let options = {
        redirect_uri,
        client_id: appId,
        client_secret: appKey,
        code: "xxxxx",
    } = req.query;

    let authorization_code = await AuthorizationCode.findById(code);
    // 校验授权码是否正确(有效期限是10分钟) 
    if(!authorizationCode || Date.now() - authorizationCode.createAt.getTime() > 10 * 60 * 1000 || authorizationCode.isUsed === true){
        // [过期、授权码已经使用过、不正确]
        return next(new Error('授权码错误/已经失效/已经使用过'));
    };

    // 创建并保存授权码
    let accessToken = new AccessToken({
        appId: authorizationCode.appId,
        refresh_token,
        permissions: authorizationCode.permissions,
        user: authorizationCode.user,
    });
    await accessToken.save();

    // 将authorizationCode(授权码)设置成已经使用过
    authorizationCode.isUsed = true;
    await authorizationCode.save();

    // 返回授权码信息
    let options = {
        access_token: accessToken._id.toString(),
        expires_in: 60 * 60 * 24 * 30 * 3, // 3个月
        refresh_token: accessToken.refresh_token,
    };

    console.log("返回令牌token", options);
    res.send(querystring.stringify(options));
});

router.get("/me", function (req, res, next){
    let { 
        access_token,
    } = res.query;
    // populate: mongodb会将ObjectId通过对应用户ID, 映射成对应用户名。 populate("表名","表中字段")
    let accessToken = await AccessToken.findById(access_token).populate("user", "username");
    let options = {
        client_id: accessToken.appId,
        openId: accessToken.user.toString(), // 用户的真实id
    };
    res.send(`callback(${JSON.stringify(options)})`);
});

module.exports = router;
