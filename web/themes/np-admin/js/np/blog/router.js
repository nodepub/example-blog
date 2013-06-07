define([
    'underscore',
    'backbone',
    'np/blog/config',
    'np/blog/collections/posts',
    'np/blog/models/draft',
    'np/blog/models/post',
    'np/blog/views/dashboard',
    'np/blog/views/post',
    'np/blog/views/postEdit'
], function(_, Backbone, config, postsCollection, draftModel, postModel, dashboardView, postView, postEditView ){

    var AppRouter = Backbone.Router.extend({

        routes: {
            '/admin'     : 'dashboardAction',
            '/edit-post' : 'editPost',

            // Default
            '*actions': 'dashboardAction'
        },

        editPost: function() {
            var view = new postEditView();
            view.render();
        },

        dashboardAction: function(actions) {
            var drafts = new postsCollection();
            drafts.url = function() { return config.apiPrefix + '/drafts'; };
            drafts.model = draftModel;

            // We have no matching route, lets display the home page
            dashboardView.render();
        }
    });

    return {
        init: function() {
            var appRouter = new AppRouter();
            Backbone.history.start();
        }
    };
});