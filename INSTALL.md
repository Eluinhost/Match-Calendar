#Install

## Requirements

- NodeJS/NPM
- Bower (install with npm install -g bower)
- Grunt CLI (install with npm install -g grunt-cli)

## Step 1

Install all dependencies:

`npm install`

`bower install`

This installs all the tools needed to build the application + the libraries the application uses to run

## Step 2

`grunt build`

Builds all of the source into the final application in the web folder

## Step 3 

Point your web server root to the web folder inside the project.

## Step 4

Make sure the web server serves manifest.appcache with the MIME type text/cache-manifest. Modern Apache should do this by
default. For nginx add the following to the mime.types config file:

`text/cache-manifest			appcache;`

This makes all .appcache files serve with the text/cache-manifest mime type.
