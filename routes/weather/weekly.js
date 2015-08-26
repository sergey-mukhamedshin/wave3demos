module.exports = function(router){

    var requestPath = '/weather/weekly';

    /* Weekly */
    router.get(requestPath, function(req, res, next) {
        console.log(requestPath);

        var nextDate = new Date();

        var days = [];
        for (var i = 0; i < 7; ++i){
            days.push({
                "date": nextDate.getFullYear() + "/" + nextDate.getMonth() + "/" + nextDate.getDate(),
                "outlook": 1,
                "highTemp": 30 + Math.round(Math.random()*10),
                "lowTemp": 20 + Math.round(Math.random()*10),
                "pop": Math.round(Math.random()*100)
            });

            nextDate.setDate(nextDate.getDate()+ 1);
        }

        res.json(days);
    });

};
