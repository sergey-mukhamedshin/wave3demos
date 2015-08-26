module.exports = function(config) {
	config.set({
		basePath: '../',
		frameworks: ['jasmine'],
		reporters: ['progress'],
		browsers: ['PhantomJS'],

		autoWatch: false,
		singleRun: true,
		colors: true,

		files: [
			'../../cdn/ztv.js',

			'test/unit/**/*.js'
		],

		proxies: {
			'/locales/': 'http://localhost:8888/test/locales/'
		}
	});
};
