module.exports = function(router){

    var requestPath = '/traffic';

    router.get(requestPath, function(req, res, next) {
        console.log(requestPath);

        res.sendfile('public/traffic/index.html');
    });

};
