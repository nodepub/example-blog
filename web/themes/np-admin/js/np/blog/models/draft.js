define(['np/blog/config', 'np/blog/models/post'], function(config, postModel) {

    var draftModel = postModel.extend({
        url: function() {
            return  config.apiPrefix + '/drafts';
        }
    });

    return draftModel;
});