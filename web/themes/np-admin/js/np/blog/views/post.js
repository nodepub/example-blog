define([
    'underscore',
    'backbone'
], function(_, Backbone) {
    var postView = Backbone.View.extend({
        tagName: 'li',

        events: {
            "click a" : "edit"
        },

        initialize: function() {
            this.model.bind('change', this.render, this);
            this.model.bind('destroy', this.destroy, this);

            this.id = this.model.attributes.slug;
        },

        render: function() {
            this.$el.html(this.renderTemplate(
                'post_list_template',
                this.model.toJSON()
            ));

            return this;
        },

        edit: function(e) {
            e.preventDefault();
            
            // TODO handle this differently
            // var editView = new NP.views.PostEditView({model: this.model});
            // NP.App.$el.append(editView.render().el);
            // NP.App.listView.hide();

            return false;
        }
    });

    return postView;
});