// const mongoose = require("mongoose");

// const OrderSchema = new mongoose.Schema({
//   userId: mongoose.Schema.Types.ObjectId,
//   items: Array,
//   total: Number,
//   status: {
//     type: String,
//     default: "Pending"
//   },
//   date: {
//     type: Date,
//     default: Date.now
//   }
// });

// module.exports = mongoose.model("Order", OrderSchema);
const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  items: Array,
  total: Number,
  status: String,
  date: Date
});

module.exports = mongoose.model("Order", OrderSchema);
