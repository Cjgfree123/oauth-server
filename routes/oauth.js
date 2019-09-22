var express = require('express');
var router = express.Router();

// oauth2.0/authorize
router.get('/authorize', function (req, res, next) {
    res.render("authorize", {
        title: "授权第三方应用权限",
    });
});

module.exports = router;
