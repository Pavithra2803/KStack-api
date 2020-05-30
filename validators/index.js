const { validationResult } = require('express-validator');
//To catch the errors in auth.js and category.js validator methods
exports.runValidation = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            error: errors.array()[0].msg //Show the first err msg
        });
    }
    next();
};
