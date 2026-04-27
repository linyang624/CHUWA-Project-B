// Centralized error handler.
// It catches errors from routes/controllers and sends a JSON error response.
const errorHandler = (err, req, res, next) => {
    
    console.error(err.stack);

    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

    res.status(statusCode).json({
        message: err.message || "Server Error",
    });
};

export default errorHandler;