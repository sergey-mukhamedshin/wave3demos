module.exports = function(router){

    var requestPath = '/weather/locationwise';

    /* Locationwise */
    router.get(requestPath, function(req, res, next) {
        console.log(requestPath);

        res.json([
            {
                "location": "00000.1.71063",
                "outlook": 6,
                "temperature": -11,
                "feelsLike": -12,
                "timeZone": -300,
                "alerts":[
                    {
                        "headline": "Heavy fog warning in effect",
                        "description": "Fog conditions - late evening to early morning. Near zero visibility in fog is expected to persist for much of the night. The fog should dissipate Thursday morning. Travel is expected to be extremely hazardous due to reduced visibility. Weather Advisories for fog are issued when near zero visibilities in fog are expected or occurring. Environment Canada meteorologists will update alerts as required, so stay tuned to your local media or Weatheradio. Email reports of severe weather to storm.ontario@ec.gc.ca or tweet with the hashtag #ONStorm.",
                        "language": "en-CA"
                    },
                    {
                        "headline": "Special weather statement in effect",
                        "description": "Rain will develop on Monday and will change over to snow Monday night.\n\nA low pressure system currently over Maine will move across Nova Scotia Monday morning then deepen as it slowly moves south of Newfoundland through Monday and Monday night. Rain associated with this system will spread across much of the island on Monday before changing over to snow through Monday night, with a brief period of freezing rain expected for some regions during the changeover. Generally 2 to 5 centimetres of snow is forecast over Eastern and Central Newfoundland Monday night with additional snowfall accumulations expected on Tuesday. Though current guidance suggests that snowfall amounts will remain below warning criteria, motorists are advised to exercise caution as driving conditions will be more hazardous than usual Monday night into Tuesday.",
                        "language": "fr-CA"
                    },
                ]
            },
            {
                "location": "00000.41.71508",
                "outlook": 1,
                "temperature": -22,
                "feelsLike": -23,
                "timeZone": -300,
                "alerts": [
                    {
                        "headline": "Special weather statement in effect",
                        "description": "Rain will develop on Monday and will change over to snow Monday night.\n\nA low pressure system currently over Maine will move across Nova Scotia Monday morning then deepen as it slowly moves south of Newfoundland through Monday and Monday night. Rain associated with this system will spread across much of the island on Monday before changing over to snow through Monday night, with a brief period of freezing rain expected for some regions during the changeover. Generally 2 to 5 centimetres of snow is forecast over Eastern and Central Newfoundland Monday night with additional snowfall accumulations expected on Tuesday. Though current guidance suggests that snowfall amounts will remain below warning criteria, motorists are advised to exercise caution as driving conditions will be more hazardous than usual Monday night into Tuesday.",
                    },
                ]
            },
            {
                "location": "61259.1.99999",
                "outlook": 2,
                "temperature": -11,
                "feelsLike": -12,
                "timeZone": -480,
                "alerts": []
            },
            {
                "location": "10001.5.99999",
                "outlook": 3,
                "temperature": -11,
                "feelsLike": -12,
                "timeZone": -240,
                "alerts": []
            },
            {
                "location": "11201.1.99999",
                "outlook": 7,
                "temperature": -11,
                "feelsLike": -12,
                "timeZone": -240,
                "alerts": []
            },
        ]);
    });

};
