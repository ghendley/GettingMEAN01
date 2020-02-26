require('dotenv').config();

const request = require('request');
const apiUri = process.env.API_URI;

const formatDistance = (distance) => {
    let thisDistance;
    let unit = 'm';

    if (distance > 1000) {
        thisDistance = parseFloat(distance / 1000).toFixed(1);
        unit = 'km';
    } else {
        thisDistance = Math.floor(distance);
    }
    return thisDistance + ' ' + unit;
};

const renderHomepage = (req, res, responseBody) => {
    let message = null;

    if (!(responseBody instanceof Array)) {
        message = 'API lookup error';
        responseBody = [];
    } else if (!responseBody.length) {
        message = 'No places found nearby';
    }

    res.render('locations-list', {
        title: 'Loc8r - find a place to work with wifi',
        pageHeader: {
            title: 'Loc8r',
            strapline: 'Find places to work with wifi near you!'
        },
        sidebar: 'Looking for wifi and a seat? Loc8r helps you find places to work when out and about. Perhaps with coffee, cake, or a pint? Let Loc8r help you find the place you\'re looking for.',
        locations: responseBody,
        message
    });
};

/* GET 'home' page */
const homeList = (req, res) => {
    const requestOptions = {
        url: `${apiUri}/locations`,
        method: 'GET',
        json: {},
        qs: {
            lng: -96.290120,
            lat: 30.647050,
            maxkm: 20
        }
    };

    request(
        requestOptions,
        (err, {statusCode}, body) => {
            // should submit a pull request; the authors need this rather than [] for error messages to work as described
            let data = null; //[];

            if (statusCode === 200) {
                data = body.map((item) => {
                    item.distance = formatDistance(item.distance);
                    return item;
                });
            }

            renderHomepage(req, res, data);
        }
    );
};

/* GET 'Location info' page */
const locationInfo = (req, res) => {
    res.render('location-info',
        {
            title: 'Starcups',
            pageHeader: {
                title: 'Loc8r',
            },
            sidebar: {
                context: 'is on Loc8r because it has accessible wifi and space to sit down with your laptop and get some work done.',
                callToAction: 'If you\'ve been and you like it - or if you don\'t - please leave a review to help other people just like you.'
            },
            location: {
                name: 'Starcups',
                address: '125 High Street, Reading, RG6 1PS',
                rating: 3,
                facilities: ['Hot drinks', 'Food', 'Premium wifi'],
                coords: {lat: 51.455041, lng: -0.9690884},
                openingTimes: [
                    {
                        days: 'Monday - Friday',
                        opening: '7:00am',
                        closing: '7:00pm',
                        closed: false
                    },
                    {
                        days: 'Saturday',
                        opening: '8:00am',
                        closing: '5:00pm',
                        closed: false
                    },
                    {
                        days: 'Sunday',
                        closed: true
                    }
                ],
                reviews: [
                    {
                        author: 'Simon Holmes',
                        rating: 5,
                        timestamp: '16 July 2013',
                        reviewText: 'What a great place. I can\'t say enough good things about it.'
                    },
                    {
                        author: 'Charlie Chaplin',
                        rating: 3,
                        timestamp: '16 June 2013',
                        reviewText: 'It was okay. Coffee wasn\'t great, but the wifi was fast.'
                    }
                ]
            },
            mapApiKey: process.env.GOOGLE_MAPS_API_KEY
        }
    );
};

/* GET 'Add review' page */
const addReview = (req, res) => {
    res.render('location-review-form',
        {
            title: 'Review Starcups on Loc8r',
            pageHeader: {title: 'Review Starcups'}
        }
    );
};

module.exports = {
    homeList,
    locationInfo,
    addReview
};
