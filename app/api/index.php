<?php
require __DIR__ . '/../../vendor/autoload.php';

$environment = getenv('APP_ENV') ?: 'prod';

$app = new Silex\Application();

if($environment == 'dev') {
    $app['debug'] = true;
}

$app->register(new Igorw\Silex\ConfigServiceProvider(__DIR__ . "/../../config/config_$environment.yml"));

//register API endpoints
$app->get('/sync', 'UltraSoftcore\\MatchCalendar\\TimeSync::currentTime');
$app->run();
