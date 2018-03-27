const express = require('express');
const app = express();
const fs = require('fs');
const mysql = require('mysql'),
  url = require('url'),
  db = require('./db_functions.js'),
  bodyParser = require('body-parser'),
  con = mysql.createConnection({
    host: 'localhost',
    user: 'custom',
    password: 'password',
    database: 'calendar_db'
  }),
  jsonParser = bodyParser.json();  //application/json parser

app.use(jsonParser);

app.use(express.static('../client'));  //css and JS static files are served by express automatically
app.get('/', function (req, res) {
  const filePath = '/home/rama/workspace/TodoList/client/todoList.html';
  fs.readFile(filePath, function readContents(err, content) {
  	if (err) {
  		throw err;
  	}
  	res.writeHead(200, {'Content-type': 'text/html'});
  	res.end(content, 'utf-8');
  });
});

app.get('/TodoList', function (req, res) {
  db.data.retrieveList(con, (err, rows) => {
    if (err) {
       throw err;
    }
    console.log('List retrieved');
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(rows), 'utf-8');
  });
});

app.post('/Todo', function(req,res) {
  const body = req.body;
  if (body.length > 1e6) {
    req.con.destroy();
  }
  db.data.addTodo(con, body, (err, success) => {
    if(err) {
      throw err;
    }
    console.log('Todo saved');
  });
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end("{}", 'utf-8');
});

app.put('/Todo', function(req,res) {
  const body = req.body;
  if (body.length > 1e6) {
    req.con.destroy();
  }
  db.data.updateTodo(con, body, (err, success) => {
    if(err) {
      throw err;
    }
    console.log('Todo updated');
  });
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end("{}", 'utf-8');
});

app.delete('/Todo', function(req,res) {
  const body = req.headers.id;
  console.log(body);
  if (body.length > 1e6) {
    req.con.destroy();
  }
  db.data.deleteTodo(con, body, (err, success) => {
    if(err) {
      throw err;
    }
    console.log('Todo deleted');
  });
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end("{}", 'utf-8');
});

const server = app.listen(8000, () => console.log('Todo list app listening on port 8000!'));