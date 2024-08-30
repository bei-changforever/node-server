var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');
require("ejs");
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var EqRouter = require('./routes/chart/EquipmentRouter');
const RoomRouter = require("./routes/chart/RoomRouter");
const AirRouter = require("./routes/chart/AirRouter");
const APRouter = require("./routes/chart/APRouter");
const TVRouter = require("./routes/chart/TVRouter");
const SmokeRouter = require('./routes/chart/SmokeRouter');
const BuildingsRouter = require('./routes/Connect/Buildings');
var app = express();
//设置允许跨域访问该服务.
app.use(cors())
// 解决跨域问题
// app.all('*', function(req, response, next) {
//     //设置允许跨域的域名，*代表允许任意域名跨域
//     response.header("Access-Control-Allow-Origin", "*");
//     //允许的header类型
//     response.header("Access-Control-Allow-Headers", "X-Requested-With");
//     //跨域允许的请求方式
//     response.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
//     //设置响应头信息
//     response.header("X-Powered-By",' 3.2.1')
//     response.header("Content-Type", "application/json;charset=utf-8");

//     next();

// });
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use(EqRouter);
app.use(RoomRouter);
app.use(AirRouter);
app.use(APRouter);
app.use(TVRouter);
app.use(SmokeRouter);
app.use(BuildingsRouter);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
