define([
    'jquery',
    'underscore',
    'backbone'
], function($, _, Backbone) {
    var modalDialogView = Backbone.View.extend({

        id: 'modal_container',
        
        className: 'modal',
        
        opts: {
            header: '',
            body: '',
            btnDismiss: 'Cancel',
            btnAction: 'Save',
            isDestructive: true,
            actionCallback: function() {},
            dismissCallback: function() {}
        },
        
        initialize: function(opts) {
            this.additionalButtons = [];
            $.extend(this.opts, opts);
        },
        
        render: function() {
            
            var actionClass = this.opts.isDestructive ? 'btn-danger' : 'btn-primary';
            var that = this;
            
            this.$el.html(this.renderTemplate('modal_template', this.opts));
            
            this.$el.find('a[data-action="modal-action"]').click(function(e) {
                e.preventDefault();
                that.opts.actionCallback.call();
            }).addClass(actionClass);
            
            this.$el.find('a[data-action="modal-dismiss"]').click(function(e) {
                e.preventDefault();
                that.dismiss();
                that.opts.dismissCallback.call();
            });
            
            // Add any extra buttons to the dom
            while (this.additionalButtons.length) {
                this.$el.find('.modal-footer').prepend(this.additionalButtons.pop());
            }
            
            this.$el.modal({
                backdrop: true,
                keyboard: true,
                show: true
            });
            
            return this;
        },
        
        dismiss: function() {
            this.$el.modal('hide');
            this.$el.remove();
        },
        
        addButton: function(btnOpts) {
            var opts = {
                label: '',
                buttonCallback: function() {},
                template: _.template('<a class="btn"><%= label %></a>')
            };
            
            $.extend(opts, btnOpts);
            
            var $button = $(opts.template({
                label: opts.label
            }));
            
            $button.click(function(e) {
                e.preventDefault();
                opts.buttonCallback.call();
            });
            
            this.additionalButtons.push($button);
        },
        
        showActiveProcess: function() {
            // TODO: disable button and show an ajax spinner
        }
    });

    return modalDialogView;
});