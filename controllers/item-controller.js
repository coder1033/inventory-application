// npm packages
const async = require("async");

// local imports
const Category = require("../models/category");
const Item = require("../models/item");

exports.index = function (req, res) {
  async.parallel(
    {
      item_count: function (callback) {
        Item.countDocuments({}, callback); // Pass an empty object as match condition to find all documents of this collection
      },
      category_count: function (callback) {
        Category.countDocuments({}, callback);
      },
    },
    function (err, results) {
      res.render("index", {
        title: "Sports Inventory Home",
        error: err,
        data: results,
      });
    }
  );
};

// Display list of all items.
exports.item_list = function (req, res) {
  res.send("NOT IMPLEMENTED: item list");
};

// Display detail page for a specific item.
exports.item_detail = function (req, res) {
  res.send("NOT IMPLEMENTED: item detail: " + req.params.id);
};

// Display item create form on GET.
exports.item_create_get = function (req, res) {
  res.send("NOT IMPLEMENTED: item create GET");
};

// Handle item create on POST.
exports.item_create_post = function (req, res) {
  res.send("NOT IMPLEMENTED: item create POST");
};

// Display item delete form on GET.
exports.item_delete_get = function (req, res) {
  res.send("NOT IMPLEMENTED: item delete GET");
};

// Handle item delete on POST.
exports.item_delete_post = function (req, res) {
  res.send("NOT IMPLEMENTED: item delete POST");
};

// Display item update form on GET.
exports.item_update_get = function (req, res) {
  res.send("NOT IMPLEMENTED: item update GET");
};

// Handle item update on POST.
exports.item_update_post = function (req, res) {
  res.send("NOT IMPLEMENTED: item update POST");
};
