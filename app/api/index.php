<?php
require __DIR__ . '/../../vendor/autoload.php';

$environment = getenv('APP_ENV') ?: 'prod';

$app = new Silex\Application();

if($environment == 'dev') {
    $app['debug'] = true;
}

//register API endpoints
$app->get('/sync', 'UltraSoftcore\\MatchCalendar\\TimeSync::currentTime');

$app->run();
