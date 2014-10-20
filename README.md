Match Calendar
==============

A website for checking out upcoming UltraHardcore matches from Reddit.

Requirements
------------

- PHP
- NodeJS
- Apache/nginx

Build requirements:

- Git
- NPM
- Bower (install with npm install -g bower)
- Grunt CLI (install with npm install -g grunt-cli)
- Composer

Setup a changelog
-----------------

Make the file `app/changelog.md` for and fill out with details for the site changelog

Build
-----

If not building from scratch skip to install section.

Install NodeJS dependencies

`npm install`

Install Bower dependencies

`bower install`

Install Composer dependencies

`composer update`

Build the application to the web folder

`grunt build`

Install
-------

Point the webserver to the `web` folder.

The site is tested and ran live on nginx.

###nginx
    
    server {
        # other settings, server name/directory e.t.c.
        
        # disable all caching and leave it to appcache
        expires off;
        add_header        Cache-Control no-cache;
        
        # need to turn off to stop appcache keeping old versions (for some crazy reason)
        if_modified_since  off;
    
        # strip index.php/ prefix if it is present
        rewrite ^/api/index\.php/?(.*)$ /api/$1 permanent;
    
        # rewrite api URIs
        location /api {
            try_files $uri @rewriteapp;
        }
    
        # redirect everything at /api/some/path to the index.php front controller
        location @rewriteapp {
            rewrite ^(.*)$ /api/index.php/$1 last;
        }
    
        # pass to the PHP scripts to FastCGI server from upstream phpfcgi
        location ~ ^/api/index\.php(/|$) {
            fastcgi_pass unix:/var/php-nginx/140804921232311.sock/socket;
            fastcgi_split_path_info ^(.+\.php)(/.*)$;
            include fastcgi_params;
            fastcgi_param  SCRIPT_FILENAME $document_root$fastcgi_script_name;
        }
    }


###Apache

There is a .htaccess in the `api` folder already so no extra configuration should be needed.

If your Apache doesn't set the mime type for .appcache the following line will be required in mime type settings:

`AddType text/cache-manifest .appcache`

If the line is left out then some client may not cache the application and reload the entire thing on reload.

There may be issues with caching like nginx, google will help you with disabling it if that is the case

Updating
--------

To update just do `git pull` and follow the build instructions again
