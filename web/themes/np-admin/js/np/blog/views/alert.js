define([
    'jquery',
    'underscore',
    'backbone',
    'config'
], function($, _, Backbone, config) {
    var alertView = Backbone.View.extend({
        
        opts: {
            msgHead: '',
            msgBody: ''
        },
        
        events: {
            "click a[data-dismiss='alert']"   : "dismiss"
        },
        
        initialize: function(opts) {
            this.opts['level'] = config.labels.success;
            $.extend(this.opts, opts);
        },
        
        render: function() {
            
            var that = this;
            
            this.$el.html(this.renderTemplate(
                'alert_template', this.opts
            ));
            
            setTimeout(function() {
                that.dismiss();
            }, 5000);
            
            return this;
        },
        
        dismiss: function(e) {
            var that = this;
            this.$el.fadeOut('fast', function() {
                that.$el.parent().append('&nbsp;');
                //that.remove();
            });
        }
    });

    return alertView;
});