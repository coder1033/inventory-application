// npm imports
const async = require("async");
const { validationResult } = require("express-validator");

// local imports
const Item = require("../models/item");
const Category = require("../models/category");
const { item_list } = require("./item-controller");

// Display list of all Category.
exports.category_list = function (req, res, next) {
  Category.find()
    .sort([["name", "ascending"]])
    .exec(function (err, list_categories) {
      if (err) {
        return next(err);
      }
      //Successful, so render
      res.render("category_list", {
        title: "Category List",
        category_list: list_categories,
      });
    });
};

// Display detail page for a specific Category.
exports.category_detail = function (req, res, next) {
  const { id } = req.params;
  async.parallel(
    {
      category: function (callback) {
        Category.findById(id).exec(callback);
      },

      category_items: function (callback) {
        Item.find({ category: id }).exec(callback);
      },
    },
    function (err, results) {
      if (err) {
        return next(err);
      }
      if (results.category == null) {
        // No results.
        var err = new Error("Genre not found");
        err.status = 404;
        return next(err);
      }
      // Successful, so render
      res.render("category_detail", {
        title: "Category Detail",
        category: results.category,
        category_items: results.category_items,
      });
    }
  );
};

// Display Category create form on GET.
exports.category_create_get = function (req, res) {
  res.render("category_form", { title: "Create Category" });
};

// Handle Category create on POST.
exports.category_create_post = function (req, res, next) {
  const { name, description } = req.body;
  // Extract the validation errors from a request.
  const errors = validationResult(req);

  // Create a category object with escaped and trimmed data.
  var category = new Category({ name, description });

  if (!errors.isEmpty()) {
    // There are errors. Render the form again with sanitized values/error messages.
    res.render("category_form", {
      title: "Create category",
      category: category,
      errors: errors.array(),
    });
    return;
  } else {
    // Data from form is valid.
    // Check if category with same name already exists.
    Category.findOne({ name }).exec(function (err, found_category) {
      if (err) {
        return next(err);
      }

      if (found_category) {
        // category exists, redirect to its detail page.
        res.redirect(found_category.url);
      } else {
        category.save(function (err) {
          if (err) {
            return next(err);
          }
          // category saved. Redirect to category detail page.
          res.redirect(category.url);
        });
      }
    });
  }
};

// Display Category delete form on GET.
exports.category_delete_get = function (req, res, next) {
  const { id } = req.params;
  async.parallel(
    {
      category: function (callback) {
        Category.findById(id).exec(callback);
      },
      category_items: function (callback) {
        Item.find({ category: id }).exec(callback);
      },
    },
    function (err, results) {
      if (err) {
        return next(err);
      }

      if (results.category == null) {
        // no results.
        res.redirect("/catalog/categories");
      }
      // Successful, so render.
      res.render("category_delete", {
        title: "Delete Category",
        category: results.category,
        category_items: results.category_items,
      });
    }
  );
};

// Handle Category delete on POST.
exports.category_delete_post = function (req, res) {
  const { id } = req.params;
  async.parallel(
    {
      category: function (callback) {
        Category.findById(id).exec(callback);
      },
      category_items: function (callback) {
        Item.find({ category: id }).exec(callback);
      },
    },
    function (err, results) {
      if (err) {
        return next(err);
      }
      // Success
      if (results.category_items.length > 0) {
        // Category has items. Render in same way as for GET route.
        res.render("category_delete", {
          title: "Delete Category",
          category: results.category,
          category_items: results.category_items,
        });
        return;
      } else {
        // Category has no items. Delete object and redirect to the list of categories.
        Category.findByIdAndRemove(id, function deleteCategory(err) {
          if (err) {
            return next(err);
          }
          // Success - go to author list
          res.redirect("/catalog/categories");
        });
      }
    }
  );
};

// Display Category update form on GET.
exports.category_update_get = function (req, res, next) {
  const { id } = req.params;

  Category.findById(id).exec(function (err, category) {
    if (err) {
      return next(err);
    }
    if (category == null) {
      // no result.
      const err = new Error("Category Not Found");
      err.status = 404;
      return next(err);
    }
    res.render("category_form", {
      title: "Update Category",
      category: category,
    });
  });
};

// Handle Category update on POST.
exports.category_update_post = function (req, res) {
  const { id } = req.params;
  const { name, description } = req.body;
  // Extract the validation errors from a request.
  const errors = validationResult(req);

  // Create a Category object with escaped/trimmed data and old id.
  const category = new Category({
    name,
    description,
    _id: id, //This is required, or a new ID will be assigned!
  });
  if (!errors.isEmpty()) {
    // There are errors. Render the form again with sanitized values/error messages.
    res.render("category_form", {
      title: "Create category",
      category: category,
      errors: errors.array(),
    });
    return;
  } else {
    // Data from form is valid.
    // Check if category with same name already exists.
    Category.findOne({ name }).exec(function (err, found_category) {
      if (err) {
        return next(err);
      }

      if (found_category) {
        // category exists, redirect to its detail page.
        res.redirect(found_category.url);
      } else {
        Category.findByIdAndUpdate(
          id,
          category,
          {},
          function (err, thecategory) {
            if (err) {
              return next(err);
            }
            // Successful - redirect to category detail page.
            res.redirect(thecategory.url);
          }
        );
      }
    });
  }
};
