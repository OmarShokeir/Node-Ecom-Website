const dotenv = require('dotenv');
dotenv.config();

const express = require('express')
const app = express()
const expressLayout = require('express-ejs-layouts')
const session = require('express-session')
var bodyParser = require('body-parser');
var path = require('path');

const indexRouter = require('./routes/index')
const usersRouter = require('./routes/users')


app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.set('layout','layouts/layout')
app.use(expressLayout)
app.use(express.static('public'))
app.use(express.urlencoded({ extended: false }))
app.use(session({
  secret: 'secret-key',
  resave: false,
  saveUninitialized: false
}))
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

const { MongoClient } = require("mongodb");
const passport = require('passport');
const connectionString = "mongodb+srv://admin:admin@cluster0.qdmdt.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
const client = new MongoClient(connectionString, {useNewUrlParser: true,useUnifiedTopology: true,});

exports.getClient = client;

app.use('/', indexRouter)
app.use('/users/', usersRouter)
app.use(function(req, res, next) {
  res.locals.user = req.session.user;
  next();
});


app.listen(3000, function(){
  console.log("Server working on PORT: 3000")
})