// npm packages
const async = require("async");
const {validationResult} = require("express-validator");

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
exports.item_list = function (req, res, next) {
  Item.find({}, "name price category")
    .populate("category")
    .exec(function (err, list_items) {
      if (err) {
        return next(err);
      }
      // Successful, so render
      res.render("item_list", { title: "Item List", item_list: list_items });
    });
};

// Display detail page for a specific item.
exports.item_detail = function (req, res, next) {
    const {id} = req.params;
    Item.findById(id).populate("category").exec(function(err, item){
        if(err){return next(err);}
        if (item==null) {
            const err = new Error("Item not found");
            err.status = 404;
            return next(err);
        }
        // Successful, so render.
        res.render('item_detail', { title: item.name, item: item } );
    })
};

// Display item create form on GET.
exports.item_create_get = function (req, res) {
    Category.find().exec(function(err, categories){
        if(err){return next(err);}
        res.render('item_form', { title: 'Create item', categories: categories });
    })
};

// Handle item create on POST.
exports.item_create_post = function (req, res, next) {
    const {name, category, description, price, quantity} = req.body;

    // Extract the validation errors from a request.
  const errors = validationResult(req);

  // Create a Item object with escaped and trimmed data.
  const item = new Item({
    name,
    category,
    description,
    price,
    quantity,
  });

  if (!errors.isEmpty()) {
    // There are errors. Render form again with sanitized values/error messages.

    // Get all categories for form.
    Category.find().exec(function(err, categories) {
        if (err) { return next(err); }

        res.render("item_form", {
            title: "Create Item",
            categories: categories,
            item: item,
            errors: errors.array(),
          });        
    })
    return;
  } else {
    // Data from form is valid. Save item.
    item.save(function (err) {
      if (err) {
        return next(err);
      }
      //successful - redirect to new item record.
      res.redirect(item.url);
    });
  }
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
