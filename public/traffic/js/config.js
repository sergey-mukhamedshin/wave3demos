
var Config = {
	version: "2.0.0150",
	language: 'en-CA',
	mapApiClientId: '',
	defaultLocation: { lat: 43.664395, lng: -79.382401 }, // Toronto
	detectClientLocationByIp: true,
	serverUrl: 'http://wave3demos.herokuapp.com/traffic/',
	minimumAddressLengthToSearch: 3,
	lightColor: {
		green: 1.2,
		yellow: 1.6,
		red: Infinity
	},
	trafficConditions: {
		below10km: {
			good: 1.25,
			busy: 1.75,
			slow: 2
		},
		from10to50km: {
			good: 1.25,
			busy: 1.75,
			slow: 1.9
		},
		from50to100km: {
			good: 1.2,
			busy: 1.45,
			slow: 1.8
		},
		above100km: {
			good: 1.15,
			busy: 1.4,
			slow: 1.7
		}
	},
	logLevel: 'debug'
};
