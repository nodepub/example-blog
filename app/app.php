<?php

# This file initializes the application and loads its dependencies.
# All configuration is done here.

$loader = require_once __DIR__.'/bootstrap.php';

use Symfony\Component\EventDispatcher\Event;
use NodePub\ThemeEngine\ThemeEvents;

$app = new Silex\Application();

$app['debug'] = true;
$app['app_dir'] = __DIR__;

// TODO: this is only a stub
$app['site'] = $app->share(function() {
    return array(
        'name'        => 'NodePub Example Blog',
        'tagline'     => 'A blog engine that WON\'T kidnap and kill you',
        'title'       => 'NodePub Example Blog',
        'description' => 'This is a demo site for NodePub Blog Engine',
        'url'         => 'http://nodepub.com',
        'ga_code'     => '12345',
        'theme'       => 'ethergraphics'
    );
});

// These are yaml stubs for now
$app['db'] = $app->share(function() {
});

//$app['twig']->addGlobal('site', $app['site']);

# ===================================================== #
#    NP CONFIG                                          #
# ===================================================== #

$app->register(new NodePub\Core\Provider\CoreServiceProvider());

// temp override - this is set if logged in as admin in AdminDashboardServiceProvider
$app['np.admin'] = true;

// register extensions - this will be configurable from the UI
$app['np.extensions'] = $app->share($app->extend('np.extensions', function($extensions, $app) {
    $extensions->register(new NodePub\Core\Extension\CoreExtension($app));
    $extensions->register(new NodePub\Core\Extension\ThemeEngineExtension($app));
    $extensions->register(new NodePub\Core\Extension\BlogEngineExtension($app));
    return $extensions;
}));

# ===================================================== #
#    BLOG CONFIG                                        #
# ===================================================== #

$app->register(new NodePub\BlogEngine\Provider\BlogServiceProvider(), array(
    'blog.posts_dir' => __DIR__.'/../posts',
    'blog.template_engine' => $app['twig'],

    // these are internal templates, move to provider
    'blog.index.template' => 'post_index.twig',
    'blog.post.template' => 'post.twig',
));

$app->register(new NodePub\Core\Provider\BlogAdminServiceProvider(), array(
    'np.blog_admin.drafts_dir' => __DIR__.'/../drafts'
));

// Listen for theme activation and set the relevant blog templates
// TODO: move this to core
$app->on(ThemeEvents::THEME_ACTIVATE, function(Event $event) use ($app) {

    // We may want some kind of registry or ThemeTemplateResolver object
    // that uses theme's configuration to map its templates to common page types,
    // otherwise all themes have to use exact template names,
    // and there's no way to share a template for different page types, or fallback on a parent theme

    $theme = $event->getTheme();

    $name = $theme->getNamespace();
    $app['blog.frontpage.template']      = '@'.$name.'/blog_index.twig';
    $app['blog.permalink.template']      = '@'.$name.'/blog_post.twig';
    $app['blog.default.template']        = '@'.$name.'/blog_post.twig';
    $app['blog.tag_page.template']       = '@'.$name.'/blog_index.twig';
    $app['blog.category_page.template']  = '@'.$name.'/blog_index.twig';
    $app['blog.archive.template']        = '@'.$name.'/blog_archive.twig';

    $app['np.theme.templates.custom_css'] = '@'.$name.'/_styles.css.twig';

    // for standalone usage, use the theme layout
    // $app['np.admin.template'] = '@'.$name.'/layout.twig';
    // for full np app use panel
    $app['np.admin.template'] = '@np-admin/panel.twig';

    // set active theme's parent
    if ($parentName = $theme->getParentNamespace()) {
        if ($parent = $app['np.theme.manager']->getTheme($parentName)) {
            $theme->setParent($parent);
        }
    }

    $theme->customize($app['np.theme.configuration_provider']->get($name));
});

# ===================================================== #
#    THEME CONFIG                                       #
# ===================================================== #

$app->register(new NodePub\ThemeEngine\Provider\ThemeServiceProvider(), array(
    //'np.theme.custom_settings_file' => $app['config_dir'].'/theme_settings.yml', // where settings are saved
    'np.theme.default' => $app['site']['theme'],
    'np.theme.minify_assets' => false // need to fix file permission issues
));

$app['np.theme.fontstack_provider'] = $app->share(function($app) {
    $fontStacks = Symfony\Component\Yaml\Yaml::parse($app['config_dir'].'/font_stacks.yml');
    return $fontStacks;
});

return $app;