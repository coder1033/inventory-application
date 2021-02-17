const { body } = require("express-validator");

exports.category_create = [
  // Validate and santise the name field.
  body("name", "Category name required and should be minimum of 3 characters")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body(
    "description",
    "Short description required and should be maximum of 1000 characters"
  )
    .trim()
    .isLength({ min: 1, max: 500 })
    .escape(),
];
