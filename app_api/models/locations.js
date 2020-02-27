const mongoose = require('mongoose');

// is it normal to suffix these names with Schema?
const openingTimeSchema = new mongoose.Schema({
    days: {
        type: String,
        required: true
    },
    // TODO the book recommends storing time as minutes after midnight, so maybe try that later
    opening: String,
    closing: String,
    closed: {
        type: Boolean,
        required: true
    }
});

const reviewSchema = new mongoose.Schema({
    author: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 0,
        max: 5
    },
    reviewText: {
        type: String,
        required: true
    },
    createdOn: {
        type: Date,
        default: Date.now
    }
});

const locationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    address: String,
    coordinates: {
        type: {type: String},
        coordinates: [Number]
    },
    rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    facilities: [String],
    openingTimes: [openingTimeSchema],
    reviews: [reviewSchema]
});
locationSchema.index({coordinates: '2dsphere'});

mongoose.model('Location', locationSchema);
