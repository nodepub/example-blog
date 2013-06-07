define(['backbone', 'np/blog/config', 'np/blog/models/post'], function(Backbone, config, postModel) {

    var postsCollection = Backbone.Collection.extend({

        model: postModel,

        drafts: function() {
            return this.filter(function(post) {
                return post.get('draft');
            });
        },

        published: function() {
            return this.without.apply(this, this.drafts());
        },

        url: function() {
            return config.apiPrefix + '/posts';
        }
    });

    return new postsCollection();
});