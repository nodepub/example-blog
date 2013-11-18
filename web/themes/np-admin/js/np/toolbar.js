define(['jquery', 'np/events'], function($, events) {

    var enabledClass = 'np_enabled',
        disabledClass = 'np_disabled'
        ;

    var toolbar = {

        enabledEvent: 'np.enabled',
        disabledEvent: 'np.disabled',
        enabled: false,

        init: function() {
            this.bindEvents();
        },

        bindEvents: function() {
            $('#np_menu_toggle').on('click', this.doToggleClick);
            events.dispatcher.delegate('a[data-panel="open"]', 'click', this.doToolbarClick);
            events.dispatcher.on('np.panel.disabled', this.clearActive);
        },

        doToggleClick: function(e) {

            e.preventDefault();

            var $icon = $(this).find('i');

            if (toolbar.enabled === true) {
                toolbar.disable();
            } else {
                toolbar.enable();
            }
        },

        doToolbarClick: function(e) {
            $('#np_icons a').removeClass('active');
            $(this).addClass('active');
        },

        clearActive: function(e) {
            $('#np_icons a').removeClass('active');
        },

        // drag: function() {
        // },

        // submitReorder: function() {
        //     $.post({
        //         url: '/np-admin/toolbar/reorder',
        //         success: function(data) {
        //         }
        //     });
        // },

        enable: function(onCompleteCallback) {
            this.enabled = true;

            $('body')
                .addClass(enabledClass)
                .removeClass(disabledClass)
                ;

            events.dispatcher.trigger(events.enabledEvent);
        },

        disable: function() {
            this.enabled = false;

            $('body')
                .addClass(disabledClass)
                .removeClass(enabledClass)
                ;

            events.dispatcher.trigger(events.disabledEvent);
        }
    };

    toolbar.init();

    return toolbar;
});