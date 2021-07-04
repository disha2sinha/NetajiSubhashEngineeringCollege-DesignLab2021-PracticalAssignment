var paginate = require('jw-paginate');
var express = require('express');
var bodyParser = require('body-parser')
var cors = require('cors')

const mongoose = require('mongoose');
const MONGO_URI = require('./config/keys').MONGO_URI;

require('./models/contents');
const contents = mongoose.model('contents')
var app =  express();
app.use(express.static(__dirname))
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());


app.get('/contents', (req, res) => {
    contents.find({}).then(content => {
    res.send(content);
    })
});

mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

var db = mongoose.connection;

db.on('connected', () => {
    console.log(MONGO_URI);
    console.log("Database connected!");
})

db.on('error', (err) => {
    console.log("Error occured!", err);
})


app.listen(5000,(err)=>{
    console.log("Server!!")
});