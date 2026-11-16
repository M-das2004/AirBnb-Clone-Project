const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bookingSchema = new Schema({

    listing: {
        type: Schema.Types.ObjectId,
        ref: "Listing",
        required: true
    },

    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    checkIn: {
        type: Date,
        required: true
    },

    checkOut: {
        type: Date,
        required: true
    },

    rooms: {
        type: Number,
        required: true,
        min: 1
    },

    nights: {
        type: Number,
        required: true,
        min: 1
    },

    pricePerNight: {
        type: Number,
        required: true
    },

    totalPrice: {
        type: Number,
        required: true
    },

    bookingDate: {
        type: Date,
        default: Date.now
    }

});

module.exports = mongoose.model("Booking", bookingSchema);