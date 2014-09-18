<?php

error_reporting(E_ALL);
ini_set("display_errors", 1);

require __DIR__ . '/../../vendor/autoload.php';

$app = new Silex\Application();
$app->register(new Silex\Provider\UrlGeneratorServiceProvider());

//register the time sync endpoint
$app->get('/sync', 'UltraSoftcore\\MatchCalendar\\Sync::sync');

$app->get('/callback', 'UltraSoftcore\\MatchCalendar\\Authentication::callback')->bind('callback');
$app->get('/auth', 'UltraSoftcore\\MatchCalendar\\Authentication::startAuth');

$app->run();
