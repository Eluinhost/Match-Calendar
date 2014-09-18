<?php

namespace UltraSoftcore\MatchCalendar;

use Silex\Application;
use Symfony\Component\HttpFoundation\Request;

class Sync {

    public function sync(Request $request, Application $app)
    {
        return $app->json([
            'time' => microtime(true) * 1000
        ]);
    }
}
