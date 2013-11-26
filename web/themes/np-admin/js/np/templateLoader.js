define(['jquery', 'underscore'], function($, _) {

    var compiledTemplates = {};

    return {
        getTemplate: function(id) {
            if (typeof compiledTemplates[id] === 'undefined') {
                var $template = $('#' + id);
                if ($template.length === 0) {
                    console.log('template not found');
                    return;
                }
                compiledTemplates[id] = _.template($template.html());
            }
            
            return compiledTemplates[id];
        }
    };
});