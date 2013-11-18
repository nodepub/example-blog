<?php

# This file initializes the application and loads its dependencies.
# All configuration is done here.

date_default_timezone_set('America/Los_Angeles' );

$loader = require_once __DIR__.'/bootstrap.php';

use Symfony\Component\EventDispatcher\Event;

$app = new Silex\Application(array(
    'np.app_dir' => __DIR__
));

$app['debug'] = true;

# ===================================================== #
#    NP CONFIG                                          #
# ===================================================== #

$app->register(new NodePub\Core\Provider\CoreServiceProvider());

# ===================================================== #
#    BLOG CONFIG                                        #
# ===================================================== #

$app->register(new NodePub\BlogEngine\Provider\BlogServiceProvider(), array(
    'np.blog.posts_dir' => __DIR__.'/../posts',
    // 'np.blog.options' => array(
    // )
));

$app->register(new NodePub\Core\Provider\BlogAdminServiceProvider(), array(
    'np.blog_admin.drafts_dir' => __DIR__.'/../drafts'
));

// Temporary overrides
$app['np.theme.minify_assets'] = false; // need to fix file permission issues

return $app;