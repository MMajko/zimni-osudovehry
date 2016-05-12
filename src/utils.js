function notFoundError() {}
notFoundError.prototype = Object.create(Error.prototype);

module.exports = { notFoundError };
