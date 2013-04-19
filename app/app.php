<?php

# This file initializes the application and loads its dependencies.
# All configuration is done here.

$loader = require_once __DIR__.'/bootstrap.php';

$app = new Silex\Application();

$app['debug'] = true;


# ===================================================== #
#    SERVICE PROVIDERS                                  #
# ===================================================== #

$app->register(new Silex\Provider\UrlGeneratorServiceProvider());
$app->register(new Silex\Provider\ServiceControllerServiceProvider());

$app->register(new Silex\Provider\TwigServiceProvider(), array(
    'twig.options'    => array(
        'autoescape' => false,
        // 'cache' => __DIR__.'/_cache'
    )
));

$app['twig.loader.filesystem']->addPath(__DIR__.'/templates', 'default');

# ===================================================== #
#    BLOG CONFIG                                        #
# ===================================================== #

$app->register(new NodePub\BlogEngine\ServiceProvider(), array(
    'blog.posts_dir' => __DIR__.'/../posts',
    'blog.template_engine' => $app['twig']
));

// These are the default configuration values set in the service provider
// any of them can be overridden here:

// $app['blog.template.engine']         = $app['twig'];
// $app['blog.content_filter']          = defaults to markdown;
// $app['blog.frontpage.post_limit']    = 20;
// $app['blog.frontpage.template']      = 'blog.twig';
// $app['blog.permalink.template']      = 'post.twig';
// $app['blog.default.template']        = 'post.twig';
// $app['blog.tag_page.template']       = 'blog.twig';
// $app['blog.category_page.template']  = 'blog.twig';
// $app['blog.rss.post_limit']          = 20;
// $app['blog.rss.template']            = 'rss.twig';
// $app['blog.recent_posts.post_limit'] = 5;

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