const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ItemSchema = new Schema({
  category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
  description: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
});

// Virtual for book's URL
ItemSchema.virtual("url").get(function () {
  return "/catalog/item/" + this._id;
});

//Export model
module.exports = mongoose.model("Item", ItemSchema);
