define(['jquery', 'spectrum'], function($) {

    return {
       init: function() {
            $('input.-colorPicker').spectrum();
       }
    };
});