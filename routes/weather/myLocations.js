module.exports = function(router) {

    var requestPath = '/weather/myLocations';

    /* MyLocations */
    router.get(requestPath, function (req, res, next) {
        console.log(requestPath);

        res.json({
            "defaultLocation": 0,
            "locations": [
                {
                    "id": "00000.1.71063",
                    "name": "Toronto"
                },
                {
                    "id": "00000.41.71508",
                    "name": "Montreal"
                },
                {
                    "id": "61259.1.99999",
                    "name": "Vancouver"
                },
                {
                    "id": "10001.5.99999",
                    "name": "New York"
                },
                {
                    "id": "11201.1.99999",
                    "name": "Chicago"
                }
            ]
        });
    });

};