import mongoose from "mongoose";

const roomSchema = new mongoose.Schema({
    hotel: { type: String, ref: "Hotel", required: true },
    roomType: { type: String, ref: "Hotel", required: true },
    pricePerNight: { type: Number, ref: "Hotel", required: true },
    amenities: { type: Array, ref: "Hotel", required: true, ref: "User" },
    images: [{ type: String }],
    isAvailable: { type:Boolean, default: true },
},{timestamps: true});


const Room = mongoose.model("Room", roomSchema);

export default Room;