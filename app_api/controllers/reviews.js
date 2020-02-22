const mongoose = require('mongoose');
const Location = mongoose.model('Location');

// TODO
const reviewsCreate = (req, res) => {
    res
        .status(200)
        .json({status: 'success'});
};

// TODO This is ridiculously ugly code for a simple review GETter
const reviewsReadOne = (req, res) => {
    Location
        .findById(req.params.locationid)
        .select('name reviews')
        .exec((err, location) => {
            if (!location) {
                return res
                    .status(404)
                    .json({message: 'location not found'});
            } else if (err) {
                return res
                    .status(404)
                    .json(err);
            }
            if (location.reviews && location.reviews.length > 0) {
                const review = location.reviews.id(req.params.reviewid);
                if (!review) {
                    return res
                        .status(400)
                        .json({message: 'review not found'});
                } else {
                    const response = {
                        location: {
                            name: location.name,
                            id: req.params.locationid
                        },
                        review
                    };
                    return res
                        .status(200)
                        .json(response);
                }
            } else {
                return res
                    .status(404)
                    .json({message: 'no reviews found'});
            }
        });
};

// TODO
const reviewsUpdateOne = (req, res) => {
    res
        .status(200)
        .json({status: 'success'});
};

// TODO
const reviewsDeleteOne = (req, res) => {
    res
        .status(200)
        .json({status: 'success'});
};

module.exports = {
    reviewsCreate,
    reviewsReadOne,
    reviewsUpdateOne,
    reviewsDeleteOne
};
