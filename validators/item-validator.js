const { body } = require("express-validator");

exports.item_create =  [

    // Validate and santise the name field.
    body("name").trim().isLength({min: 3}).withMessage("Category name must be atleast 3 characters.").isLength({max: 50}).withMessage("Category name must be under 50 characters.").escape(),
    body('category', 'Category must not be empty').trim().isLength({min:1}).escape(),
    body('description').trim().isLength({min:1}).withMessage("Description must not be empty").isLength({max:500}).withMessage("Description length must be under 500 characters").escape(),
    body('price', 'Price is required').trim().isNumeric({ min: 1}).escape(),
    body('quantity', 'Quantity is required').trim().isNumeric({ min: 0 }).escape(),

];