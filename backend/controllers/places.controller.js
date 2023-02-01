const HttpError = require('../models/http-error.model');
const { v4: uuidv4 } = require('uuid');
const { validationResult } = require('express-validator');
const getCoordinatesForAddress = require('../util/location');

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

module.exports.getPlaceById = (req, res, next) => {
    const place = DUMMY_PLACES.find(p => p.id === req.params.pid);

    if (!place) {
        return next(new HttpError('Could not find a place for the provided id.', 404));
    }

    res.status(200).json({ place });
};

module.exports.getPlacesByUserId = (req, res, next) => {
    const places = DUMMY_PLACES.filter(p => p.creator === req.params.uid);

    if (!places || places.length === 0) {
        return next(new HttpError('Could not find a place for the provided user id.', 404));
    }

    res.status(200).json({ places });
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

    const createdPlace = {
        id: uuidv4(),
        title: title,
        description: description,
        location: coordinates,
        address: address,
        creator: creator
    };

    DUMMY_PLACES.push(createdPlace);

    res.status(201).json(createdPlace);
};

module.exports.updatePlaceById = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors);
        return next(new HttpError('Bad request.', 400));
    } 

    const { title, description } = req.body;

    const updatedPlace = { ...DUMMY_PLACES.find(p => p.id === req.params.pid) };
    const placeIndex = DUMMY_PLACES.findIndex(p => p.id === req.params.pid);

    if (!updatedPlace) {
        return next(new HttpError('Not found.', 404));
    }

    updatedPlace.title = title;
    updatedPlace.description = description;

    DUMMY_PLACES[placeIndex] = updatedPlace;

    res.status(200).json(updatedPlace);
};

module.exports.deletePlaceById = (req, res, next) => {
    
    const placeId = req.params.pid;
    if (!DUMMY_PLACES.find(p => p.id === placeId)) {
        return next(new HttpError('Not found.', 404));
    }

    DUMMY_PLACES = DUMMY_PLACES.filter(p => p.id !== req.params.pid);
    res.status(200).json({ message: 'Deleted place.' });
};