var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const session = require('express-session');

// 这个模块,可以将会话数据放在mongo数据库中，即使应用服务器重启了，回话也不会丢失。
// const MongoStore = require("connect-mongo")(session);

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/user');
// oauth2.0/authorize
var oauthRouter = require('./routes/oauth');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
app.engine("html", require("ejs").__express);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// app.use(session({
//     secret: true,
//     resave: true,
//     saveUninitialized: true,
//     store: new MongoStore({
//       url: "mongodb://127.0.0.1",
//     })
//   })
// );

// app.use(function(req, res, next){
  // console.log("session............", req.session)
  // res.locals 是渲染模板的对象
  // res.locals.user = req.session;
  // console.log("req.locals.user", req.locals.user)
// });

app.use('/', indexRouter);
app.use('/user', usersRouter);
app.use('/oauth2.0', oauthRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  console.log("错误", err);
  // render the error page
  res.status(err.status || 500);
  res.render('error',{
    title:"404",
    err,
    message:err.message
  });
});

module.exports = app;
