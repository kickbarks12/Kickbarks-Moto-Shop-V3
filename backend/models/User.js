const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  vouchers: { type: Number, default: 0 },
  wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }]
});

module.exports = mongoose.model("User", UserSchema);
