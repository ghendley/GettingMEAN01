const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const sassMiddleware = require('node-sass-middleware');

const indexRouter = require('./app_server/routes/index');
const usersRouter = require('./app_server/routes/users');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'app_server', 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(sassMiddleware({
    src: path.join(__dirname, 'public'),
    dest: path.join(__dirname, 'public'),
    indentedSyntax: true, // true = .sass and false = .scss
    sourceMap: true
}));

// static routes
app.use(express.static(path.join(__dirname, 'public')));
app.get('/stylesheets/bootstrap.css', function (req, res) {
    res.sendFile(__dirname + '/node_modules/bootstrap/dist/css/bootstrap.css');
});
app.get('/scripts/bootstrap.js', function (req, res) {
    res.sendFile(__dirname + '/node_modules/bootstrap/dist/js/bootstrap.js');
});
app.get('/stylesheets/fontawesome.css', function (req, res) {
    res.sendFile(__dirname + '/node_modules/Font-Awesome/css/all.css');
});
app.get('/scripts/fontawesome.js', function (req, res) {
    res.sendFile(__dirname + '/node_modules/Font-Awesome/js/all.js');
});
// TODO surely this isn't ideal
app.get('/webfonts/:file', function (req, res) {
    let file = req.params.file;
    res.sendFile(__dirname + '/node_modules/Font-Awesome/webfonts/' + file);
});

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
// noinspection JSUnusedLocalSymbols
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
