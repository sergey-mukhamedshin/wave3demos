module.exports = function(router){

    var requestPath = '/weather';

    router.get(requestPath, function(req, res, next) {
        console.log(requestPath);

        res.sendfile('public/weather/index.html');
    });

};
