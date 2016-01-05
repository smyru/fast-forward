# Fast Forward

This is an Opera extension - likely compatible with bare Chromium as well,
though untested - that implements quick predictive navigation feature
of the old beloved Opera known as Fast Forward.

## Implemented features:

Rel link (next, up, index) tag observer
Semantic anchor tags observer
* Content script requiring browsing sites access

Seeks for links with specific inner text content or titles
* Special case: seeks for older / previous (historical next) links
  for sinking content use case, think blogs.
* This part has poor localization coverage though
* Also requires browsing sites access

Space at the end of current page to load next detected page.
Shift+x anywhere as shortcut to load next page right away.

## Licence

Simplified BSD licence
