const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");

const listingSchema = new Schema({
    title: {
        type: String,
        required: true,
    },

    description: String,

    image: {
        filename: {
            type: String,
            default: "listingimage",
        },
        url: {
            type: String,
            default: "https://static.vecteezy.com/system/resources/thumbnails/050/686/096/small/baia-do-sancho-brazil-is-the-beautiful-place-photo.jpg",
        },
    },

    price: Number,
    location: String,
    country: String,
    category: {
        type: String,
        enum: [
            "Trending",
            "Rooms",
            "Hotel",
            "Homestay",
            "Iconic cities",
            "Mountains",
            "Castles",
            "Amazing Pools",
            "Farms",
            "Arctic",
            "Camping",
            "Domes"
        ],
        required: true
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref:"Review",
        },
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref:"User",
    }
});

listingSchema.post("findOneAndDelete", async(listing) => {
    if(listing) {
        await Review.deleteMany({_id: { $in: listing.reviews}});
    }
});

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;