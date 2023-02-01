const express = require('express');
const app = express();
const HttpError = require('./models/http-error.model');

app.use(express.json());

app.use('/api/places', require('./routes/places.routes'));
app.use('/api/users', require('./routes/users.routes'));

app.use((req, res, next) => {
    return next(new HttpError('Could not find this route.', 404));
});

app.use((error, req, res, next) => {
    if (res.headerSent) {
        return next(error);
    }

    res.status(error.code || 500).json({ message: error.message || 'An unknown error occurred.' });
});

app.listen(5000, () => { console.log('Listening on port 5000'); });