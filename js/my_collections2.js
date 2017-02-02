"use strict";
var app = {};
// Backbone.View.prototype.close = function () {
//   this.$el.empty();
//   this.unbind();
// };
app.AppView = Backbone.View.extend({
	el: '.app',	
	initialize: function(){
		this.model.bind("reset", this.render, this);
		// this.listenTo('app.posts', 'change', 'this.destroy')
		//this.listenTo(app.posts, 'add', this.mostrarPost);
		//app.posts.on('add', this.mostrarPost);		
		//console.log("Vista inicializada");
		//this.model.bind("reset", this.render, this);
		this.$list = jQuery('.todo-list');	
	},
	render: function (eventName) {
		_.each(this.model.models, function (post) {
			jQuery(this.el).append( new app.ItemView({model: post}).render().el )
		}, this);
		return this;
	},
	events: {		
	//'click #btnAdd': 'cambiarColor'
	}, //fin de eventos
	showView: function(view){
      var closingView = this.view;
      this.view = view;
      this.view.render();
      $(this.view.el).hide();
      this.el.append(this.view.el);
      this.openView(this.view);
      this.closeView(closingView);
    },

    destroy: function(){
      console.log("Delete Item");
      //this.model.destroy();
      this.unbind();
      this.remove();
    },

    openView: function(view){
      $(view.el).slideToggle(50);
    },

    closeView: function(view){
      if (view){
        view.unbind();
        $(view.el).slideToggle(500, function(){
          $(this).remove();
        });
      }
    },
	mostrarPost: function(model){
		//libros.fetch();
		this.$list.html('');
		console.log("mostrarPost");
		// var vista = new MostrarLibroView({
		// 	model:model
		// });
		// jQuery( '.post' ).append(vista.render().$el);

	},
	cambiarColor: function() {
		this.$el.css('background-color', 'blue');		
		console.log("Vamos a cambiar el color de fondo");			
		//postsCollection.fetch();
		console.log(posts.toJSON());
	}	
});
app.Post = new wp.api.models.Post( {
	initialize: function() {
		_.bindAll(this, 'nextElement', 'previousElement');
	},
	destroy: function(){
      app.posts.remove(this);
    },
	nextElement: function() {
		var index = this.collection.indexOf(this);
		if ((index + 1) === this.collection.length) {
		  //It's the last model in the collection so return null
		  return null;
		}
	return this.collection.at(index + 1);
  },
	previousElement: function() {
		var index = this.collection.indexOf(this);
		if (index === 0 ) {
		  //It's the first element in the collection so return null
		  return null;
		}
		return this.collection.at(index - 1);
	}


});
// Rutas de la aplicación
app.Rutas = Backbone.Router.extend({
	routes: {
		'' : 'index',
		'alerta' : 'dos',
		'post/:id': 'post'
	},	
	index: function(){
		//app.view.close();		
		//app.posts = new wp.api.collections.Posts({reset:true});
		//Creamos la collection principal
		wp.api.loadPromise.done( function() {
			this.posts = new wp.api.collections.Posts({'categories':11});
			this.appView = new app.AppView({model: this.post});
			this.posts.fetch();
			jQuery('.todo-list');

		});
	},
	dos: function() {
		alert("Goool");
	},
	post: function(id) {		
		this.post = this.posts(id);
		this.itemView = app.ItemViewPost({model:this.itemView});
		jQuery('#content').html(this.itemView.render.().el);
	}
			
			// console.log("JSON "+app.post.toJSON());
});
	
	app.ItemViewPost =  Backbone.View.extend({
		tagName: "div",
		template: _.template(jQuery('#tmpl-post-one').html()),
		attributes: {
			class: "col-md-12"
		},
		events: {
			"click .delete": "destroy"
	},

	destroy: function(){
      console.log("Delete Item");
      //this.model.destroy();
      this.unbind();
      this.remove();
    },

	render: function (eventName) {
		// var obj = {};
		var html = this.template(this.model.toJSON());
		// obj.featured = this.model.get('featured');
		// obj.content = this.model.get('content').rendered;
		// obj.title = this.model.get('title').rendered;
		// obj.link = this.model.get('link');
		// obj.id = this.model.get('id');
		// console.log("En la funcion MostrarLibroView: "+this.model.get('featured'));
		// this.$el.html( this.template(obj) );
		this.$el.html(html);		
		return this;
		}
	});

	app.ItemView =  Backbone.View.extend({
		tagName: "div",
		template: _.template(jQuery('#tmpl-post').html()),
		attributes: {
			class: "col-md-4"
		},
		events: {
			"click .delete": "destroy"
	},

	destroy: function(){
      console.log("Delete Item");
      //this.model.destroy();
      this.unbind();
      this.remove();
    },

	render: function () {
		// var obj = {};
		var html = this.template(this.model.toJSON());
		// obj.featured = this.model.get('featured');
		// obj.content = this.model.get('content').rendered;
		// obj.title = this.model.get('title').rendered;
		// obj.link = this.model.get('link');
		// obj.id = this.model.get('id');
		// console.log("En la funcion MostrarLibroView: "+this.model.get('featured'));
		// this.$el.html( this.template(obj) );
		this.$el.html(html);		
		return this;
		}
	});
	app.ListView = Backbone.View.extend({
	    template: jQuery("#list-template"),
	    renderItem: function(post){
	      var itemView = new app.ItemView({model: post});
	      this.list.append(itemView.render().el);
	    },

	    render: function(){
	      var html = this.template;
	      //var html = this.template();
	      //$(this.el).append(html);
	      this.list = this.jQuery("#list");
	      this.collection.each(this.renderItem, this);
	      console.log(this.collection.toJSON());
	      return this;
	    }
  });

jQuery(document).ready(function($) {
	//app.appView = new app.AppView();	
	var rutas = new app.Rutas();	
	Backbone.history.start();
});	