const mongoose = require('mongoose');
const Location = mongoose.model('Location');

function setAverageRating(location) {
    if (location.reviews && location.reviews.length > 0) {
        const count = location.reviews.length;
        const total = location.reviews.reduce((acc, {rating}) => {
            return acc + rating;
        }, 0);

        location.rating = parseInt(total / count, 10);
        location.save(err => {
            if (err) {
                console.log(err);
            } else {
                console.log(`Average rating updated to ${location.rating}`);
            }
        });
    }
}

const updateAverageRating = (locationId) => {
    Location.findById(locationId)
        .select('rating reviews')
        .exec((err, location) => {
            if (!err) {
                setAverageRating(location);
            }
        });
};

// Taken from the book; handles too much
const addReview = (req, res, location) => {
    if (!location) {
        return res.status(404).json({message: 'location not found'});
    }

    const {author, rating, reviewText} = req.body;
    location.reviews.push({author, rating, reviewText});
    location.save((err, location) => {
        if (err) {
            return res.status(400).json(err);
        }
        updateAverageRating(location._id);
        const thisReview = location.reviews.slice(-1).pop();
        return res.status(201).json(thisReview);
    });
};

const reviewsCreate = (req, res) => {
    const locationId = req.params.locationid;

    if (!locationId) {
        return res.status(404).json({message: 'locationid required'});
    }

    Location
        .findById(locationId)
        .select('reviews')
        .exec((err, location) => {
            if (err) {
                return res.status(400).json(err)
            } else {
                return addReview(req, res, location);
            }
        });
};

const reviewsReadOne = (req, res) => {
    Location
        .findById(req.params.locationid)
        .select('name reviews')
        .exec((err, location) => {
            if (!location) {
                return res.status(404).json({message: 'location not found'});
            } else if (err) {
                return res.status(404).json(err);
            } else if (!(location.reviews && location.reviews.length > 0)) {
                return res.status(404).json({message: 'no reviews found'});
            }

            const review = location.reviews.id(req.params.reviewid);
            if (!review) {
                return res.status(400).json({message: 'review not found'});
            }

            const response = {
                location: {
                    name: location.name,
                    id: req.params.locationid
                },
                review
            };
            return res.status(200).json(response);
        });
};

const reviewsUpdateOne = (req, res) => {
    if (!req.params.locationid || !req.params.reviewid) {
        return res.status(404).json({message: 'locationid and reviewid are required'});
    }

    Location
        .findById(req.params.locationid)
        .select('reviews')
        .exec((err, location) => {
            if (!location) {
                return res.status(404).json({message: 'location not found'});
            } else if (err) {
                return res.status(400).json(err);
            }

            if (!location.reviews || location.reviews.length === 0) {
                return res.status(404).json({message: 'no review to update'});
            }

            const thisReview = location.reviews.id(req.params.reviewid);
            if (!thisReview) {
                return res.status(404).json({message: 'review not found'});
            } else {
                thisReview.author = req.body.author;
                thisReview.rating = req.body.rating;
                thisReview.reviewText = req.body.reviewText;

                location.save((err, location) => {
                    if (err) {
                        return res.status(404).json(err);
                    } else {
                        updateAverageRating(location._id);
                        return res.status(200).json(thisReview);
                    }
                });
            }
        });
};

const reviewsDeleteOne = (req, res) => {
    const {locationId, reviewId} = req.params;

    if (!locationId || !reviewId) {
        return res.status(404).json({message: 'locationid and reviewid are required'});
    }

    Location
        .findById(locationId)
        .select('reviews')
        .exec((err, location) => {
            if (!location) {
                return res.status(404).json({message: 'location not found'});
            } else if (err) {
                return res.status(400).json(err);
            } else if (!location.reviews || location.reviews.length === 0) {
                return res.status(404).json({message: 'no reviews found to delete'});
            } else if (!location.reviews.id(reviewId)) {
                return res.status(404).json({message: 'review not found'});
            }

            location.reviews.id(reviewId).remove();
            location.save(err => {
                if (err) {
                    return res.status(404).json(err);
                } else {
                    updateAverageRating(location._id);
                    return res.status(204).json(null);
                }
            })
        });
};

module.exports = {
    reviewsCreate,
    reviewsReadOne,
    reviewsUpdateOne,
    reviewsDeleteOne
};
