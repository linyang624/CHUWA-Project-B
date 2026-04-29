/*
    Error handler middleware
    Used to return error messages in one consistent format.
*/

export default function errorHandler(err, req, res, next) {
    const statusCode = err.statusCode || 500;

    res.status(statusCode).json({
        message: err.message || "Server error",
    });
}