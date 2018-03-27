var methods = {};

methods.addTodo = function addATodo(con, data, callbackfn) {
  con.query('INSERT INTO tasks set title= \'' + data.title + '\', completed = \'' + data.completed + '\'', data, callbackfn);
};

methods.updateTodo = function addATodo(con, data, callbackfn) {
  con.query('UPDATE tasks set title= \'' + data.title + '\', completed = \'' + data.completed + '\' WHERE ID =\'' + data.id + '\'', data, callbackfn);
};

methods.deleteTodo = function deleteATodo(con, data, callbackfn) {
  con.query('DELETE from tasks WHERE ID =\'' + data + '\'', data, callbackfn);
};

methods.retrieveList = function retrieveTheList(con, callbackfn) {
  con.query('SELECT * FROM tasks', callbackfn);
};

exports.data = methods;