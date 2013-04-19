<?php

ini_set('display_errors', 1);
error_reporting(E_ALL);

$app = require __DIR__.'/../app/app.php';

// In a production setting, you'd probably want to enable caching:
// $app['http_cache']->run();

$app->run();