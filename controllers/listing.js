const Listing = require("../models/listing");

// module.exports.index = async (req, res) => {
//     const allListing = await Listing.find({});
//     res.render("listings/index.ejs", { allListing });
// };

module.exports.index = async (req, res) => {
    const { category } = req.query;
    let allListing;
    if (category) {
        allListing = await Listing.find({ category: category });
    } else {
        allListing = await Listing.find({});
    }
    res.render("listings/index.ejs", { allListing });
};

module.exports.renderNewForm = async (req, res) => {
    res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
    const { id } = req.params;

    const listing = await Listing.findById(id)
        .populate({
            path: "reviews",
            populate: {
                path: "author",
            },
        })
        .populate("owner");

    if (!listing) {
        req.flash(
            "error",
            "Listing you requested for doesn't exist!"
        );
        return res.redirect("/listings");
    }

    res.render("listings/show.ejs", { listing });
};

module.exports.createListing = async (req, res) => {
    const newListing = new Listing(req.body.listing);

    newListing.owner = req.user._id;

    if (req.file) {
        newListing.image = {
            url: req.file.path,
            filename: req.file.filename,
        };
    }

    await newListing.save();

    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
};

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;

    const listing = await Listing.findById(id);

    if (!listing) {
        req.flash(
            "error",
            "Listing you requested for doesn't exist!"
        );
        return res.redirect("/listings");
    }

    res.render("listings/edit.ejs", { listing });
};

module.exports.updateListing = async (req, res) => {
    const { id } = req.params;

    const listing = await Listing.findById(id);

    if (!listing) {
        req.flash(
            "error",
            "Listing you requested for doesn't exist!"
        );
        return res.redirect("/listings");
    }

    Object.assign(listing, req.body.listing);

    if (req.file) {
        listing.image = {
            url: req.file.path,
            filename: req.file.filename,
        };
    }

    await listing.save();

    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
    const { id } = req.params;

    await Listing.findByIdAndDelete(id);

    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
};

module.exports.renderBookingForm = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);

    if (!listing) {
        req.flash("error", "Listing not found!");
        return res.redirect("/listings");
    }

    res.render("listings/book.ejs", { listing });
};

module.exports.bookListing = async (req, res) => {
    const { id } = req.params;
    const { checkIn, checkOut, guests, nights } = req.body;

    const listing = await Listing.findById(id);

    if (!listing) {
        req.flash("error", "Listing not found!");
        return res.redirect("/listings");
    }

    console.log("Booking Details:");
    console.log({
        listing: listing.title,
        user: req.user,
        checkIn,
        checkOut,
        guests,
        nights
    });

    req.flash("success", "Booking confirmed successfully!");

    res.redirect(`/listings/${listing._id}`);
};