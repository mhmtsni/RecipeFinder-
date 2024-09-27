const mongoose = require("mongoose");

const bookmarkSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  image_url: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  identification: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Bookmarks", bookmarkSchema);
