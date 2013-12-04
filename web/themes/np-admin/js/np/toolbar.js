define(['jquery', 'np/events'], function($, events) {

    // Constants
    var ENABLED_CLASS = 'np_enabled',
        DISABLED_CLASS = 'np_disabled',
        DISABLED_ICON_CLASS = 'np_icon_disabled',
        PREV = 'prev',
        NEXT = 'next'
        ;
    
    var activeIconGroup;

    var toolbar = {

        enabledEvent: 'np.enabled',
        disabledEvent: 'np.disabled',
        enabled: false,

        init: function() {
            this.bindEvents();
        },

        bindEvents: function() {
            $('#np_menu_toggle').on('click', this.doToggleClick);
            
            // icon pagination
            $('.-np_prev').on('click', this.doIconPaginatePrev);
            $('.-np_next').on('click', this.doIconPaginateNext);
            
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
        
        doIconPaginatePrev: function(e) {
            toolbar.paginateIcons(PREV);
        },
        
        doIconPaginateNext: function(e) {
            toolbar.paginateIcons(NEXT);
        },
        
        getIconPage: function() {
            return (typeof activeIconGroup !== 'undefined') ? activeIconGroup : 1;
        },
        
        paginateIcons: function(direction) {
            var page = this.getIconPage(),
                iconPageCount = $('#np_icons').data('icon-group-count');
            
            if (direction === PREV) {
                page--;
            } else if (direction === NEXT) {
                page++;
            }
            
            if (page >= 1 && page <= iconPageCount) {
                $('#np_icons li').each(function() {
                    
                    var $this = $(this),
                        iconPage = $this.data('icon-group');
                        
                    if (iconPage === page) {
                        $this.show();
                    } else if (iconPage) {
                        $this.hide();
                    }
                });
                
                // store state
                activeIconGroup = page;
            }
            
            // Sync the prev and next states
            if (page === 1) {
                $('.np_icons_prev').addClass(DISABLED_ICON_CLASS);
                $('.np_icons_next').removeClass(DISABLED_ICON_CLASS);
            } else if (page > 1) {
                $('.np_icons_prev').removeClass(DISABLED_ICON_CLASS);
                if (page === iconPageCount) {
                    $('.np_icons_next').addClass(DISABLED_ICON_CLASS);
                }
            }
        },

        clearActive: function(e) {
            $('#np_icons a').removeClass('active');
        },

        enable: function(onCompleteCallback) {
            this.enabled = true;

            $('body')
                .addClass(ENABLED_CLASS)
                .removeClass(DISABLED_CLASS)
                ;

            events.dispatcher.trigger(events.enabledEvent);
        },

        disable: function() {
            this.enabled = false;

            $('body')
                .addClass(DISABLED_CLASS)
                .removeClass(ENABLED_CLASS)
                ;

            events.dispatcher.trigger(events.disabledEvent);
        }
    };

    toolbar.init();

    return toolbar;
});