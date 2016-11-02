## Version 1.4.5

- Added warning to generator for potential overhosts
- Tightened up restrictions for chooseable times in the generator (15 min intervals, at least 30 minutes in the future)

## Version 1.4.3

- Added a 'Short Notice' warning flag
- Fixed layout of filter labels for certain screen sizes
- Changed post page to use a reddit shortlink
- Added a way to go directly to the reddit post from the listing

## Version 1.4.2

- Fixed rare issue causing times not to show
- Added query paramter addsub for prompting for subreddit addition
- Added 'potential overhost' tag
- When 2 posts are for the same time the one posted first takes comes first in the list

## Version 1.4.1

- Make URL reflect the current search filter state for easy copy/paste
- Add colours to search filter for on/off states
- Add button to clear search filter if it there is one
- Fix 'To' being missing on post page
- Fix opening unparsed post links not opening in a new tab
- Fix server address being unreadable on smaller screens

## Version 1.4.0

- Added the ability to link directly to a fitler e.g. `/#/list?filter=[Cyburgh]`
- Loads /r/uhcmatches data with the page to speed up first load for main use case
- Make API calls use pre-parsed game data to reduce calculations on the client side and reduce bandwith (6-700kb -> 120kb)
- Lots of other backend code tweaking/cleanup

##  Version 1.3.0

- Added endpoint for caching Reddit search responses to lower load on Reddit servers

## Version 1.2.1

- Fix time offset not showing in header or post relative times, times should be synced with UTC correctly now

## Version 1.2

- Added a 404 page for direct post links that don't exist
- Now allows viewing of post that are > 30 minutes old and/or in a non 'subscribed' subreddit when using direct post links (/post/xxxxx)
- Fixed using &, < e.t.c. in all sections of titles/content
- Now allows the use of () instead of [] for 'extras' in a title
- OC is now AU
- Added settings import/export pages
- Added a sound effect to go along with notifications that can be toggled in the settings
- Added timezone 'autodetect' for first visit as well as a small warning when not using the detected one
- Fixed some links that did not allow opening in new tab/copy link
- Fixed 'unparsed' posts not opening in a new tab
- Small CSS/JS updates/improvements

## Version 1.1

- *General*
    - New styling of all pages
    - Can now configure/filter blocked hosts
    - Faster startup
    - New page to show all post details by clicking the game title
    - Hovering over the clock now shows the time offset from the server

- *Post list*
    - New enter/exit animation
    - Shows unparsed posts in a dropdown if there is any
    - Clicking on the post title takes you to the post page instead of the Reddit post
    - Added new filter to choose to show blocked hosts
    - Fixed querying Reddit twice on initial load
    - Removed the server IP address and moved it to the post page
    - Allow dismissing of the notifications notification
    - gamemode/team type filters show up alphabetically
    - Clicking on a post no longer collapses to show the markdown

- *Generator*
    - Now disallows the use of the default template
    - Better feedback when adding/removing extras/scenarios

- *Template Editor*
    - New default template based on Helio
    - Now disallows editing of the default template, default template can be copied as a base for new templates
    - Default template can now be updated with future udpates

- *Settings*
    - New settings for managing blocked/favourite hosts
    - New slider for notifications
    - Can turn on notifications on settings page now

- *Misc*
    - Changed formatting of notification times (xx:xx:xx => xh xm)
    - Added list of bundled front end libraries to the about page
    - RIP Pen Font
    - Better sync to the server for clock time
    - New build system fixes some iPads not working
    - Some rare initial load bugs fixed
