<?php
require __DIR__ . '/../../vendor/autoload.php';

$environment = getenv('APP_ENV') ?: 'prod';

$app = new Silex\Application();
$app->register(new Silex\Provider\UrlGeneratorServiceProvider());
$app->register(new Igorw\Silex\ConfigServiceProvider(__DIR__ . "/../../config/config_$environment.yml"));

if($environment == 'dev') {
    $app['debug'] = true;
}

//register API endpoints
$app->get('/sync', 'UltraSoftcore\\MatchCalendar\\TimeSync::currentTime');

$app->get('/callback', 'UltraSoftcore\\MatchCalendar\\Authentication::callback')->bind('callback');
$app->get('/auth', 'UltraSoftcore\\MatchCalendar\\Authentication::startAuth');

$app->get('/userinfo', 'UltraSoftcore\\MatchCalendar\\ApiBridge::me');
$app->post('/self', 'UltraSoftcore\\MatchCalendar\\ApiBridge::submitSelf');

$app->run();
