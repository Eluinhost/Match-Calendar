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

OAuth README additions
----------------------

    ### OAuth Key
    
    Requires OAuth client/secret from Reddit
    
    ### OAuth Settings
    
    Copy `config/config.yml.dist` to `config/config_dev.yml` and `config/config_prod.yml` and fill out the OAuth application
    details from Reddit
    
    Reddit rate limit
    -----------------
    
    Reddit runs a rate limit of 30 requests per minute or 60 requests per minute via OAuth. The application does NOT add any
    rate limiting to the API. You can add rate limiting to the API in nginx with configuration like the following: (adds 
    rate limiting of 30 requests per minute to all URLs in the API).
    
    ###nginx
    
        http {
            #must be in the http block
            limit_req_zone x zone=redditanon:10m rate=30r/m;  # Anon allows for 30 requests per minute
            
            ...
            
            server {
                ...
                
                location /api {
                    limit_req zone=redditanon burst=5; # can be in http / server / location block
                    
                    ...
                }
            }
        }
        
    **NOTE**
    
    This limits the time sync API endpoint too, should split endpoints:
    
    Non-reddit:
    
    `/sync` - None    
    `/auth` - None  
    
    Reddit:
    
    `/callback` - 30r/m
    `/userinfo` - 60r/m  
    `/self` - 60r/m
      
    TODO: rewrite URLs to allow location based zones e.g. `/reddit/callback` and `/reddit/userinfo`
    
