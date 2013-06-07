define(['backbone', 'np/blog/config'], function(Backbone, config) {

    var postModel = Backbone.Model.extend({
        defaults: function() {
            return {
                draft: true
            };
        },

        url: function() {
            return  config.apiPrefix + '/posts';
        },

        publish: function() {
            this.save();
        }
    });

    return postModel;
});