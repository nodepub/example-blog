define([
    'jquery',
    'underscore',
    'backbone',
    'models/post',
    'collections/posts',
    'collections/drafts',
    'views/post',
    'views/postEdit'
], function($, _, Backbone, postModel, postsCollection, draftsCollection, postView, postEditView) {
    var dashboardView = Backbone.View.extend({
        events: {
            "keypress #np_new_post_title"     : "newDraft",
            "click .btn[data-btn='logout']"   : "logout"
        },

        initialize: function() {
            this.$el = $('#container');
            this.listView = $('#post_lists_view');
            this.titleInput = $('#new_post_title');
            this.publishedList = $('#post_list ul');
            this.draftList = $('#draft_list ul');
            this.alertContainer = $('#alert_container');

            postsCollection.bind('add', this.addPost, this);
            postsCollection.bind('reset', this.addAllPosts, this);
            //postsCollection.bind('all', this.render, this);
            postsCollection.fetch();

            draftsCollection.bind('add', this.addPost, this);
            draftsCollection.bind('reset', this.addAllDrafts, this);
            //draftsCollection.bind('all', this.render, this);
            draftsCollection.fetch();
        },

        render: function() {
            // prevent form from submitting
            $('form#new_post').submit(function(e) {
                e.preventDefault();
            });
        },

        addPost: function(post, container) {
            var view = new postView({model: post});
            container.append(view.render().el);
        },

        addAllPosts: function() {
            var that = this;
            postsCollection.each(function(post) {
                that.addPost(post, that.publishedList);
            });
        },

        addAllDrafts: function() {
            var that = this;
            draftsCollection.each(function(draft) {
                that.addPost(draft, that.draftList);
            });
        },

        newDraft: function(e) {
            if (e.keyCode != 13) return;
            if (!this.titleInput.val()) return;

            var post = new postModel({title: this.titleInput.val()});
            var view = new postEditView({model: post});

            this.$el.append(view.render().el);
            this.listView.hide();
            this.titleInput.val('');
        },

        logout: function(e) {
            e.preventDefault();
        }
    });

    return new dashboardView();
});