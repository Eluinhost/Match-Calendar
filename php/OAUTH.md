REQUEST OAUTH CODES
-------------------

Step 1:

Redirect the user to the `/api/auth` with 1 query parameter `callback`. `callback` should be a URL which will accept the 
returned oauth codes/errors.

Step 2:

The script stores the callback in the session and redirects the user to Reddit's OAuth login.

Step 3:

Reddit should redirect the user back to `/api/callback` where it will validate the response from Reddit is valid. If it 
is not valid then the user will be redirected to the URL provided in `callback` with a query parameter `error` with the
error message.

Step 4:

Assuming the code from Reddit was valid then the `/api/callback` requests the access_token and refresh_token from Reddit.
If there are any errors in doing so the user will be redirected to the URL provided in `callback` with a query parameter
`error` with the error message. If successful the user will be redirected to the URL with the query parameters 
`access_token` and `refresh_token`.

REFRESH OAUTH CODES
-------------------

TODO

REVOKE OAUTH CODES
------------------

TODO
