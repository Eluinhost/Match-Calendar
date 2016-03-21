Match Calendar
==============

A website for checking out upcoming UltraHardcore matches from Reddit.

Requirements
------------

- NodeJS 0.12+ and NPM 3+
- Apache/nginx (optional)

Installation
------------

Get the git respository: `git clone https://github.com/Eluinhost/Match-Calendar`

Change into the directory: `cd Match-Calendar`

Install/update dependencies: `npm update`

## Frontend

To build the site run:

`npm run build`

This will build the site into the `web` directory.

## Backend 

The backend currently is only an API that returns the server time.

To run the backend you can run `node .`. 

You can also install [Forever](https://github.com/foreverjs/forever) and start
the application by running `forever start .`

By editing the file `config.js` you can modify `server.port` to modify which port 
the backend will listen on, default port 9001.

## Serving files

By default the backend does not serve the frontend to the web and only provides the
API. You can modify the `config.js` file to change how it serves files.

#### apiOnly = false

In this mode the backend will also provide the regular assets, you can just access
the website at `localhost:9001` (or whatever the configured port is) and use it as-is.

#### apiOnly = true

This is a mode for using Apache/nginx e.t.c. to serve the files to allow for load
balancing of the backend e.t.c You will need to proxy the path `/api` to point at the
backend API (like `127.0.0.1:9001`).

Here is a simple configuration file for nginx to work with this method:

```
server {
    listen        80;
    server_name   localhost; # your domain
    root          ...        # point to the folder 'web'of the project

    # disable all caching to leave it to appcache
    expires            off;
    add_header         Cache-Control "no-cache, no-store, must-revalidate";

    # proxy the API to the backend
    location /api {
        proxy_pass http://127.0.0.1:9001;
    }
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

Run `npm update` to install the latest dependencies.

Run `npm prune` to cleanup dependencies.

Update the changelog if wanted and do `npm run build` to rebuild the site.

Development
-----------

A development server can be ran by running:

`npm run dev`

This will start the backend server as well as serving the frontend code via port 9000.
Any changes to the code/css in `/src` will automatically be compiled and the frontend
will reload.
