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

/* const client = new Client({
  database:'thesis',
  user: 'postgres',
  password: 'xxreallay',
  host:'localhost',
  port: 5432
}); */


const client = new Client({
  database: 'd1oe598mlghr2k',
  user: 'ovmoigrkqlygem',
  password: 'd05178ad3051ccc4bce492f7b83dfc1e2a116aea7671cd1c55ddd3a32df68a89',
  host: 'ec2-23-21-147-71.compute-1.amazonaws.com',
  port: 5432,
  ssl: true
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
	client.query("SELECT * FROM users WHERE usertype='student'", (req, data)=>{
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
	client.query("SELECT * FROM users WHERE usertype='faculty'", (req, data)=>{
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

//CLASSES
app.get('/admin/classes/add', function (req, res){
  client.query("SELECT id AS id, batches AS batches FROM batches;")
  .then((batches)=>{
    client.query("SELECT id AS id, year_levels AS year_levels FROM year_levels;")
    .then((year_levels)=>{
      client.query("SELECT id AS id, sections AS sections FROM sections;")
      .then((sections)=>{
        client.query("SELECT id AS id, firstname AS fname, lastname AS lname FROM users WHERE usertype = 'faculty';")
        .then((faculties)=>{
          res.render('adminAddclass', {
            layout: 'mainadmin',
            faculties: faculties.rows,
            batches:batches.rows,
            year_levels: year_levels.rows,
            sections: sections.rows
          })
        })
      })
    })
  })
})

app.post('/add_class', function (req, res){
  client.query("INSERT INTO classes (batch_id, year_level_id, adviser_id, section_id) VALUES ('" + req.body.batch + "', '" + req.body.year_level + "', '" + req.body.user_id + "', '" + req.body.section + "');")
  .then((results)=>{
    console.log('Class Added');
    res.redirect('/admin/classes');
  })
  .catch((err)=>{
    console.log('error', err);
  })
})

app.get('/admin/classes', function (req, res){
  client.query(`
    SELECT classes.id AS class_id,
      batches AS batches,
      sections AS sections,
      year_levels AS year_levels,
      firstname AS fname,
      lastname AS lname
    FROM classes
    INNER JOIN year_levels ON year_levels.id = year_level_id
    INNER JOIN batches ON batches.id = batch_id
    INNER JOIN sections ON sections.id = section_id
    INNER JOIN users ON users.id = adviser_id;
    `)
    .then((classes)=>{
    res.render('adminClasses', {
      layout: 'mainadmin',
      classes: classes.rows
    })
  })
})

app.get('/admin/classes/:id', function (req, res){
  client.query(`
    SELECT classes.id AS class_id,
      batches.batches AS batch,
      sections.sections AS section,
      users.id AS adviser_id,
      users.firstname AS fname,
      users.lastname AS lname
    FROM classes
    INNER JOIN year_levels ON year_levels.id = year_level_id
    INNER JOIN batches ON batches.id = batch_id
    INNER JOIN sections ON sections.id = section_id
    INNER JOIN users ON users.id = adviser_id
    WHERE classes.id =` + req.params.id + `;
    `)
  .then((class_details)=>{
    res.render('adminClasses_details', {
      layout: 'mainadmin',
      batch: class_details.rows[0].batch,
      section: class_details.rows[0].section,
      fname: class_details.rows[0].fname,
      lname: class_details.rows[0].lname
    })
  })
})



//end of CLASSES

app.listen(process.env.PORT || 4000);
console.log('Server started on port 4000.');
