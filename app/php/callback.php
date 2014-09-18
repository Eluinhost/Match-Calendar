<?php

use GuzzleHttp\Client;
use GuzzleHttp\Post\PostBody;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Session\Session;

require __DIR__ . '/../../vendor/autoload.php';
require 'config/config.php';

$request = Request::createFromGlobals();

$session = new Session();
$session->start();

//don't do anything if we can't verify the state or callback to anywhere
if(!$session->has('auth.state') || !$session->has('auth.callback')) {
    $response = new Response('Invalid use of callback.php', 400);
    $response->prepare($request)->send();

    //invalidate the session just in case
    $session->invalidate();
    return;
}

//get the URL to do callbacks on
$callbackBase = $session->get('auth.callback');

//check the states are equal
$requestState = $request->query->get('state');
$storedState = $session->get('auth.state');

//if the states don't match we need to tell the client we had an error
if($requestState != $storedState) {
    $respone = new RedirectResponse($callbackBase . '?error=' . urlencode('Invalid response from the Reddit servers'));
    $respone->prepare($request);
    $respone->send();

    $session->invalidate();
    return;
}

//if there was an error from reddit pass it on
if($request->query->has('error')) {
    $respone = new RedirectResponse($callbackBase . '?error=' . urlencode($request->query->get('error')));
    $respone->prepare($request);
    $respone->send();

    $session->invalidate();
    return;
}

//the code to get an access token with
$code = $request->query->get('code');

//the URI to redirect to for the next thing
$REDIRECT_URI = $request->getSchemeAndHttpHost() . $request->getBaseUrl();

$client = new Client([
    'defaults' => [
        'auth'      => [
            CLIENT_ID,
            CLIENT_SECRET
        ]
    ]
]);
$req = $client->createRequest('POST', 'https://ssl.reddit.com/api/v1/access_token');

/** @var PostBody $postBody */
$postBody = $req->getBody();
$postBody->setField('grant_type', 'authorization_code');
$postBody->setField('code', $code);
$postBody->setField('redirect_uri', $REDIRECT_URI);

$res = $client->send($req);

if($res->getStatusCode() != 200) {
    $respone = new RedirectResponse($callbackBase . '?error=' . urlencode('Invalid client secret/id'));
    $respone->prepare($request);
    $respone->send();

    $session->invalidate();
    return;
}

$json = $res->json();

$respone = new RedirectResponse($callbackBase . '?access_token=' . urlencode($json['access_token']) . '&refresh_token=' . urlencode($json['refresh_token']));
$respone->prepare($request);
$respone->send();

$session->invalidate();
