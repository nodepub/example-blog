define([
    'jquery',
    'underscore',
    'backbone',
    'config',
    'views/modalDialog',
    'views/alert'
], function($, _, Backbone, modalDialogView, alertView) {
    var postEditView = Backbone.View.extend({
        
        className: 'row',

        initialize: function() {
            this.unsavedChanges = false;
        },

        events: {
            // "click input[data-action='save-post']" : "onSaveClick",
            //"postEditCancel"    : "tryCancel",
            // 
            // "click a[data-action='edit-permalink']": "addSlugField",
            // "click a[data-action='preview']"       : "onPreviewClick",
            // "click a[data-action='publish']"       : "onPublishClick",
            // "click a[data-action='delete']"        : "onDeleteClick",

            "keydown #post_rawContent"             : "onContentChange",
            "keydown #post_title"                  : "onContentChange"

            //"keyup form.edit"                      : "cancelOnEscape"
        },

        render: function() {

            _.extend(this, Backbone.Events);

            this.on('postEdit:Cancel', this.tryCancel, this);

            this.$el.html(this.renderTemplate(
                'post_edit_template',
                this.model.toJSON()
            ));

            this.postTitle = this.$el.find('#post_title');
            this.postTitle.val(this.model.attributes['title']);
            this.postContent = this.$el.find('#post_rawContent');
            this.postContent.val(this.model.attributes['rawContent']);
            this.postSlug = this.$el.find('#post_slug');
            this.postSlug.val(this.model.attributes['slug']);

            $('body').addClass('post_edit');

            return this;
        },

        tryCancel: function() {
            var that = this;
            if (this.unsavedChanges) {
                var dialog = new modalDialogView({
                    header: 'Do you want to save your changes?',
                    body: "Your changes will be lost if you don't save them.",
                    btnDismiss: 'Cancel',
                    btnAction: "Save",
                    isDestructive: false,
                    actionCallback: function() {

                        // TODO: show spinner

                        that.doSave();
                    }
                });

                // Add a third button
                dialog.addButton({
                    label: "Don't Save",
                    buttonCallback: function() {
                        dialog.dismiss();
                        that.doCancel();
                    }
                });

                NP.App.$el.append(dialog.render());
            } else {
                this.doCancel();
            }

        },

        doCancel: function() {

            $('body').removeClass('editing');

            clearInterval(this.changeWatch);

            // close this view
            this.remove(); // TODO: delete as well?
            NP.App.listView.show();
        },

        cancelOnEscape: function(e) {

            if (e.keyCode != 27) return;

            this.tryCancel();
        },

        onSaveClick: function(e) {
            e.preventDefault();

            this.model.title = this.postTitle.val();
            this.model.rawContent = this.postContent.val();
            this.model.slug = this.postSlug.val();

            this.doSave();
        },

        doSave: function() {
            this.model.save({
                slug: this.model.slug,
                title: this.model.title,
                rawContent: this.model.rawContent
            },
            {
                wait: true,
                success: function(model, response) {
                    console.log('success');

                    var alert = new alertView({
                        msgHead: 'Saved!',
                        msgBody: 'Oh, and great writing too!',
                        level: config.labels.success
                    });

                    // set the saved post id on the model
                    model.set('id', response.id);

                    // todo fire event that alert responds to instead of rendering it here
                    NP.App.alertContainer.append(alert.render().el);
                },
                error: function() {
                    var alert = new alertView({
                        msgHead: 'Error!',
                        msgBody: 'There was an error that prevented saving your post.',
                        level: config.labels.error
                    });

                    NP.App.alertContainer.append(alert.render().el);
                }
            });
        },

        addSlugField: function(e) {
            e.preventDefault();
        },

        onPreviewClick: function(e) {
            e.preventDefault();
        },

        onPublishClick: function(e) {
            e.preventDefault();

            var thisEditView = this;
            var dialog = new modalDialogView({
                header: 'Awesome!',
                body: 'Are you ready to make this post public?',
                btnAction: 'Publish',
                isDestructive: false,
                actionCallback: function() {

                    this.model.save({
                        slug: this.model.slug,
                        title: this.model.title,
                        rawContent: this.model.rawContent
                    },
                    {
                        wait: true,
                        success: function(model, response) {
                            // after successful save,
                            // send the rename call
                            $.post(NP.config.apiPrefix + 'post-manager/publish/' + this.model.id, function() {

                                var alert = new NP.views.AlertView({
                                    msgHead: 'Published!',
                                    msgBody: 'Post is now live.',
                                    level: config.labels.success
                                });

                                // set the saved post id on the model
                                model.set('id', response.id);

                                // todo fire event that alert responds to instead of rendering it here
                                NP.App.alertContainer.append(alert.render().el);
                            });
                        },
                        error: function() {
                            var alert = new NP.views.AlertView({
                                msgHead: 'Error!',
                                msgBody: 'There was an error that prevented saving your post.',
                                level: config.labels.error
                            });

                            NP.App.alertContainer.append(alert.render().el);
                        }
                    });
                }
            });

            NP.App.$el.append(dialog.render().el);
        },

        onDeleteClick: function(e) {
            e.preventDefault();
            // alert
            var editView = this;
            var dialog = new modalDialogView({
                header: 'Delete Post?',
                body: 'Do you really want to permanantly delete this post?',
                btnAction: 'Delete',
                isDestructive: true,
                actionCallback: function() {
                    // TODO: show ajax spinner
                    editView.model.destroy({
                        wait: true,
                        success: function(model, response) {
                            console.log('success');
                            dialog.dismiss();
                            editView.doCancel();
                        },
                        error: function(model, response) {
                            console.log('error');
                            console.log(response);
                            dialog.dismiss();
                        }
                    });
                }
            });

            NP.App.$el.append(dialog.render().el);
        },

        onContentChange: function(e) {
            this.unsavedChanges = true;
            $("input[data-action='save-post']").removeAttr('disabled');
        }

    });

    return new postEditView;
});