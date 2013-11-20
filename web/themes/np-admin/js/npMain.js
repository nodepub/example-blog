requirejs.config({
    baseUrl: '/themes/np-admin/js',
    shim: {
        "underscore": {
            exports: '_'
        },
        'backbone': {
            deps: ['underscore', 'jquery'],
            exports: 'Backbone'
        }
    },
    paths: {
        backbone:   'lib/backbone.min',
        underscore: 'lib/underscore',
        jquery:     'lib/jquery'
    },
    
    // cache busting during development
    urlArgs: "bust=" + (new Date()).getTime()
});

requirejs(['np/toolbar', 'np/panel']);