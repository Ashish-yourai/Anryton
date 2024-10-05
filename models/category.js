var mongoose = require("mongoose");
var ObjectId = require("mongoose").Types.ObjectId;
var Schema = mongoose.Schema;

var category = new Schema(
  {
    name: { type: String, default: "" },
    isDeleted: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Category", category);
