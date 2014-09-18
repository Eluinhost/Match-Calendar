<?php

error_reporting(E_ALL);
ini_set("display_errors", 1);

require __DIR__ . '/../../vendor/autoload.php';

$app = new Silex\Application();

//register the time sync endpoint
$app->get('/sync', 'UltraSoftcore\\MatchCalendar\\Sync::sync');

$app->run();
