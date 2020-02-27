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

    if ((!longitude && longitude !== 0) || (!latitude && latitude !== 0)) {
        return res.status(404).json({message: 'lng and lat query parameters are required'});
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

        const locations = results.map(result => {
            return {
                _id: result._id,
                name: result.name,
                address: result.address,
                rating: result.rating,
                facilities: result.facilities,
                distance: `${result.distance.calculated.toFixed()}`
            };
        });

        return res.status(200).json(locations);
    } catch (err) {
        return res.status(404).json(err);
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
                return res.status(400).json(err);
            } else {
                return res.status(201).json(location);
            }
        });
};

const locationsReadOne = (req, res) => {
    Location
        .findById(req.params.locationid)
        .exec((err, location) => {
            if (!location) {
                return res.status(404).json({message: 'location not found'});
            } else if (err) {
                return res.status(404).json(err);
            }
            return res.status(200).json(location);
        });
};

const locationsUpdateOne = (req, res) => {
    if (!req.params.locationid) {
        return res.status(404).json({message: 'locationid is required'});
    }

    Location
        .findById(req.params.locationid)
        .select('-reviews -rating')
        .exec((err, location) => {
            if (!location) {
                return res.status(404).json({message: 'locationid not found'});
            } else if (err) {
                return res.status(400).json(err);
            }

            location.name = req.body.name;
            location.address = req.body.address;
            location.facilities = req.body.facilities.split(',');
            location.coordinates = {
                type: 'Point',
                coordinates: [
                    parseFloat(req.body.lng),
                    parseFloat(req.body.lat)
                ]
            };
            location.openingTimes = [{
                days: req.body.days1,
                opening: req.body.opening1,
                closing: req.body.closing1,
                closed: req.body.closed1
            }, {
                days: req.body.days2,
                opening: req.body.opening2,
                closing: req.body.closing2,
                closed: req.body.closed2
            }];

            location.save((err, loc) => {
                if (err) {
                    return res.status(404).json(err);
                } else {
                    return res.status(200).json(loc);
                }
            });
        });
};

const locationsDeleteOne = (req, res) => {
    const {locationId} = req.params;

    if (!locationId) {
        return res.status(404).json({message: 'locationid required'});
    }

    Location
        .findByIdAndRemove(locationId)
        .exec((err) => {
            if (err) {
                return res.status(404).json(err);
            }
            return res.status(204).json(null);
        });
};

module.exports = {
    locationsListByDistance,
    locationsCreate,
    locationsReadOne,
    locationsUpdateOne,
    locationsDeleteOne
};
