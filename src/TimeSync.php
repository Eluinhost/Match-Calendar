<?php

namespace UltraSoftcore\MatchCalendar;


use Silex\Application;
use Symfony\Component\HttpFoundation\Request;

class TimeSync {

    public function currentTime(Request $request, Application $app)
    {
        return $app->json([
            'time' => microtime(true) * 1000
        ]);
    }

}
