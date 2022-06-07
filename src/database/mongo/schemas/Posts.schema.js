const mongoose = require("mongoose");

const addressSchema = mongoose.Schema({
  address: { type: String, default: "" },
  pincode: { type: String, default: "" },
  city: { type: String, default: "" },
  state: { type: String, default: "" },
});

const roomSchema = mongoose.Schema({
  totalRoomCount: { type: Number, default: 0 },
  availableRoomCount: { type: Number, default: 0},
  roomDetails: []
}); 

const postSchema = mongoose.Schema({
  creator: { type: String, default: [] },
  title: { type: String, default: "" },
  postbio: { type: String, default: "" },
  facilities: [String], // AC, WIFI, Food...
  rooms: { type: roomSchema },
  selectedFile: String,
  likes: { type: [String], default: [] },
  timing: [{ type: Object, required: true }],
  restaurantNumber: { type: Number },
  whatsapp: { type: Number },
  address: { type: addressSchema },
  images: [{ type: String, default: [] }],
  createdAt: { type: Date, default: new Date() },
});

const postMessage = mongoose.model("postMessage", postSchema);
module.exports = postMessage;
