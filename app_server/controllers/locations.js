require('dotenv').config();

const request = require('request');

/* GET 'home' page */
const homeList = (req, res) => {
    res.render('locations-list', {
        title: 'Loc8r - find a place to work with wifi',
        pageHeader: {
            title: 'Loc8r',
            strapline: 'Find places to work with wifi near you!'
        },
        sidebar: 'Looking for wifi and a seat? Loc8r helps you find places to work when out and about. Perhaps with coffee, cake, or a pint? Let Loc8r help you find the place you\'re looking for.'
    });
};

const renderDetailPage = (req, res, location) => {
    res.render('location-info', {
        title: location.name,
        pageHeader: {
            title: location.name
        },
        sidebar: {
            context: 'is on Loc8r because it has accessible wifi and space to sit down with your laptop and get some work done.',
            callToAction: 'If you\'ve been and you like it - or if you don\'t - please leave a review to help other people just like you.'
        },
        mapApiKey: process.env.GOOGLE_MAPS_API_KEY,
        location
    });
};

const showError = (req, res, status) => {
    let title,
        content;

    if (status === 404) {
        title = '404, page not found';
        content = 'Oh dear. Looks like you can\'t find this page. Sorry.';
    } else {
        title = `${status}, something's gone wrong`;
        content = 'Something, somewhere, has gone just a little bit wrong.';
    }

    res.status(status);
    res.render('generic-text', {
        title,
        content
    });
};

const getLocationInfo = (req, res, callback) => {
    const path = `locations/${req.params.locationid}`;
    const requestOptions = {
        url: `${process.env.API_URI}/${path}`,
        method: 'GET',
        json: {}
    };

    request(
        requestOptions,
        (err, {statusCode}, body) => {
            const data = body;

            if (statusCode === 200) {
                data.coords = {
                    lng: body.coordinates[0],
                    lat: body.coordinates[1]
                };

                callback(req, res, data);
            } else {
                showError(req, res, statusCode);
            }
        }
    );
};

/* GET 'Location info' page */
const locationInfo = (req, res) => {
    getLocationInfo(
        req,
        res,
        (req, res, responseData) => renderDetailPage(req, res, responseData)
    );
};

const renderReviewForm = (req, res, {name}) => {
    res.render('location-review-form', {
        title: `Review ${name} on Loc8r`,
        pageHeader: {title: `Review ${name}`},
        error: req.query.err
    });
};

/* GET 'Add review' page */
const addReview = (req, res) => {
    getLocationInfo(
        req,
        res,
        (req, res, responseData) => renderReviewForm(req, res, responseData)
    );
};

const doAddReview = (req, res) => {
    const locationId = req.params.locationid;
    const path = `locations/${locationId}/reviews`;
    const postData = {
        author: req.body.name,
        rating: parseInt(req.body.rating, 10),
        reviewText: req.body.review
    };
    const requestOptions = {
        url: `${process.env.API_URI}/${path}`,
        method: 'POST',
        json: postData
    };

    if (!postData.author || !postData.rating || !postData.reviewText) {
        res.redirect(`/location/${locationId}/review/new?err=val`);
    } else {
        request(
            requestOptions,
            (err, {statusCode}, {name}) => {
                if (statusCode === 201) {
                    res.redirect(`/location/${locationId}`);
                } else if (statusCode === 400 && name && name === 'ValidationError') {
                    res.redirect(`/location/${locationId}/review/new?err=val`);
                } else {
                    console.log(body);
                    showError(req, res, statusCode);
                }
            }
        );
    }
};

module.exports = {
    homeList,
    locationInfo,
    addReview,
    doAddReview
};
