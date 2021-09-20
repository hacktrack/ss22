_me = frm_gmap.prototype;

function frm_gmap() {};

_me.__constructor = function (sAddress, callback_function) {
	this._title('MAP::MAP');
	this._size(600, 400, true);

	this._draw('frm_gmap', 'main');

	this._init_address = sAddress;

	this._initGooglePlacesAutocomplete(GWOthers.getItem('EXTERNAL_SETTINGS', 'google_maps_api_key'));

	if(callback_function) {
		this._getAnchor('callback').removeAttribute('hidden');
		this.callback._onclick = function() {
			callback_function(this.address._value());
			this._destruct();
		}.bind(this);
	}
};

_me._initGooglePlacesAutocomplete = function (API_KEY) {
	if (!API_KEY) {
		return;
	}

	if (!document.getElementById('googleapis')) {
		document.head.appendChild(mkElement('script', {
			id: 'googleapis',
			src: 'https://maps.googleapis.com/maps/api/js?key=' + API_KEY + '&libraries=places&callback=' + this._pathName + '.__googlePlacesAutocompleteCallback',
		}));
	} else {
		this.__googlePlacesAutocompleteCallback();
	}
};

_me.__googlePlacesAutocompleteCallback = function () {

	function setPlace(place) {
		infowindow.close();
		marker.setVisible(false);
		if (!place.geometry) {
			return console.log("No details available for input:", place.name);
		}

		if (place.geometry.viewport) {
			map.fitBounds(place.geometry.viewport);
		} else {
			map.setCenter(place.geometry.location);
			map.setZoom(17);
		}
		marker.setPosition(place.geometry.location);
		marker.setVisible(true);

		var place_icon = infowindowContent.querySelector('.place-icon');
		if(place.icon) {
			place_icon.src = place.icon;
			place_icon.removeAttribute('hidden');
		} else {
			place_icon.setAttribute('hidden', '');
		}
		var place_name = infowindowContent.querySelector('.place-name');
		if(place.name) {
			place_name.textContent = place.name;
			place_name.removeAttribute('hidden');
		} else {
			place_name.setAttribute('hidden', '');
		}
		var place_address = infowindowContent.querySelector('.place-address');
		if(place.formatted_address) {
			place_address.textContent = place.formatted_address;
			place_address.removeAttribute('hidden');
		} else {
			place_address.setAttribute('hidden', '');
		}
		infowindow.open(map, marker);
	}

	var map = new google.maps.Map(this._getAnchor('map'));

	var autocomplete = new google.maps.places.Autocomplete(this.address.__eIN);
	autocomplete.bindTo('bounds', map);

	var infowindow = new google.maps.InfoWindow();
	var infowindowContent = this._getAnchor('infowindow-content');
	infowindow.setContent(infowindowContent);
	
	var marker = new google.maps.Marker({
		map: map,
		anchorPoint: new google.maps.Point(0, -29)
	});

	google.maps.event.addListener(marker, 'click', function () {
		infowindow.open(map, marker);
	});

	autocomplete.addListener('place_changed', function () {
		setPlace(autocomplete.getPlace());
	});

	if (this._init_address) {
		this.address._value(this._init_address);
		var geocoder = new google.maps.Geocoder();
		geocoder.geocode({
			'address': this._init_address
		}, function (results, status) {
			if (status == google.maps.GeocoderStatus.OK) {
				if (status != google.maps.GeocoderStatus.ZERO_RESULTS) {
					setPlace(results[0]);
					infowindow.open(map, marker);
				} 
			} else {
				console.log("Geocode was not successful for the following reason:", status);
			}
		});
	}
};