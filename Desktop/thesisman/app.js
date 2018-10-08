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

app.get('/', (req, res) => {
    res.render('login', {
      layout: 'main'
    });
  });
//Three Main Users
app.get('/students', (req, res) => {
    res.render('homeadmin', {
      layout: 'mainstudents'
    });
  });

app.get('/admin', (req, res) => {
    res.render('homeadmin', {
      layout: 'mainadmin'
    });
  });

app.get('/faculty', (req, res) => {
    res.render('homefaculty', {
      layout: 'mainfaculty'
    });
  });


// Admin Pages
app.get('/admin/faculties', (req, res) => {
    res.render('adminFaculties', {
      layout: 'mainadmin'
    });
  });

app.get('/admin/students', (req, res) => {
    res.render('adminStudents', {
      layout: 'mainadmin'
    });
  });

app.get('/admin/classes', (req, res) => {
    res.render('adminClasses', {
      layout: 'mainadmin'
    });
  });

  app.get('/admin/faculty/add', (req, res) => {
      res.render('adminAddfaculty', {
        layout: 'mainadmin'
      });
    });

    app.get('/admin/students/add', (req, res) => {
        res.render('adminAddstudents', {
          layout: 'mainadmin'
        });
      });

      app.get('/admin/classes/add', (req, res) => {
          res.render('adminAddclass', {
            layout: 'mainadmin'
          });
        });


app.listen(process.env.PORT || 4000);
console.log('Server started on port 4000.');
