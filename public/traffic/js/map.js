(function () {
	'use strict';

	angular.module('map', ['loader']).service('map', ['$timeout', '$window', '$q', 'core', 'loader', 'console',
		function ($timeout, $window, $q, core, loader, console) {
			function loadApi() {
				var deferred = $q.defer();
				var callback = 'onMapApiLoaded';

				$window[callback] = function () {
					console.info('map API ready');
					$timeout(deferred.resolve);
				};

				var apiUrl = 'http://maps.googleapis.com/maps/api/js' +
					'?client=' + Config.mapApiClientId +
					'&language=' + Config.language.split('-')[0] +
					'&region=CA&sensor=false&callback=' + callback;

				loader.loadScript(apiUrl).then(null, function () {
					$timeout(deferred.reject);
				});

				return deferred.promise;
			}

			var overlay;
			var map, mapOptions, defaultLocation, geocoder, directionsService, trafficLayer;

			function initialize(mapContainer, onZoomChanged, onBoundsChanged) {
				if (mapContainer) {
					mapOptions = {
						zoom: 14,
						minZoom: 10,
						maxZoom: 19,
						mapTypeId: google.maps.MapTypeId.ROADMAP,
						disableDefaultUI: true
					};
					map = new google.maps.Map(mapContainer, mapOptions);

					overlay = new google.maps.OverlayView();
					overlay.draw = function () { };
					overlay.setMap(map);

					google.maps.event.addListener(map, 'zoom_changed', function () {
						if (onZoomChanged) {
							onZoomChanged(map.getZoom());
						}
					});

					google.maps.event.addListener(map, 'bounds_changed', function () {
						if (onBoundsChanged)
							onBoundsChanged();
					});

					trafficLayer = new google.maps.TrafficLayer();
					enableTraffic();
				}

				/*defaultLocation = getLocation(Config.defaultLocation.lat, Config.defaultLocation.lng);

				if (mapContainer)
					setCenter(defaultLocation);*/

				geocoder = new google.maps.Geocoder();
				directionsService = new google.maps.DirectionsService();
			}

			function getLocation(lat, lng) {
				return new google.maps.LatLng(lat, lng);
			}

			function getCenter(location) {
				return map.getCenter();
			}

			function setCenter(location) {
				map.setCenter(location);
			}

			function zoomIn() {
				var zoom = map.getZoom();
				if (zoom < mapOptions.maxZoom)
					map.setZoom(zoom + 1);
			}

			function zoomOut() {
				var zoom = map.getZoom();
				if (zoom > mapOptions.minZoom)
					map.setZoom(zoom - 1);
			}

			var OPTIMAL_VIEW_LAT_PADDING = 0.022;
			var OPTIMAL_VIEW_LNG_PADDING = 0.03;

			function zoomBestFit(bounds) {
				if (bounds instanceof google.maps.LatLng) {
					bounds = new google.maps.LatLngBounds(
						getLocation(bounds.lat() - OPTIMAL_VIEW_LAT_PADDING, bounds.lng() - OPTIMAL_VIEW_LNG_PADDING),
						getLocation(bounds.lat() + OPTIMAL_VIEW_LAT_PADDING, bounds.lng() + OPTIMAL_VIEW_LNG_PADDING));
				}
				map.fitBounds(bounds);
			}

			var PAN_STEP = 30;

			var directions = {
				UP: { x: 0, y: -PAN_STEP },
				RIGHT: { x: PAN_STEP, y: 0 },
				DOWN: { x: 0, y: PAN_STEP },
				LEFT: { x: -PAN_STEP, y: 0 },
			};

			function panTo(direction) {
				map.panBy(direction.x, direction.y);
			}

			function addMarker(location, imageUrl, markerSize) {
				var image = {
					url: imageUrl,
					size: new google.maps.Size(markerSize, markerSize),
					scaledSize: new google.maps.Size(markerSize, markerSize)
				};

				return new google.maps.Marker({
					map: map,
					position: location,
					icon: image
				});
			}

			function removeMarker(marker) {
				if (marker)
					marker.setMap(null);
			}

			function formatPolyline(polyline, settings) {
				if (polyline) {
					var options = {};

					if ('color' in settings)
						options.strokeColor = settings.color;
					if ('opacity' in settings)
						options.strokeOpacity = settings.opacity;
					if ('weight' in settings)
						options.strokeWeight = settings.weight;

					polyline.setOptions(options);
				}
			}

			function removePolyline(polyline) {
				if (polyline)
					polyline.setMap(null);
			}

			function geocode(address) {
				var deferred = $q.defer();

				var request = {
					address: address,
					bounds: new google.maps.LatLngBounds(defaultLocation, defaultLocation),
					region: 'CA'
					//, componentRestrictions: { country: 'CA' }
				};

				geocoder.geocode(request, function (results, status) {
					$timeout(function () {
						var locations = [];
						switch (status) {
							case google.maps.GeocoderStatus.OK:
								for (var i = 0; i < results.length; ++i) {
									locations.push({
										name: results[i].formatted_address,
										location: results[i].geometry.location
									});
								}
								deferred.resolve(locations);
								break;
							case google.maps.GeocoderStatus.ZERO_RESULTS:
								deferred.resolve(locations);
								break;
							default:
								deferred.reject();
						}
					});
				});

				return deferred.promise;
			}

			function findRoutes(points) {
				var deferred = $q.defer();

				var origin = points[0];
				var destination = points[points.length - 1];
				var waypoints = [];

				for (var i = 1; i < points.length - 1; ++i)
					waypoints.push({ location: points[i], stopover: false });

				var request = {
					origin: origin,
					destination: destination,
					waypoints: waypoints,
					optimizeWaypoints: true,
					// avoidTolls: true,
					// avoidHighways: true,
					durationInTraffic: true, // available to business customers only
					provideRouteAlternatives: true,
					travelMode: google.maps.TravelMode.DRIVING
				};

				directionsService.route(request, function (response, status) {
					$timeout(function () {
						var routes = [];
						switch (status) {
							case google.maps.DirectionsStatus.OK:
								for (var i = 0; i < response.routes.length; ++i) {
									var path = response.routes[i].overview_path;
									var waypoints = [];

									if (path.length > 2) {
										var step = (path.length - 2) / 8; // 23, if business customer
										var lastIndex = 0;

										for (var m = step / 2; m < path.length; m += step) {
											var k = Math.round(m);
											if (k != lastIndex) {
												waypoints.push(path[k]);
												lastIndex = k;
											}
										}
									}

									var legs = response.routes[i].legs;
									var duration = 0;
									var durationInTraffic = 0;
									var distance = 0;

									for (var j = 0; j < legs.length; ++j) {
										if (duration !== undefined) {
											if (legs[j].duration)
												duration += legs[j].duration.value; // seconds
											else
												duration = undefined;
										}

										if (durationInTraffic !== undefined) {
											if (legs[j].duration_in_traffic)
												durationInTraffic += legs[j].duration_in_traffic.value; // seconds
											else
												durationInTraffic = undefined;
										}

										if (distance !== undefined) {
											if (legs[j].distance)
												distance += legs[j].distance.value; // meters
											else
												distance = undefined;
										}
									}

									routes.push({
										name: response.routes[i].summary,
										path: path,
										points: waypoints,
										bounds: response.routes[i].bounds,
										duration: duration ? Math.round(duration / 60) : undefined,
										durationInTraffic: durationInTraffic ? Math.round(durationInTraffic / 60) : undefined,
										distance: distance ? Math.round(distance / 100) / 10 : undefined
									});
								}
								deferred.resolve(routes);
								break;
							case google.maps.DirectionsStatus.ZERO_RESULTS:
								deferred.resolve(routes);
								break;
							default:
								deferred.reject(status);
						}
					});
				});

				return deferred.promise;
			}

			function showRoute(route) {
				return new google.maps.Polyline({
					map: map,
					path: route.path,
					geodesic: true,
					strokeColor: '#0000ff',
					strokeOpacity: 1,
					strokeWeight: 3
				});
			}

			function getBestRouteIndex(routes) {
				// TBD: selection criteria
				return 0;
			}

			function enableTraffic() {
				trafficLayer.setMap(map);
			}

			function disableTraffic() {
				trafficLayer.setMap(null);
			}

			function fromLatLngToContainerPixel(position) {
				return overlay.getProjection().fromLatLngToContainerPixel(position)
			}

			return {
				loadApi: loadApi,
				initialize: initialize,
				getLocation: getLocation,
				getCenter: getCenter,
				setCenter: setCenter,
				zoomIn: zoomIn,
				zoomOut: zoomOut,
				zoomBestFit: zoomBestFit,
				panTo: panTo,
				directions: directions,
				addMarker: addMarker,
				removeMarker: removeMarker,
				formatPolyline: formatPolyline,
				removePolyline: removePolyline,
				geocode: geocode,
				findRoutes: findRoutes,
				showRoute: showRoute,
				getBestRouteIndex: getBestRouteIndex,
				enableTraffic: enableTraffic,
				disableTraffic: disableTraffic,
				fromLatLngToContainerPixel: fromLatLngToContainerPixel,
				MAX_ZINDEX: 1000000
			};
		}]);
})();