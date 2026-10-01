const logger = (req, res, next) => {
    const fechaHora = new Date();
    console.log(`${fechaHora} - [${req.method}] ${req.originalUrl}`);
    next();
};

module.exports = logger;