const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const Booking = require("../models/booking.js");
const {
    isLoggedIn,
    isOwner,
    validateListing
} = require("../middleware.js");

const listingController = require("../controllers/listing.js");

const multer = require("multer");
const { storage } = require("../cloudConfig.js");

const upload = multer({ storage });

router
    .route("/")
    .get(
        wrapAsync(listingController.index)
    )
    .post(
        isLoggedIn,
        upload.single("image"),
        validateListing,
        wrapAsync(listingController.createListing)
    );

router.get(
    "/new",
    isLoggedIn,
    listingController.renderNewForm
);

router.get("/search", wrapAsync(async (req, res) => {
        const { q } = req.query;
        if (!q || q.trim() === "") {
            return res.redirect("/listings");
        }
        const searchQuery = q.trim();
        const allListings = await Listing.find({
            $or: [
                { title: { $regex: searchQuery, $options: "i" } },
                { location: { $regex: searchQuery, $options: "i" } },
                { country: { $regex: searchQuery, $options: "i" } },
                { description: { $regex: searchQuery, $options: "i" } }
            ]
        });
        res.render("listings/search.ejs", {
            allListings,
            searchQuery
        });
    }));

router
    .route("/:id")
    .get(
        wrapAsync(listingController.showListing)
    )
    .put(
        isLoggedIn,
        isOwner,
        upload.single("image"),
        validateListing,
        wrapAsync(listingController.updateListing)
    )
    .delete(
        isLoggedIn,
        isOwner,
        wrapAsync(listingController.destroyListing)
    );

    router.get(
        "/:id/edit",
        isLoggedIn,
        isOwner,
        wrapAsync(listingController.renderEditForm)
    );

    router.get("/", wrapAsync(async (req, res) => {
    const { category } = req.query;

    let allListing;

    if (category) {
        allListing = await Listing.find({ category });
    } else {
        allListing = await Listing.find({});
    }

    res.render("listings/index.ejs", { allListing });
}));

router.get("/:id/book", isLoggedIn, wrapAsync(listingController.renderBookingForm));

router.post(
    "/:id/book",
    isLoggedIn,
    wrapAsync(async (req, res) => {

        const listing = await Listing.findById(req.params.id);

        if (!listing) {
            req.flash("error", "Listing not found!");
            return res.redirect("/listings");
        }

        const { checkIn, checkOut, rooms } = req.body;

        const checkInDate = new Date(checkIn);
        const checkOutDate = new Date(checkOut);

        // Validate dates
        if (
            isNaN(checkInDate.getTime()) ||
            isNaN(checkOutDate.getTime()) ||
            checkOutDate <= checkInDate
        ) {
            req.flash(
                "error",
                "Please select valid check-in and check-out dates."
            );

            return res.redirect(`/listings/${listing._id}`);
        }

        const roomCount = parseInt(rooms);

        if (!roomCount || roomCount < 1) {

            req.flash(
                "error",
                "Number of rooms must be at least 1."
            );

            return res.redirect(`/listings/${listing._id}`);
        }


        // Calculate number of nights on SERVER
        const difference =
            checkOutDate.getTime() - checkInDate.getTime();

        const nights =
            Math.ceil(
                difference / (1000 * 60 * 60 * 24)
            );


        // Calculate total price
        const totalPrice =
            listing.price * nights * roomCount;


        // Create booking
        const booking = new Booking({

            listing: listing._id,

            user: req.user._id,

            checkIn: checkInDate,

            checkOut: checkOutDate,

            rooms: roomCount,

            nights: nights,

            pricePerNight: listing.price,

            totalPrice: totalPrice

        });


        await booking.save();


        // Redirect to receipt
        res.redirect(`/bookings/${booking._id}/receipt`);

    })
);

module.exports = router;

