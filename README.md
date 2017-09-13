Match Calendar
==============

A website for checking out upcoming UltraHardcore matches from Reddit.

Requirements
------------

- NodeJS 0.12+
- Apache/nginx (optional)

Installation
------------

Get the git respository: `git clone https://github.com/Eluinhost/Match-Calendar`

Change into the directory: `cd Match-Calendar`

Handle dependencies: `yarn install`

To build the site run:

`yarn build`

This will build the site into the `web` directory.

Here is a simple configuration file for nginx:

```nginx
server {
    listen        80;
    server_name   localhost; # your domain
    root          ...        # point to the folder 'web'of the project

    # disable all caching to leave it to appcache
    expires            off;
    add_header         Cache-Control "no-cache, no-store, must-revalidate";
}
```

A more complete HTTPS nginx conf can be found [here](/nginx-current.md)

Note that Apache/nginx require you to set the mime type of .appcache files to `text/cache-manifest`.

For nginx this can be done in `mimes.types` by adding `text/cache-manifest appcache`,
for Apache you can use `AddType text/cache-manifest .appcache` in the mime type settings.
If this is not done some clients may not cache the application and always pull from the
server on every load. 

Setup a changelog
-----------------

When building the changelog at `/Changelog.md` will be built into the web folder with a name 
like `/web/e5f23a3ce3b320e7750157222578e657.md`, it should be the only .md file in there.
The contents of this file are shown as the changelog to all clients and are not in the appcache manifest.

Updating
--------

Run `git pull` to get the latest version.

Run `yarn install` to install the required dependencies.

Update the changelog if wanted and do `yarn build` to rebuild the site.

Development
-----------

A development server can be ran by running:

`yarn dev`

This will start serving the frontend code via port 9002.
Any changes to the code/css in `/src` will automatically be compiled and the frontend
will reload.
