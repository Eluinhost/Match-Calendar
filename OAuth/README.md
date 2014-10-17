OAuth in it's current state in Reddit is unsuitable for the application.

This folder contains the code we used that intergrated with OAuth, now retired.

index.php
---------

Need to register service providers:

    $app->register(new Silex\Provider\UrlGeneratorServiceProvider());
    $app->register(new Igorw\Silex\ConfigServiceProvider(__DIR__ . "/../../config/config_$environment.yml"));
    
And endpoints:

    $app->get('/callback', 'UltraSoftcore\\MatchCalendar\\Authentication::callback')->bind('callback');
    $app->get('/auth', 'UltraSoftcore\\MatchCalendar\\Authentication::startAuth');
    
    $app->get('/userinfo', 'UltraSoftcore\\MatchCalendar\\ApiBridge::me');
    $app->post('/self', 'UltraSoftcore\\MatchCalendar\\ApiBridge::submitSelf');
    
app.js
------

Need to register state

    .state('auth', {
        url: '/auth/reddit?error&access_token&refresh_token&expires_in',
        templateUrl: 'components/Auth/auth.html',
        controller: 'AuthCtrl'
    });

composer.json
-------------

Add dependencies:

    "igorw/config-service-provider": "~1.2",
    "symfony/yaml": "~2.5",
    "guzzlehttp/guzzle": "~4.2"

Other
-----

config.yml.dist goes in `/config/`.

All other files in this folder go into `app/components/Auth` and their JS needs to go into the index.html
