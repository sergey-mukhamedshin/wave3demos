module.exports = function(router){

    var requestPath = '/weather/locationSuggestions';

    /* LocationSuggestions */
    router.get(requestPath, function(req, res, next) {
        console.log(requestPath);

        var suggestions = [
            {"id":"00000.2.06434","name":"Aalst, Belgium"},
            {"id":"00000.20.10836","name":"Aalen, Germany"},
            {"id":"00000.2.06465","name":"Aarschot, Belgium"},
            {"id":"00000.6.06240","name":"Aalsmeer, Netherlands"},
            {"id":"00000.5.06375","name":"Aarle, Netherlands"},
            {"id":"00000.8.10406","name":"Aalten, Netherlands"},
            {"id":"00000.5.06428","name":"Aalter, Belgium"},
            {"id":"00000.2.06633","name":"Aarau, Switzerland"},
            {"id":"00000.6.06450","name":"Aartselaar, Belgium"},
            {"id":"00000.3.06356","name":"Aalburg, Netherlands"},
            {"id":"00000.5.06679","name":"Aadorf, Switzerland"},
            {"id":"00000.2.06626","name":"Aarburg, Switzerland"},
            {"id":"00000.5.06643","name":"Aarwangen, Switzerland"},
            {"id":"00000.5.06636","name":"Aarberg, Switzerland"},
            {"id":"00000.1.04220","name":"Aasiaat, Greenland"},
            {"id":"00000.5.91945","name":"AAA, French Polynesia"},
            {"id":"00000.5.95487","name":"AAB, Australia"},
            {"id":"00000.5.62337","name":"AAC, Egypt"},
            {"id":"00000.2.10609","name":"Aach, Germany"},
            {"id":"00000.1.10501","name":"Aachen, Germany"},
            {"id":"00000.1.40650","name":"Baghdad, Iraq"},
            {"id":"00000.7.98428","name":"Bacoor, Philippines"},
            {"id":"00000.7.64893","name":"Bafoussam, Cameroon"},
            {"id":"00000.6.60393","name":"Bab Ezzouar, Algeria"},
            {"id":"00000.3.26961","name":"Babruysk, Belarus"},
            {"id":"00000.11.08176","name":"Badalona, Spain"},
            {"id":"00000.1.08330","name":"Badajoz, Spain"},
            {"id":"00000.2.40914","name":"Baghlan, Afghanistan"},
            {"id":"00000.3.43060","name":"Badlapur, India"},
            {"id":"00000.3.42282","name":"Bagaha, India"},
            {"id":"00000.3.17030","name":"Bafra, Turkey"},
            {"id":"00000.6.63870","name":"Bagamoyo, Tanzania"},
            {"id":"00000.9.64911","name":"Bafang, Cameroon"},
            {"id":"00000.2.43315","name":"Badagara, India"},
            {"id":"00000.3.84190","name":"Babahoyo, Ecuador"},
            {"id":"00000.1.82460","name":"Bacabal, Brazil"},
            {"id":"00000.1.64920","name":"Bafia, Cameroon"},
            {"id":"00000.2.59065","name":"Babu, China"},
            {"id":"00000.2.96837","name":"Bae, Indonesia"},
            {"id":"00000.1.10325","name":"Bad Salzuflen, Germany"},
            {"id":"00000.1.71265","name":"Toronto, Canada"},
            {"id":"00000.1.16059","name":"Torino, Italy"},
            {"id":"90501.1.99999","name":"Torrance, California"},
            {"id":"00000.130.16289","name":"Torre del Greco, Italy"},
            {"id":"00000.10.47695","name":"Toride, Japan"},
            {"id":"00000.13.08433","name":"Torrevieja, Spain"},
            {"id":"00000.36.08284","name":"Torrent, Spain"},
            {"id":"00000.10.34622","name":"Torez, Ukraine"},
            {"id":"00000.13.03837","name":"Torquay, United Kingdom"},
            {"id":"00000.41.08021","name":"Torrelavega, Spain"},
            {"id":"00000.54.08482","name":"Torremolinos, Spain"},
            {"id":"00000.12.27402","name":"Torzhok, Russia"},
            {"id":"00000.129.16289","name":"Torre Annunziata, Italy"},
            {"id":"06790.1.99999","name":"Torrington, Connecticut"},
            {"id":"00000.1.08238","name":"Tortosa, Spain"},
            {"id":"00000.1.83948","name":"Torres, Brazil"},
            {"id":"00000.12.08433","name":"Torre-Pacheco, Spain"},
            {"id":"00000.71.16118","name":"Tortona, Italy"},
            {"id":"00000.18.08539","name":"Torres Vedras, Portugal"},
            {"id":"00000.30.82895","name":"Toritama, Brazil"}
        ];

        res.json(suggestions);
    });

};
