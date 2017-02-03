"use strict";
var showPost = (function($) {
var app = {};
app.AppView = Backbone.View.extend({
	el: '.app',	
	initialize: function(){
		this.listenTo('app.posts', 'change', 'this.destroy')
		//this.listenTo(app.posts, 'add', this.mostrarPost);
		//app.posts.on('add', this.mostrarPost);		
		//console.log("Vista inicializada");
		//this.model.bind("reset", this.render, this);
		this.$list = jQuery('.todo-list');	
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
});
// Rutas de la aplicación
app.Rutas = Backbone.Router.extend({
	routes: {
		'' : 'index',
		'alerta' : 'dos',
		'post/:id': 'post'
	},
	initialize: function(options) {
		this.appView = options.appView;
		console.log(this.appView);
		app.posts = new wp.api.collections.Posts(
			{
				'categories':11,
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
	},
	index: function(){		
		this.load();
	},
	load: function () {
			wp.api.loadPromise.done( function() {
			
			app.posts.fetch({ data: { per_page: 12, orderby: 'date','filter': { 'categories': 11 } }, 
				success: function (collection) {
					console.log("Elementos: " +collection.size());
					var myArray = new Array();
					app.posts.forEach( function (post){
						var url_img = "http://127.0.0.1/backbone/wp-content/uploads/2016/12/office360-150x147.png";
						if 	(post.get('featured_media') != 0)
						{
							var mypost = new wp.api.models.Media( { id: post.get('featured_media') } );
							mypost.fetch().done(function () {
								myArray.push(post.get('id'));
								url_img = mypost.get('media_details').sizes.medium.source_url;								
								post.set({
									featured: url_img,
									//index: myArray.length
								});
								var vista = new app.ItemView({
										model:post,						
								});								
								appView.$list.append(vista.render().$el);
								if (myArray.length % 3 === 0 )
									appView.$list.append('</div><div class="row">');
								// var listView = new app.ListView({collection: app.posts});								
								// this.appView.showView(listView);	
								console.log("has more post: "+ app.posts.hasMore());						
								}); //end fetch media
						} 
						//jQuery( '.post' ).append(vista.render().$el).fadeIn( 3000);;					
					}) //end function each										
			},		//end sucess
			error: function(error) {
				console.log("Error on load!!");
			},
		})
	});
	},

	dos: function() {
		alert("Goool");
	},
	post: function(id) {
		//app.view.close();
		//app.post = new wp.api.models.Post( { id: id } );
		app.post = app.posts.get(id);
		wp.api.loadPromise.done( function() {	
			appView.$list.empty();			
			var url_img = "http://127.0.0.1/backbone/wp-content/uploads/2016/12/office360-150x147.png";			
			app.post.fetch().done(function () {
				if 	(app.post.get('featured_media') != 0) {
					var mypostMedia = new wp.api.models.Media( { id: app.post.get('featured_media') } );
					mypostMedia.fetch().done(function () {						
						url_img = mypostMedia.get('media_details').sizes.full.source_url;
						app.post.set({
							featured: url_img
						});						
						var vistaPost = new app.ItemViewPost({
							model:app.post
						});
						appView.$list.append(vistaPost.render().$el);						
					});
				}
				//  else {
				// 	app.post.set({
				// 		featured: url_img
				// 	});					
				// 	var vistaPost = new app.ItemViewPost({
				// 		model:app.post
				// 	});
				// 	app.appView.$list.append(vistaPost.render().$el);
				// }
			});
			// console.log("JSON "+app.post.toJSON());
		})
	}
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

	render: function () {
		// var obj = {};
		var html = this.template(this.model.toJSON());
		// obj.featured = this.model.get('featured');
		// obj.content = this.model.get('content').rendered;
		// obj.title = this.model.get('title').rendered;
		// obj.link = this.model.get('link');
		// obj.id = this.model.get('id');
		// console.log("En la funcion MostrarLibroView: "+this.model.get('featured'));
		//this.$el.html( this.template(obj) );
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
		initialize:function() {
			this.model.bind("reset",this.render, this);
		},
		destroy: function(){
	      console.log("Delete Item");
	      //this.model.destroy();
	      this.unbind();
	      this.remove();
	    },

		render: function () {
			// var obj = {};
			//var html = this.template(this.model.toJSON());
			// obj.featured = this.model.get('featured');
			// obj.content = this.model.get('content').rendered;
			// obj.title = this.model.get('title').rendered;
			// obj.link = this.model.get('link');
			// obj.id = this.model.get('id');
			// console.log("En la funcion MostrarLibroView: "+this.model.get('featured'));
			// this.$el.html( this.template(obj) );
			this.$el.html(this.template(this.model.toJSON()));		
			return this;
			}
	});
// var mostrarOnePost = Backbone.View.extend({
// 	template: _.template(jQuery('#tmpl-post-one').html()),

// 	render: function () {
// 		//this.$el.html("<p> Message </p>");
// 		var obj = {};
// 		obj.content = this.model.get('content').rendered;
// 		obj.title = this.model.get('title').rendered;
// 		obj.link = this.model.get('link');
// 		obj.id = this.model.get('id');
// 		console.log("llamaste a render "+ JSON.stringify(this));
// 		this.$el.html( this.template(obj) );
// 		return this;
// 	}
// });
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
	var appView = new app.AppView();	
	var rutas = new app.Rutas({ appView: appView});
});
jQuery(document).ready(function($) {
	showPost();
	Backbone.history.start();
});	