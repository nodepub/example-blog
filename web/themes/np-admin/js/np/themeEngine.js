define(['jquery', 'np/colorPicker'], function($, colorPicker) {

    var themeEngine = {
        init: function() {
            this.bindEvents();
            colorPicker.init();
        },
        bindEvents: function() {
            $('-themeSwitchSelect').on('change', this.doThemeSwitchSelect);
        },
        doThemeSwitchSelect: function(e) {
            console.log('go');
            //$(this).closest('form').submit();
        }
    };

    themeEngine.init();
});