const HttpError = require('../models/http-error.model');

const axios = require('axios').default;

const API_KEY = 'AIzaSyDn88mPwcnRzwKaVZBMTSvkE4awXUcqcNc';

const getCoordinatesForAddress = async (address) => {
    const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURI(address)}&key=${API_KEY}`);

    const data = response.data;
    if (!data || data.status === 'ZERO_RESULTS') {
        const error = new HttpError('Could not find location for the specified address.', 404);
        throw error;
    }

    return data.results[0].geometry.location;
};

module.exports = getCoordinatesForAddress;