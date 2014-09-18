<?php

namespace UltraSoftcore\MatchCalendar;


use GuzzleHttp\Client;
use Silex\Application;
use Symfony\Component\HttpFoundation\Request;

class ApiBridge
{

    public function me(Request $request, Application $app)
    {
        if (!$request->query->has('access_token')) {
            return $app->json(['error' => 'Must provide an access token'], 400);
        }

        $client = new Client([
            'defaults' => [
                'headers' => [
                    'Authorization' => 'bearer ' . $request->query->get('access_token')
                ]
            ]
        ]);

        $req = $client->createRequest('GET', 'https://oauth.reddit.com/api/v1/me');
        $res = $client->send($req);

        return $app->json($res->json(), $res->getStatusCode());
    }
}
