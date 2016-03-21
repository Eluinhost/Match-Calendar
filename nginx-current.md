# Sample nginx conf
```nginx
server {
    listen 37.59.47.201;
    server_name c.uhc.gg;
    
    root <PROJECT PATH>/web;
    index index.html;
    
    access_log /var/log/c.uhc.gg_access_log;
    error_log /var/log/c.uhc.gg_error_log;
    
    # compress the responses with gzip
    gzip on;
    gzip_comp_level 5;
    gzip_types application/x-javascript application/json text/css;
    
    # disable all caching to leave it to appcache
    expires            off;
    add_header         Cache-Control "no-cache, no-store, must-revalidate";
    sendfile           off;
    if_modified_since  off;
        
    # Return 404 for the manifest file to kill any old caches from the non-https domain
    location ^~ /manifest.appcache {
      	return 404;
    }
    
    # Redirect all other requests to the https version
    location / {
    	return 301 https://$server_name$request_uri;
    }
}

server {
    listen 37.59.47.201:443 spdy ssl;
    server_name c.uhc.gg;
    
    root <PROJECT PATH>/web;
    index index.html;
    
    access_log /var/log/c.uhc.gg_access_log;
    error_log /var/log/c.uhc.gg_error_log;
    
    # compress the responses with gzip
    gzip on;
    gzip_comp_level 5;
    gzip_types application/x-javascript application/json text/css;
    
    # disable all caching to leave it to appcache
    expires            off;
    add_header         Cache-Control "no-cache, no-store, must-revalidate";
    sendfile           off;
    if_modified_since  off;
        
    # setup SSL information
    ssl_certificate <PATH TO CERT>;
    ssl_certificate_key <PATH TO KEY>;
    ssl_stapling on;
    ssl_stapling_verify on;
    ssl_trusted_certificate <PATH TO CHAIN CERT>;
    
    # add header for inclusion in hsts for https always on
    add_header Strict-Transport-Security "max-age=15552000; includeSubdomains; preload";
    
    # other security headers
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    
    # proxy the API to the backend
    location /api {
        proxy_pass http://127.0.0.1:9001;
    }	
}
```
