const { check } = require('express-validator');

//Validate input
const registrationValidator = [
    check('email', 'Please enter a valid e-mail').not().isEmpty().isEmail().trim().escape().normalizeEmail(),
    check('password').not().isEmpty().isLength({min: 8}).withMessage('Password harus memiliki minimal 8 karakter!')
    .matches('[0-9]').withMessage('Password harus memiliki angka!')
    .matches('[A-Z]').withMessage('Password harus memiliki huruf besar!'),
];

const loginValidator = [
    check('email', 'Please enter a valid e-mail').not().isEmpty().isEmail().trim().escape().normalizeEmail(),
    check('password').not().isEmpty().isLength({min: 8}).withMessage('Password harus memiliki minimal 8 karakter!')
    .matches('[0-9]').withMessage('Password harus memiliki angka!')
    .matches('[A-Z]').withMessage('Password harus memiliki huruf besar!'),
];

module.exports = { registrationValidator, loginValidator };