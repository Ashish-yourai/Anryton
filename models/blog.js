var mongoose = require("mongoose");
var ObjectId = require("mongoose").Types.ObjectId;
var Schema = mongoose.Schema;

var blog = new Schema(
  {
    title: { type: String, default: "" },
    keywords: { type: String, default: "" },
    description: { type: String, default: "" },
    image: { type: String, default: "" },
    alttag: { type: String, default: "" },
     isDeleted: { type: Number, default: 0 },
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("blog", blog);
