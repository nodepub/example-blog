define(['jquery', 'np/panel', 'np/templateLoader', 'bootstrap'], function($, panel, templateLoader, bootstrap) {

    var sitemap = {

        init: function() {
            this.bindEvents();
        },

        bindEvents: function() {
            panel.panelContainer.delegate('.-np_sm_node_edit', 'click', this.doNodeEditClick);
            panel.panelContainer.delegate('.-np_sm_node_config', 'click', this.doNodeConfigClick);
            panel.panelContainer.delegate('.-np_sm_add', 'click', this.doAddNodeButtonClick);
            panel.panelContainer.delegate('.-np_sm_add_type', 'click', this.doAddNodeTypeClick);
            panel.panelContainer.delegate('.-np_toggle', 'click', this.doChildToggleClick);
        },
        
        doNodeEditClick: function(e) {
            e.preventDefault();
        },
        
        doNodeConfigClick: function(e) {
            e.preventDefault();
            
            var $item = $(this).closest('li'),
                type = $item.data('node-type'),
                id = $item.data('node-id')
                ;
            
            sitemap.loadNodeConfig(id, type);
        },

        /**
         * Display popover of node types
         */
        doAddNodeButtonClick: function(e) {
            e.preventDefault();
            
            var $button = $(e.target),
                nodeId = $button.parent().data('node-id')
                ;
        
            // use bootstrap popover plugin
            $button.popover({
                html: true,
                title: 'Page Types',
                trigger: 'manual',
                content: function() {
                    var nodeTypesTemplate = templateLoader.getTemplate('np_node_types_temp');
                    return nodeTypesTemplate({nodeId: nodeId});
                }
            });
            
            $button.popover('toggle');
        },
        
        doAddNodeTypeClick: function(e) {
            e.preventDefault();
        },
        
        /**
         * Toggle the arrow icon for if a parent's children are shown or not
         */
        doChildToggleClick: function(e) {
            e.preventDefault();
            var $this = $(this);
            
            if ($this.data('open') === true) {
                $this.find('i').removeClass('fa-caret-down').addClass('fa-caret-right');
                $this.data('open', false);
            } else {
                $this.find('i').removeClass('fa-caret-right').addClass('fa-caret-down');
                $this.data('open', true);
            }
        },
        
        loadNodeConfig: function(nodeId, nodeType) {
            $('#np_sm_node_config').html('<h3>' + nodeType + '</h3>').show();
        }
    };
    
    sitemap.init();

    return sitemap;
});