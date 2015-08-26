module.exports = function(router){

    var requestPath = '/weather/hourly';

    /* Hourly */
    router.get(requestPath, function(req, res, next) {
        console.log(requestPath);

        var hourly = []
        for (var x = 0; x < 10; x++){
            hourly.push({
                "hour": x,
                "outlook": 7,
                "temperature": 12,
                "feelsLike": 11,
                "humidity": 20,
                "pop": 10
            });
        }
        res.json(hourly);

    });

};
