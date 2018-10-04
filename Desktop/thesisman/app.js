var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var exphbs = require('express-handlebars');
var Handlebars = require('handlebars');

var app = express();

app.set('views ', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');
app.use(express.static('public'));
app.use('/images', express.static(__dirname + '/images'));
app.use('/stylesheets', express.static(__dirname + '/style.css'));
app.use('/js', express.static(__dirname + '/js'));
app.use('/fonts', express.static(__dirname + '/fonts'));
app.use('/vendor', express.static(__dirname + '/vendor'));
app.use('/scss', express.static(__dirname + '/scss'));
app.use('/models', express.static(__dirname + '/models'));

// BODY PARSER MIDDLEWARE
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.get('/students', (req, res) => {
  res.render('home');
});

app.get('/', (req, res) => {
    res.render('homeadmin', {
      layout: 'mainadmin'
    });
  });

app.get('/faculty', (req, res) => {
    res.render('homefaculty', {
      layout: 'mainfaculty'
    });
  });

app.get('/manage/class', (req, res) => {
    res.render('ManageClass', {
      layout: 'mainadmin'
    });
  });

app.get('/manage/students', (req, res) => {
      res.render('ManageStudents', {
        layout: 'mainadmin'
      });
    });

app.get('/manage/faculties', (req, res) => {
      res.render('ManageFac', {
        layout: 'mainadmin'
      });
    });

app.get('/manage/guests', (req, res) => {
      res.render('ManageGuest', {
        layout: 'mainadmin'
      });
    });


app.listen(process.env.PORT || 4000);
console.log('Server started on port 4000.');
