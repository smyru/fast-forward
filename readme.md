# Fast Forward

The extension implements quick predictive navigation feature as
observed in the old beloved Opera known as Fast Forward.

It is developed and tested in Vivaldi and Opera browsers. It is
likely compatible with bare Chromium too though untested.

## Usage

Hitting Space at the end of current page will load next page
if it was detected without need to locating buttons, next links
etc.

A user can use Shift+x anywhere as shortcut to load next page right
away without reading till the end of current page.

## Implemented features:

Rel link (next, up, index) tag observer
* Content script requiring browsing sites access

Semantic links with specific inner text content or titles
* Special case: seeks for older / previous (historical next) links
  for sinking content use case, think blogs.
* This part has poor localization coverage though
* Also requires browsing sites access

Space at the end of current page to load next detected page.
Shift+x anywhere as shortcut to load next page right away.

## Licence

Simplified BSD licence
