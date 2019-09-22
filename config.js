module.exports = {
    appId: "101499238",
    appKey: "xxxxxx",
    access_token: "access_token",
    redirect_uri: "http://localhost:4000/user/callback",
    // 授权码authorize code
    authorizeUrl : "http://localhost:5000/oauth2.0/authorize?",
    // access_code
    fetchTokenUrl: "http://localhost:5000/oauth2.0/token?",
    // openId
    fetchMeUrl: "http://localhost:5000/oauth2.0/me?",
    fetchUserInfo: "http://localhost:5000/user/get_user_info?",
};