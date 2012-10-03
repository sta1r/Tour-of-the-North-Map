$(document).ready(function() {
	
	// VARIABLES
	var pLocation;	
	var initialLocation = new google.maps.LatLng(54.20597041662376, -1.812744140625); // map center
   	var myOptions = {
	 	zoom: 9,
		center: initialLocation,
	 	mapTypeId: google.maps.MapTypeId.TERRAIN,
		scrollwheel: false
	};
	var map = new google.maps.Map($("#map_canvas")[0], myOptions);
	var infoWindow = new google.maps.InfoWindow({
		content: '',
		maxWidth: 400
	});
	var loader = $('#loading');
	var KmlLayerOptions = {
		preserveViewport: true
	}
	
	// FUNCTIONS
	function buildInfoWindow(map, data, userID, itemID, itemTitle, photoURL) {
		if(data.stat != 'fail') {
			var marker = new google.maps.Marker({
				position: new google.maps.LatLng(data.photo.location.latitude, data.photo.location.longitude),
				map: map,
				icon: 'img/photo.png'
			});
		}

		// build URLs for each image and author on flickr.com
		var flickrURL = 'http://www.flickr.com/photos/' + userID + '/' + itemID + '/';
		var authorURL = 'http://www.flickr.com/photos/' + userID + '/';
		
		// build the window contents
		var contentString = '<div class="infowindow"><a href="' + flickrURL + '" target="_blank"><img src="' + photoURL + '"></a><p>' + itemTitle + ' by <a href="' + authorURL + '">' + userID + '</a></p></div>';

		google.maps.event.addListener(marker, 'click', function() { 
			infoWindow.open(map,marker);
			infoWindow.setContent(contentString);	
		});
	}

	
	function addTweetMarker(data) {
		// if tweet has coordinates, create the marker
		if (data.coordinates) {
			var marker = new google.maps.Marker({
		    		position: new google.maps.LatLng(data.geo.coordinates[0], data.geo.coordinates[1]),
		    		map: map,
					icon: 'img/friends.png'
		  	});

			// build the window contents
			var contentString = '<h3>' + data.user.screen_name + '</h3>' + '<p>' + data.text + '</p>';
	
			google.maps.event.addListener(marker, 'click', function() { 
				//map.setCenter(new google.maps.LatLng(25.2644444, 55.3116667));
				//map.setCenter(this);
				infoWindow.open(map,marker);
				infoWindow.setContent(contentString);	
	    	});
		}	
	}
	

/* PHASE 1: set up the KML layers */
	
	loader.text('Loading KML layers');
	// the file URL parameter rand= is a hack to ensure Google Maps always fetches the newest version of the KML file (remove for production)
	var trackLayer1 = new google.maps.KmlLayer('http://strangerpixel.s3.amazonaws.com/tracks/day1.kml', KmlLayerOptions);
	var trackLayer2 = new google.maps.KmlLayer('http://strangerpixel.s3.amazonaws.com/tracks/day2.kml', KmlLayerOptions); 
	var trackLayer3 = new google.maps.KmlLayer('http://strangerpixel.s3.amazonaws.com/tracks/day3.kml', KmlLayerOptions);  
	var trackLayer4 = new google.maps.KmlLayer('http://strangerpixel.s3.amazonaws.com/tracks/day4.kml', KmlLayerOptions);
	var trackLayer5 = new google.maps.KmlLayer('http://strangerpixel.s3.amazonaws.com/tracks/day5.kml', KmlLayerOptions);
	
	trackLayer5.setMap(map);
	trackLayer4.setMap(map);
	trackLayer3.setMap(map);
	trackLayer2.setMap(map);
	trackLayer1.setMap(map);
	
/* PHASE 2: get a combined stream of tweets, downloaded from Twitter immediately after the trip */

	loader.text('Loading tweets');

	$.getJSON('js/combined.json', function(data) {
		for (index in data) {
			addTweetMarker(data[index]);
			if (index==data.length) loader.text('');
		}
	});

/* PHASE 3: pull photos from Flickr, get their geo-coordinates and add them to the map */

	loader.text('Loading photos');

	// Flickr API Key required for requests of >20 photos 
	var apiKey = '5659e10e7c250c515885e49f7c9da53b';

	//the initial json request to Flickr
	$.getJSON('http://api.flickr.com/services/rest/?&method=flickr.photos.search&api_key=' + apiKey + '&tags=tourofthenorth&has_geo=1&format=json&jsoncallback=?', function(data){
		
		var total = data.photos.total;
				
		// the loop		
		$.each(data.photos.photo, function(i,item){
     	
			//build the url of the photo in order to link to it
	      	var photoURL = 'http://farm' + item.farm + '.static.flickr.com/' + item.server + '/' + item.id + '_' + item.secret + '_m.jpg';
            
			//turn the photo id into a variable
			var photoID = item.id;

			// need to get the user info
			var ownerID = item.owner;

			$.getJSON('http://api.flickr.com/services/rest/?&method=flickr.people.getInfo&api_key=' + apiKey + '&user_id=' + ownerID + '&format=json&jsoncallback=?', function(data){
				
				// add username to the item array
				if (data.person.path_alias) {
					item.user = data.person.path_alias;
				} else {
					item.user = data.person.username._content;
				}	

			});

			//use another ajax request to get the geo location data for the image
			$.getJSON('http://api.flickr.com/services/rest/?&method=flickr.photos.geo.getLocation&api_key=' + apiKey + '&photo_id=' + photoID + '&format=json&jsoncallback=?', function(data){
				
				// now build the infowindow with all the flickr data in it
				buildInfoWindow(map, data, item.user, item.id, item.title, photoURL);

				if (i==(total-1)) loader.remove();
			});			
			
			
		}); // end each loop
		
	}); // end main Flickr JSON request
		
});