define([
    'jquery',
    'underscore',
    'backbone'
], function($, _, Backbone) {
    var postToolbarView = Backbone.View.extend({
        events: {
            "click input[data-action='save-post']" : "onSaveClick",
            "click input[data-action='cancel']"    : "onCancelClick",
            // "click a[data-action='edit-permalink']": "addSlugField",
            "click a[data-action='preview']"       : "onPreviewClick",
            "click a[data-action='publish']"       : "onPublishClick",
            "click a[data-action='delete']"        : "onDeleteClick"
        },
        
        initialize: function() {
            this.$el = $('#post_toolbar');
            _.extend(this, Backbone.Events);
        },
        
        onSaveClick: function(e) {
            e.preventDefault();
            this.trigger('postEdit:Save');
        },
        
        onCancelClick: function(e) {
            e.preventDefault();
            console.log('postEdit:Cancel triggered');
            this.trigger('postEdit:Cancel');
        },
        
        onPreviewClick: function(e) {
            e.preventDefault();
            this.trigger('postEdit:Preview');
        },
        
        onPublishClick: function(e) {
            e.preventDefault();
            this.trigger('postEdit:Publish');
        },
        
        onDeleteClick: function(e) {
            e.preventDefault();
            this.trigger('postEdit:Delete');
        }
    });

    return postToolbarView;
});