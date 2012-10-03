[Tour of the North Map](http://www.legsfeelingnopressure.com/totn-map/index.html)
=================

This map was built as a companion page to the [Tour of the North microsite](http://www.legsfeelingnopressure.com/the-tour-of-the-north/). 


Route data
----------

* The map displays the route of the trip using KML data stored in 5 separate files and hosted on Amazon S3 for fast loading. 
* The KML data was generated by a GPS tracking iPhone app called [GPS Motion-X](http://gps.motionx.com/iphone/overview/).


Tweets
------

* Geo-located tweets are loaded from a single locally-stored JSON file.
* There are tweets from three different riders on the trip.
* My intention was always to plot geolocated tweets on the map live, as we made our way from coast to coast - but I didn't have time to build this in advance, so after the trip I pulled the tweet data and consolidated it in one file.


Photos
------

* Photos from the trip are sourced from Flickr, tagged 'tourofthenorth' and geo-tagged, either automatically or manually using Flickr's map tool.
* Each image is plotted on the route, and when clicked opens an info window displaying a link to the original photo on Flickr and the author's own profile. 


Further info
------------

Check out [this blog post](http://www.strangerpixel.com/2011/09/building-the-tour-of-the-north-microsite/) for more info on how I built the page.
