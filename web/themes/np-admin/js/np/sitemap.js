define(['jquery', 'np/templateLoader'], function($, templateLoader) {

    var sitemap = {

        init: function() {
            console.log('sitemap init');
            this.bindEvents();
        },

        bindEvents: function() {
            $('.-np_sm_add').on('click', this.doAddNodeClick);
        },

        doAddNodeClick: function(e) {
            e.preventDefault();
            
            console.log('click');
            
            var $button = $(e.target),
                nodeId = $button.data('node-id')
                ;
            
            var nodeTypesTemplate = templateLoader.getTemplate('np_node_types_temp');
        
            $button.popover({
                html: true,
                title: 'Page Types',
                trigger: 'manual',
                content: nodeTypesTemplate()
            });
            
            $button.popover('toggle');
        }
    };
    
    //sitemap.init();

    return sitemap;
});