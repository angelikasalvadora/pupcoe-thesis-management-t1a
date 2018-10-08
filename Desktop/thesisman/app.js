var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var exphbs = require('express-handlebars');
var Handlebars = require('handlebars');
	var {Client} = require('pg');
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

const client = new Client({
  database:'thesis',
  user: 'postgres',
  password: 'xxreallay',
  host:'localhost',
  port: 5432
});

client.connect()
  .then(function () {
    console.log('Connected to database');
  })
  .catch(function (err) {
    if (err) {
      console.log('Cannot connect to database');
    };
  });

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

//Add students
app.post('/admin/students', function (req, res) { // product list with insert new product
  var values = [];
  var studName;
  studName = req.body.first_name;
  values = [req.body.first_name, req.body.last_name,req.body.studentNumber,req.body.email,req.body.phone,req.body.password,req.body.adminstat,req.body.usertype];
  client.query('SELECT firstname FROM users', (req, data) => {
    var list;
    var exist = 0;
    for (var i = 0; i < data.rows.length; i++) {
      list = data.rows[i].first_name;
      if (list === studName) {
        exist = 1;
      }
    }
    if (exist === 1) {
      res.render('studentExist', {
        layout: 'mainadmin'
      });
    } else {
      client.query('INSERT INTO users(firstname,lastname,student_number,email,phone,password,adminstat,usertype) VALUES($1, $2, $3, $4, $5, $6, $7, $8)', values, (err, res) => {
        if (err) {
          console.log(err.stack);
        } else {
          console.log('Student Added');
        }
      });
      res.redirect('/admin/students');
    }
  });
});



app.get('/admin/students', (req,res)=>{
	client.query('SELECT * FROM users;', (req, data)=>{
		var studentlist = [];
		for (var i = 1; i < data.rows.length+1; i++) {
				studentlist.push(data.rows[i-1]);
		}
		res.render('adminStudents',{
			studentlist: studentlist,
      layout: 'mainadmin'
		});
	});
});

app.post('/admin/faculties', function (req, res) { // product list with insert new product
  var values = [];
  var faName;
  faName = req.body.first_name;
  values = [req.body.first_name, req.body.last_name,req.body.employeenumber,req.body.email,req.body.phone,req.body.adminstat,req.body.password,req.body.usertype];
  client.query('SELECT firstname FROM users', (req, data) => {
    var list;
    var exist = 0;
    for (var i = 0; i < data.rows.length; i++) {
      list = data.rows[i].first_name;
      if (list === faName) {
        exist = 1;
      }
    }
    if (exist === 1) {
      res.render('studentExist', {
        layout: 'mainadmin'
      });
    } else {
      client.query('INSERT INTO users(firstname,lastname,employee_id,email,phone,adminstat,password,usertype) VALUES($1, $2, $3, $4, $5, $6, $7, $8)', values, (err, res) => {
        if (err) {
          console.log(err.stack);
        } else {
          console.log('Faculty Added');
        }
      });
      res.redirect('/admin/faculties');
    }
  });
});

app.get('/admin/faculties', (req,res)=>{
	client.query('SELECT * FROM users;', (req, data)=>{
		var facultylist = [];
		for (var i = 1; i < data.rows.length+1; i++) {
				facultylist.push(data.rows[i-1]);
		}
		res.render('adminFaculties',{
			facultylist: facultylist,
      layout: 'mainadmin'
		});
	});
});

/*app.get('/admin/classes/1', (req, res) => {
  client.query('SELECT * FROM users where usertype=faculty', (req, data) => {
    var list = [];
    for (var i = 1; i < data.rows.length + 1; i++) {
      list.push(data.rows[i - 1]);
      }
      res.render('studentExist', {
        layout: 'mainadmin',
        advisersdata: list,
    });
  });
}); */

app.listen(process.env.PORT || 4000);
console.log('Server started on port 4000.');
