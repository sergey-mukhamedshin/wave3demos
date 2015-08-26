module.exports = function(router){

    var requestPath = '/weather/settings';

    /* Settings */
    router.get(requestPath, function(req, res, next) {
        console.log(requestPath);

        /*
            defaultView: 0, // 0 = My Locations, 1 = Weekly Forecast, 2 = Hourly Forecast
            temperature: 0, // 0 = Celsius, 1 = Fahrenheit
            time: 0, // 0 = AM/PM, 1 = 24-hour
            alerts: 1 // 0 = No, 1 = Yes
        */
        res.json({
            "defaultView": 0,
            "temperature": 0,
            "time": 0,
            "alerts": 1
        });
    });

};