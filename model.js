let mongoose = require('mongoose');
const { dbUrl } = require('./config.js');
let Schema = mongoose.Schema;
let ObjectId = Schema.Types.ObjectId;
let connection = mongoose.createConnection(dbUrl);

// 用户信息
exports.User = connection.model("User", new Schema({
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    avatar: String,
    gender: {
        type: Number,
        default: 1, // 1男 0女
    },
    oauth: String,
}));

// Application(存放第三方信息)
exports.Application = connection.model("Application", new Schema({
    appKey: {
        type: String,
        required: true,
    },
    website: {
        type: String,
        required: true,
    },
    redirect_uri: { // 此应用的回调地址
        type: String,
        required: true,
    }
}));

// 授权码(将mongoose生成的id，作为授权码)
exports.AuthorizationCode = connection.model("AuthorizationCode", new Schema({
    client_id: { // 客户端的app id
        type: String,
        required: true,
    },
    createAt: {
        type: Date,
        default: Date.now(),
    },
    permissions: [{
        type: ObjectId,
        // permissions 是一个外键的数组, 类型是文档的主键, ref指定这个外键是哪个集合的主键
        ref: "Permission",
    }],
    isUsed:{
        type: Boolean,
        default: false,
    },
    user: { // 对哪个用户授权
        type: ObjectId,
        ref: "User",
    }
}));

// access_token模型
exports.AccessToken = connection.model("AccessToken", new Schema({
    appId: { // 客户端的app id
        type: String,
        required: true,
    },
    refresh_token: String,
    createAt: {
        type: Date,
        default: Date.now(),
    },
    permissions: [{
        type: ObjectId,
        // permissions 是一个外键的数组, 类型是文档的主键, ref指定这个外键是哪个集合的主键
        ref: "Permission",
    }]
}));

// 权限
exports.Permission = connection.model("Permission", new Schema({
    name: { // 权限名称
        type: String,
        required: true,
    },
    route: { // 权限名称
        type: String,
        required: true,
    },
    createAt: { // /user/get_user_info
        type: String,
        required: true,
        default: Date.now(),
    },
}));