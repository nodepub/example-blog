define(['jquery', 'underscore', 'np/events'], function($, _, events) {

    var spinnerTempate;

    var panel = {
        enabledEvent: 'np.panel.enabled',
        disabledEvent: 'np.panel.disabled',

        init: function() {
            this.panelContainer = $('#np_panel_container');
            this.bindEvents();
        },

        bindEvents: function() {
            events.dispatcher.delegate('a[data-panel="open"]', 'click', this.doOpenClick);
            events.dispatcher.on(events.disabledEvent, this.close);
            //this.panelContainer.delegate('a[data-close="panel"]', 'click', this.doCloseClick);
            this.panelContainer.delegate('a', 'click', this.doInnerLinkClick);
        },

        doInnerLinkClick: function(e) {

            // open all links within a new panel,
            // unless the link is the panel close button or has a target="_blank"

            var $this = $(this);

            if ($this.attr('target') === '_blank') {
                return true;
            } else if ($this.attr('data-close')) {
                e.preventDefault();
                panel.close();
            } else if ($this.attr('data-ajax_post')) {
                e.preventDefault();
                panel.ajaxPost($this.attr('href'));
            } else {
                e.preventDefault();
                panel.open($this.attr('href'));
            }
        },

        doOpenClick: function(e) {
            e.preventDefault();
            panel.open($(this).attr('href'));
        },

        open: function(url) {
            events.dispatcher.trigger(this.enabledEvent);
            this.showSpinner();

            // prevent multiple calls,
            // second call cancels the first
            if (this.open.jqxhr && typeof this.open.jqxhr.abort === 'function') {
                this.open.jqxhr.abort();
            }

            this.open.jqxhr = $.ajax({
                url: url,
                cache: true,
                statusCode: {
                    500: function(jqxhr, textStatus, e) {
                        panel.clear();
                        var message = jqxhr.responseText;
                        panel.showFlashMessage('error', message);
                    }
                }
                })
                .done(function(response, textStatus, jqxhr) {
                    // TODO: use local storage to cache data
                    panel.panelContainer.html(response);
                })
                .fail(function(jqxhr, textStatus, e) {
                    //panel.clear();
                    //panel.showFlashMessage('error', textStatus);
                    // this is called even when we manually abort
                })
                ;
        },

        post: function(url) {
            this.showSpinner();

            // this.post.jqxhr = $.post({
            //     url: url,
            //     statusCode: {
            //         500: function(jqxhr, textStatus, e) {
            //             panel.clear();
            //             var message = jqxhr.responseText;
            //             panel.showFlashMessage('error', message);
            //         }
            //     }
            //     })
            //     .done(function(response, textStatus, jqxhr) {
            //         // TODO: use local storage to cache data
            //         panel.panelContainer.html(response);
            //     })
            //     .fail(function(jqxhr, textStatus, e) {
            //         //panel.clear();
            //         //panel.showFlashMessage('error', textStatus);
            //         // this is called even when we manually abort
            //     })
            //     ;

        },

        close: function() {
            panel.panelContainer
                .html('')
                .hide();

            events.dispatcher.trigger(panel.disabledEvent);
        },

        clear: function() {
            this.panelContainer.find('.np_panel_head h1').html('');
            this.panelContainer.find('.np_panel_content').html('');
        },

        getSpinnerContent: function() {
            if (!spinnerTempate) {
                spinnerTempate = _.template($('#np_panel_loading_temp').html());
            }

            return spinnerTempate();
        },

        showSpinner: function() {
            this.panelContainer
                .html(this.getSpinnerContent())
                .show();

            // delay showing the spinner,
            // so that if the ajax response is fast,
            // there is no flash of the spinner
             window.setTimeout(function() {
                $('#np_panel_spinner').show();
            }, 300);
        },

        showFlashMessage: function(status, message) {

            if (! this.showFlashMessage.template) {
                this.showFlashMessage.template = _.template($('#np_panel_flash_temp').html());
            }

            var flash = this.showFlashMessage.template({
                status: status,
                message: message
            });

            this.panelContainer.find('.np_panel_head').after(flash);
            this.panelContainer.find('.-np_panel_flash').delay(5000).fadeOut();
        }
    };

    panel.init();

    return panel;
});