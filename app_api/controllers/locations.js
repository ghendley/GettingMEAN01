const mongoose = require('mongoose');
const Location = mongoose.model('Location');

const locationsListByDistance = async (req, res) => {
    const longitude = parseFloat(req.query.lng);
    const latitude = parseFloat(req.query.lat);
    const maxKm = parseFloat(req.query.maxkm);

    const near = {
        type: 'Point',
        coordinates: [longitude, latitude]
    };
    const geoOptions = {
        distanceField: 'distance.calculated',
        spherical: true,
        maxDistance: (maxKm || 100) * 1000.0
    };

    if (!longitude || !latitude) {
        return res
            .status(404)
            .json({message: 'lng and lat query parameters are required'});
    }

    try {
        const results = await Location.aggregate([
            {
                $geoNear: {
                    near,
                    ...geoOptions
                }
            },
            {
                $limit: 10
            }
        ]);

        // TODO book suggests cutting this out to its own method, but there's so much more refactoring worth doing if I'm going to bother with that
        const locations = results.map(result => {
            return {
                id: result._id,
                name: result.name,
                address: result.address,
                rating: result.rating,
                facilities: result.facilities,
                distance: `${result.distance.calculated.toFixed()}m`
            };
        });

        res
            .status(200)
            .json(locations);
    } catch (err) {
        res
            .status(404)
            .json(err);
    }
};

const locationsCreate = (req, res) => {
    Location.create({
            name: req.body.name,
            address: req.body.address,
            facilities: req.body.facilities.split(','),
            coordinates: {
                type: 'Point',
                coordinates: [
                    parseFloat(req.body.lng),
                    parseFloat(req.body.lat)
                ]
            },
            openingTimes: [
                {
                    days: req.body.days1,
                    opening: req.body.opening1,
                    closing: req.body.closing1,
                    closed: req.body.closed1
                },
                {
                    days: req.body.days2,
                    opening: req.body.opening2,
                    closing: req.body.closing2,
                    closed: req.body.closed2
                }
            ]
        },
        (err, location) => {
            if (err) {
                res
                    .status(400)
                    .json(err);
            } else {
                res
                    .status(201)
                    .json(location);
            }
        });
};

const locationsReadOne = (req, res) => {
    Location
        .findById(req.params.locationid)
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
            res
                .status(200)
                .json(location);
        });
};

// TODO
const locationsUpdateOne = (req, res) => {
    res
        .status(200)
        .json({status: 'success'});
};

// TODO
const locationsDeleteOne = (req, res) => {
    res
        .status(200)
        .json({status: 'success'});
};

module.exports = {
    locationsListByDistance,
    locationsCreate,
    locationsReadOne,
    locationsUpdateOne,
    locationsDeleteOne
};
