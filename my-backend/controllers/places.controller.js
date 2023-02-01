const HttpError = require('../models/http-error.model');
const { v4: uuidv4 } = require('uuid');
const { validationResult } = require('express-validator');
const getCoordinatesForAddress = require('../util/location');
const Place = require('../models/place.model');

let DUMMY_PLACES = [
    {
        id: 'p1',
        title: 'Empire State Building',
        description: 'One of the most famous sykscrapers in the world!',
        location: {
            lat: 44,
            lng: -73
        },
        address: '20 W 34th St, New York, NY 10001',
        creator: 'u1'
    }
];

module.exports.getPlaceById = async (req, res, next) => {
    const placeId = req.params.pid;

    let place;
    try {
        place = await Place.findById(placeId);
    } catch (error) {
        return next(new HttpError('Something went wrong when trying to find a place.', 500));
    }

    if (!place) {
        return next(new HttpError('Could not find a place for the provided id.', 404));
    }

    res.status(200).json({ place: place.toObject({ getters: true }) });
};

module.exports.getPlacesByUserId = async (req, res, next) => {
    // const places = DUMMY_PLACES.filter(p => p.creator === req.params.uid);

    let places;
    try {
        places = await Place.find({ creator: req.params.uid });
    } catch (error) {
        return next(new HttpError('Something went wrong when trying to find places.', 500));
    }

    if (!places || places.length === 0) {
        return next(new HttpError('Could not find a place for the provided user id.', 404));
    }

    res.status(200).json({ places: places.map(place => place.toObject({ getters: true })) });
};

module.exports.createPlace = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new HttpError('Bad request.', 400));
    }

    const { title, description, address, creator } = req.body;

    let coordinates;
    try {
        coordinates = await getCoordinatesForAddress(address);
    } catch (error) {
        return next(error);
    }

    const createdPlace = new Place({
        title,
        description,
        address,
        location: coordinates,
        image: 'https://upload.wikimedia.org/wikipedia/commons/e/e7/Everest_North_Face_toward_Base_Camp_Tibet_Luca_Galuzzi_2006.jpg',
        creator
    });

    try {
        await createdPlace.save();
    } catch (error) {
        return next(new HttpError('Failed to create place.', 500));
    }

    res.status(201).json(createdPlace);
};

module.exports.updatePlaceById = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors);
        return next(new HttpError('Bad request.', 400));
    }

    const { title, description } = req.body;
    const placeId = req.params.pid;

    let place;
    try {
        place = await Place.findById(placeId);
    } catch (error) {
        return next(new HttpError('Something went wrong when trying to update the place.', 500));
    }

    if (!place) {
        return next(new HttpError('Not found.', 404));
    }

    place.title = title;
    place.description = description;

    try {
        await place.save();
    } catch (error) {
        return next(new HttpError('Something went wrong when trying to update the place.', 500));
    }

    res.status(200).json({ place: place.toObject({ getters: true }) });
};

module.exports.deletePlaceById = (req, res, next) => {

    const placeId = req.params.pid;
    if (!DUMMY_PLACES.find(p => p.id === placeId)) {
        return next(new HttpError('Not found.', 404));
    }

    DUMMY_PLACES = DUMMY_PLACES.filter(p => p.id !== req.params.pid);
    res.status(200).json({ message: 'Deleted place.' });
};