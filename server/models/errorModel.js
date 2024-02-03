class HttpError extends Error {
    constructor(message, errorCode) {
        super(message);
        this.code = errorCode
    }
}

module.exports = HttpError;



// have to be noted in deep down the legs