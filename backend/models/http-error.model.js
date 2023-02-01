class HttpError extends Error {
    constructor(message='An unknown error occurred.', code=500) {
        super(message); // -> add a message property
        this.code = code;
    }
}

module.exports = HttpError;