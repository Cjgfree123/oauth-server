var express = require('express');
var router = express.Router();

// oauth2.0/application [get]
router.get('/application', function (req, res, next) {
    res.render("application", {
        title: "创建客户端应用",
    });
    // res.json({a:1})
});

// oauth2.0/application [post]
router.post('/application', function (req, res, next) {
    res.render("application", {
        title: "创建客户端应用",
    });
});


// oauth2.0/authorize
router.get('/authorize', function (req, res, next) {
    res.render("authorize", {
        title: "授权第三方应用权限",
    });
});

module.exports = router;
