var express = require('express');
const { Application } = require('../model.js');
const uuid = require("uuid");
var router = express.Router();

// oauth2.0/application [get]
router.get('/application', function (req, res, next) {
    res.render("application", {
        title: "创建客户端应用",
    });
});

// oauth2.0/application [post]
router.post('/application',async function (req, res, next) {
    let body = req.body; // website redirect_uri
    body.appKey = uuid.v4();
    let application = await Application.create(body);
    res.redirect("/");
});

// oauth2.0/authorize [get]
router.get('/authorize', function (req, res, next) {
    res.render("authorize", {
        title: "授权第三方应用权限",
    });
});

module.exports = router;
