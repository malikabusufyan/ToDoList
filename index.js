// Require the express module, specify port,require path to specify relative path, require parser to convert data to desired format
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const port = 8000;


//Require the DB and configure 

const db = require('./config/mongoose');
const Todo = require('./models/todo');


// Fire up the express app
const app = express();

// Set the view engine as ejs
app.set('view engine', 'ejs');

//Link the path of views folder to current directory
app.set('views', path.join(__dirname, 'views'));

//Use parser to convert data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded());

//Use static to link the .css, .js files(in the assets folder) to the home.ejs file
app.use(express.static('assets'));

// ******Rendering home.ejs file on the web***********
app.get('/', function(req, res){

    Todo.find({})
    .then(function(todos){
        return res.render('home',{
            title : "ToDo List",
            todolist : todos,
        });
    });

});


// *******Adding a single task at once with MongoDB**********
app.post('/add_todo', function(req, res) {
    if (req.body.action === 'add') {

        Todo.create({
            description : req.body.description,
            category : req.body.category,
            date : req.body.date,
        })
        .then(function(newTodo){
            console.log("****************", newTodo);
            return res.redirect('back');
        })
        .catch(function(err){
            console.log('Error in creating  a new Todo!!');
            return;
        });
    } 
      
    else if (req.body.action === 'delete') {
      Todo.deleteMany({})
      .then(function(){
        console.log("Deleted list Successfully!!");
        return res.redirect('/');
      });
  
      
    }
  });
  

// **********Deletion of one task at a time**************

app.get('/delete-item/', function(req, res){
    

    // get ID from the query in checkbox
    let id = req.query.id;
    //find the todo with the id in db and delete it
    Todo.findByIdAndDelete(id)
    .then(function(){
        return res.redirect('back');
    })
    .catch(function(err){
        console.log('Error in deleting the todo item');
        return;
    });
});

// Firing the express listener
app.listen(port,function(err){
    if (err){
        console.log("there is an error");
    }
    console.log("Server is up and running!");
});