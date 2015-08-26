module.exports = function(router) {

    var requestPath = '/traffic/myRoutes';

    /* MyLocations */
    router.get(requestPath, function (req, res, next) {
        console.log(requestPath);

        res.json({
            "routes": [
                {
                    "points":[
                        {
                            "lat": 43.683157,
                            "lng": -79.458289
                        }
                    ],
                    "icon": 1,
                    "name": "Store"
                },
                {
                    "points":[
                        {
                            "lat": 43.683147,
                            "lng": -79.458289
                        }
                    ],
                    "icon": 1,
                    "name": "Work"
                },
                {
                    "points":[
                        {
                            "lat": 43.598046,
                            "lng": -79.516726
                        }
                    ],
                    "icon": 3,
                    "name": "School"
                },

            ]
        });
    });

};