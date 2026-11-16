const express = require("express");
const router = express.Router();

const Booking = require("../models/booking.js");
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn } = require("../middleware.js");


// Booking receipt
router.get(
    "/:id/receipt",
    isLoggedIn,
    wrapAsync(async (req, res) => {

        const booking = await Booking
            .findById(req.params.id)
            .populate("listing")
            .populate("user");

        if (!booking) {
            req.flash("error", "Booking not found!");
            return res.redirect("/listings");
        }


        // Make sure user can only see their own booking
        if (
            !booking.user._id.equals(req.user._id)
        ) {
            req.flash(
                "error",
                "You are not authorized to view this booking."
            );

            return res.redirect("/listings");
        }


        res.render(
            "bookings/receipt.ejs",
            { booking }
        );

    })
);


module.exports = router;