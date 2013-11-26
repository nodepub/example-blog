requirejs.config({
    baseUrl: '/themes/np-admin/js',
    shim: {
        "underscore": {
            exports: '_'
        },
        'backbone': {
            deps: ['underscore', 'jquery'],
            exports: 'Backbone'
        },
        'bootstrap': ['jquery']
    },
    paths: {
        backbone:   'lib/backbone.min',
        underscore: 'lib/underscore',
        jquery:     'lib/jquery',
        bootstrap:  'lib/bootstrap.min'
    },
    
    // cache busting during development
    urlArgs: "bust=" + (new Date()).getTime()
});

requirejs(['np/toolbar', 'np/panel', 'np/sitemap']);