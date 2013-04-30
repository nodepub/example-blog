<?php

# This file initializes the application and loads its dependencies.
# All configuration is done here.

$loader = require_once __DIR__.'/bootstrap.php';

use Symfony\Component\EventDispatcher\Event;
use NodePub\ThemeEngine\ThemeEvents;

$app = new Silex\Application();

$app['debug'] = true;
$app['config_dir'] = __DIR__.'/_config';
$app['np.admin_mount_point'] = '/np-admin';

// TODO: this is only a stub
$app['site'] = $app->share(function() {
    return array(
        'name'        => 'NodePub Example Blog',
        'tagline'     => 'A blog engine that WON\'T kidnap and kill you',
        'title'       => 'NodePub Example Blog',
        'description' => 'This is a demo site for NodePub Blog Engine',
        'url'         => 'http://nodepub.com',
        'ga_code'     => '12345',
        'theme'       => 'sumatra'
    );
});

# ===================================================== #
#    SERVICE PROVIDERS                                  #
# ===================================================== #

$app->register(new Silex\Provider\UrlGeneratorServiceProvider());
$app->register(new Silex\Provider\ServiceControllerServiceProvider());
$app->register(new Silex\Provider\SessionServiceProvider());

$app->register(new Silex\Provider\FormServiceProvider(), array(
    'form.secret' => md5('I call the big one Bitey')
));

$app->register(new Silex\Provider\TranslationServiceProvider(), array(
    'locale_fallback' => 'en',
));

$app->register(new Silex\Provider\TwigServiceProvider(), array(
    'twig.options'    => array(
        'autoescape' => false,
        'cache' => false
    )
));

$app['twig']->addGlobal('site', $app['site']);

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

// Listen for theme activation and set the relevant blog templates
$app['dispatcher']->addListener(ThemeEvents::THEME_ACTIVATE, function(Event $event) use ($app) {

    // We may want some kind of registry or ThemeTemplateResolver object
    // that uses theme's configuration to map it's templates to common page types,
    // otherwise all themes have to use exact names,
    // and there's no way to share a template for different page types, or fallback on a parent theme

    $name = $event->getTheme()->getNamespace();
    $app['blog.frontpage.template']      = '@'.$name.'/blog_index.twig';
    $app['blog.permalink.template']      = '@'.$name.'/blog_post.twig';
    $app['blog.default.template']        = '@'.$name.'/blog_post.twig';
    $app['blog.tag_page.template']       = '@'.$name.'/blog_index.twig';
    $app['blog.category_page.template']  = '@'.$name.'/blog_index.twig';
    $app['blog.archive.template']        = '@'.$name.'/blog_archive.twig';

    $app['np.theme.templates.custom_css'] = '@'.$name.'/_styles.css.twig';
});

# ===================================================== #
#    THEME CONFIG                                       #
# ===================================================== #

$app->register(new NodePub\ThemeEngine\Provider\ThemeServiceProvider(), array(
    'np.theme.paths' => realpath(__DIR__.'/../web/themes'),
    'np.theme.custom_settings_file' => $app['config_dir'].'/theme_settings.yml', // where settings are saved
    'np.theme.mount_point' => $app['np.admin_mount_point'].'/themes',
    'np.theme.active' => $app['site']['theme'],
));

// $app['np.theme.fontstack_provider'] = $app->share(function($app) {
//     $fontStacks = Symfony\Component\Yaml\Yaml::parse($app['config_dir'].'/font_stacks.yml');
// });

# ===================================================== #
#    ROUTES                                             #
# ===================================================== #

$app->get('/', function() use ($app) {
    return $app->redirect($app['url_generator']->generate('blog_get_posts'));
});

$app->error(function (\Exception $e, $code) use ($app) {
    if ($app['debug']) {
        return;
    }

    switch ($code) {
        case 404:
            $message = 'The requested page could not be found.';
            break;
        default:
            $message = 'We are sorry, but something went terribly wrong.';
    }

    return new Symfony\Component\HttpFoundation\Response($message);
});

return $app;