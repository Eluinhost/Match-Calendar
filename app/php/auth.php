<?php

use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Session\Session;

require __DIR__ . '/../../vendor/autoload.php';
require 'config.php';

$request = Request::createFromGlobals();

$SCOPE = 'identity';
$URI = $request->getSchemeAndHttpHost() . '/php/callback.php';

$session = new Session();
$session->start();

$state = substr(md5(rand()), 0, 10);
$session->set('auth.state', $state);
$session->set('auth.callback', $request->query->get('callback'));

$response = new RedirectResponse(
    'https://ssl.reddit.com/api/v1/authorize'
        .'?client_id=' . urlencode(CLIENT_ID)
        .'&response_type=code'
        .'&state=' . urlencode($state)
        .'&redirect_uri=' . urlencode($URI)
        .'&duration=permanent'
        .'&scope=' . urlencode($SCOPE)
);
$response->prepare($request);
$response->send();

