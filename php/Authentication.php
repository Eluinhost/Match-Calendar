<?php

namespace UltraSoftcore\MatchCalendar;


use GuzzleHttp\Client;
use GuzzleHttp\Post\PostBody;
use Silex\Application;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Session\Session;
use Symfony\Component\Routing\Generator\UrlGenerator;

class Authentication {

    const SCOPE = 'identity,submit';

    public function startAuth(Request $request, Application $app)
    {
        if(!$request->query->has('callback')) {
            return new Response('Invalid use of auth.php, must provide callback URL', 400);
        }

        $URI = $app['url_generator']->generate('callback', [], UrlGenerator::ABSOLUTE_URL);

        $session = new Session();
        $session->start();

        $state = substr(md5(rand()), 0, 10);
        $session->set('auth.state', $state);
        $session->set('auth.callback', $request->query->get('callback'));

        return new RedirectResponse(
            'https://ssl.reddit.com/api/v1/authorize'
            .'?client_id=' . urlencode(Configuration::CLIENT_ID)
            .'&response_type=code'
            .'&state=' . urlencode($state)
            .'&redirect_uri=' . urlencode($URI)
            .'&duration=permanent'
            .'&scope=' . urlencode(Authentication::SCOPE)
        );
    }

    public function callback(Request $request, Application $app)
    {
        $session = new Session();
        $session->start();

        //don't do anything if we can't verify the state or callback to anywhere
        if(!$session->has('auth.state') || !$session->has('auth.callback')) {
            $session->invalidate();
            return new Response('Invalid use of callback.php', 400);
        }

        //get the URL to do callbacks on
        $callbackBase = $session->get('auth.callback');

        //check the states are equal
        $requestState = $request->query->get('state');
        $storedState = $session->get('auth.state');

        //session no longer needed
        $session->invalidate();

        //if the states don't match we need to tell the client we had an error
        if($requestState != $storedState) {
            return new RedirectResponse($callbackBase . '?error=' . urlencode('Invalid response from the Reddit servers'));
        }

        //if there was an error from reddit pass it on
        if($request->query->has('error')) {
            return new RedirectResponse($callbackBase . '?error=' . urlencode($request->query->get('error')));
        }

        //the code to get an access token with
        $code = $request->query->get('code');

        $REDIRECT_URI = $app['url_generator']->generate('callback', [], UrlGenerator::ABSOLUTE_URL);

        $client = new Client([
            'defaults' => [
                'auth'      => [
                    Configuration::CLIENT_ID,
                    Configuration::CLIENT_SECRET
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
            return new RedirectResponse($callbackBase . '?error=' . urlencode('Invalid client secret/id'));
        }

        $json = $res->json();
        return new RedirectResponse($callbackBase . '?access_token=' . urlencode($json['access_token']) . '&refresh_token=' . urlencode($json['refresh_token']));
    }
}
