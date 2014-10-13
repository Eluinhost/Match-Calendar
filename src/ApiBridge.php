<?php

namespace UltraSoftcore\MatchCalendar;


use GuzzleHttp\Client;
use GuzzleHttp\Post\PostBody;
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

    public function submitSelf(Request $request, Application $app)
    {
        if(!$request->request->has('access_token')) {
            return $app->json(['error' => 'Must provide an access token'], 400);
        }
        $access_token = $request->request->get('access_token');

        if(!$request->request->has('content')) {
            return $app->json(['error' => 'Must provide content to send'], 400);
        }
        $content = $request->request->get('content');

        if(!$request->request->has('subreddit')) {
            return $app->json(['error' => 'Must provide subreddit to send to'], 400);
        }
        $subreddit = $request->request->get('subreddit');

        if(!$request->request->has('title')) {
            return $app->json(['error' => 'Must provide title of post'], 400);
        }
        $title = $request->request->get('title');

        $client = new Client([
            'defaults' => [
                'headers' => [
                    'Authorization' => 'bearer ' . $access_token
                ]
            ]
        ]);

        $req = $client->createRequest('POST', 'https://oauth.reddit.com/api/submit');

        /** @var PostBody $postBody */
        $postBody = $req->getBody();

        $postBody->setField('api_type', 'json');
        $postBody->setField('kind', 'self');
        $postBody->setField('text', $content);
        $postBody->setField('title', $title);
        $postBody->setField('sr', $subreddit);

        $res = $client->send($req);
        return $app->json($res->json(), $res->getStatusCode());
    }
}
