var app = {}; // create namespace for our app

    // Models
    app.Todo = Backbone.Model.extend({
      defaults: {
        title: '',
        completed: '0'
      },
      url: '/Todo',
      toggle: function(){
         this.save({ completed: this.get('completed') === '0' ? '1' : '0'});
      }
    });

    // Collections
    app.TodoList = Backbone.Collection.extend({
      model: app.Todo,
      url: '/TodoList'
    });

    // instance of the Collection
    app.todoList = new app.TodoList();

    // Views
    
    // renders individual todo items list (li)
    app.TodoView = Backbone.View.extend({
      tagName: 'li',
      template: _.template($('#item-template').html()),
      render: function(){
        this.$el.html(this.template(this.model.toJSON()));
        this.input = this.$('.edit');
        return this; // enable chained calls
      },
      initialize: function(){
        this.model.on('change', this.render, this);
        this.model.on('destroy', this.remove, this); // remove: Convenience Backbone
      },
      events: {
        'dblclick label' : 'edit',
        'keypress .edit' : 'updateOnEnter',
        'blur .edit' : 'close',
        'click .toggle': 'toggleCompleted',
        'click .destroy': 'destroy'
      },
      edit: function(){
        this.$el.addClass('editing');
        this.input.focus();
      },
      toggleCompleted: function(){
         this.model.toggle();
      },
      destroy: function(){
         this.model.destroy({headers: {id: this.model.id}});
      },
      close: function(){
        var value = this.input.val().trim();
        if(value) {
          this.model.save({title: value});
        }
        this.$el.removeClass('editing');
      },
      updateOnEnter: function(e){
        if(e.which == 13){
          this.close();
        }
      }
    });
    // renders individual todo items list (li)
    // app.TodoView = Backbone.View.extend({
    //     template: _.template('<div><input class="toggle" type="checkbox"><li> <%=title%> </li></div>'),
    //     render: function(){
    //       this.$el.html(this.template({'title': this.model.attributes.title}));
    //       return this; // enable chained calls
    //     }
    // });
    // renders the full list of todo items calling TodoView for each one.
    app.AppView = Backbone.View.extend({
      el: $('#todoapp'),
      initialize: function () {
        this.input = this.$('#new-todo');
        app.todoList.on('add', this.addOne, this);
        app.todoList.on('reset', this.addAll, this);
        app.todoList.fetch(); // Loads list from local storage
        console.log(app.todoList);
      },
      events: {
        'keypress #new-todo': 'createTodoOnEnter'
      },
      createTodoOnEnter: function(e){
        if ( e.which !== 13 || !this.input.val().trim() ) { // ENTER_KEY = 13
          return;
        }
        var todo = new app.Todo({title: this.input.val().trim(), completed: '0'});
        app.todoList.create(todo);
        this.input.val('');
      },
      addOne: function(todo){
        var view = new app.TodoView({model: todo});
        $('#todo-list').append(view.render().el);
      },
      addAll: function(){
        this.$('#todo-list').html(''); // clean the todo list
        app.todoList.each(this.addOne, this);
      },
    });

    // Initializers
    app.appView = new app.AppView(); 
