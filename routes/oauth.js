var express = require('express');
const { Application, Permission } = require('../model.js');
const uuid = require("uuid");
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

module.exports = router;
