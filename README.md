# 🏡 Wonderlust – Airbnb Clone

A full-stack Airbnb-style web application where users can browse stays, list their own properties, book rooms, and leave reviews. Built with **Node.js, Express, MongoDB, and EJS**, following the MVC pattern.

---

## ✨ Features

- **Authentication** – Sign up, log in, and log out using Passport.js (local strategy) with session-based auth and flash messages
- **Listings (CRUD)** – Create, view, edit, and delete property listings
- **Image Uploads** – Listing images are uploaded to Cloudinary via Multer
- **Category Filters** – Browse by Trending, Rooms, Hotel, Homestay, Iconic cities, Mountains, Castles, Amazing Pools, Farms, Arctic, Camping, and Domes
- **Search** – Search listings by title, location, country, or description
- **Booking System** – Book a listing with check-in/check-out dates and number of rooms; total price is calculated automatically
- **Booking Receipt** – View a detailed receipt for each booking
- **Reviews & Ratings** – Logged-in users can post star-rated reviews and delete their own
- **Authorization** – Only the listing owner can edit/delete a listing; only the review author can delete a review
- **Validation** – Server-side validation with Joi
- **Error Handling** – Centralized error handler with a custom `ExpressError` class and 404 page
- **Static Pages** – About, Contact, Help, FAQ, Privacy Policy, and Terms

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Runtime | Node.js |
| Framework | Express 5 |
| Database | MongoDB with Mongoose |
| Templating | EJS + ejs-mate (layouts) |
| Auth | Passport, passport-local, passport-local-mongoose |
| Validation | Joi |
| File Uploads | Multer + multer-storage-cloudinary + Cloudinary |
| Sessions / Flash | express-session, connect-flash |
| Other | method-override, dotenv |
| Frontend | Bootstrap 5, Font Awesome, custom CSS |

---

## 📁 Project Structure

```
AirBnb Clone Project/
├── app.js                 # App entry point & configuration
├── cloudConfig.js         # Cloudinary + Multer storage setup
├── middleware.js          # isLoggedIn, isOwner, isReviewAuthor, validators
├── schema.js              # Joi validation schemas
├── controllers/           # Route handler logic
│   ├── listing.js
│   ├── review.js
│   └── user.js
├── models/                # Mongoose models
│   ├── booking.js
│   ├── listing.js
│   ├── review.js
│   └── user.js
├── routes/                # Express routers
│   ├── booking.js
│   ├── listing.js
│   ├── review.js
│   └── user.js
├── init/                  # Database seed scripts
│   ├── data.js            # Sample listings
│   └── index.js           # Seeder
├── utils/                 # ExpressError, wrapAsync
├── views/                 # EJS templates
│   ├── bookings/          # Receipt page
│   ├── includes/          # Navbar, footer, flash messages
│   ├── layouts/           # boilerplate.ejs
│   ├── listings/          # index, show, new, edit, book, search
│   └── users/             # login, signup
└── public/                # Static assets (CSS, JS, images)
```

---

## ✅ Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later recommended)
- [MongoDB](https://www.mongodb.com/try/download/community) running locally on the default port (`27017`)
- A free [Cloudinary](https://cloudinary.com/) account for image uploads

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd "AirBnb Clone Project"
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the project root:

```env
CLOUD_NAME=your_cloudinary_cloud_name
CLOUD_API_KEY=your_cloudinary_api_key
CLOUD_API_SECRET=your_cloudinary_api_secret
```

> ⚠️ **Never commit your `.env` file.** Add it to `.gitignore` and rotate your Cloudinary keys if they were ever pushed to a public repository.

### 4. Start MongoDB

Make sure MongoDB is running locally. The app connects to:

```
mongodb://127.0.0.1:27017/wonderlust
```

### 5. (Optional) Seed the database with sample listings

```bash
node init/index.js
```

> The seed script assigns each sample listing to an `owner` user ID. Sign up a user first and update the owner ID in `init/index.js` to match that user's `_id` from your database before seeding.

### 6. Run the app

```bash
node app.js
```

Open **http://localhost:8080/listings** in your browser.

---

## 🗺️ Routes Overview

### Listings

| Method | Route | Description | Auth |
|--------|-------|-------------|------|
| GET | `/listings` | All listings (supports `?category=`) | – |
| GET | `/listings/search?q=` | Search listings | – |
| GET | `/listings/new` | New listing form | Logged in |
| POST | `/listings` | Create a listing | Logged in |
| GET | `/listings/:id` | Listing details | – |
| GET | `/listings/:id/edit` | Edit form | Owner |
| PUT | `/listings/:id` | Update listing | Owner |
| DELETE | `/listings/:id` | Delete listing | Owner |
| GET | `/listings/:id/book` | Booking form | Logged in |
| POST | `/listings/:id/book` | Create a booking | Logged in |

### Reviews

| Method | Route | Description | Auth |
|--------|-------|-------------|------|
| POST | `/listings/:id/reviews` | Add a review | Logged in |
| DELETE | `/listings/:id/reviews/:reviewId` | Delete a review | Review author |

### Bookings

| Method | Route | Description | Auth |
|--------|-------|-------------|------|
| GET | `/bookings/:id/receipt` | View booking receipt | Logged in |

### Users

| Method | Route | Description |
|--------|-------|-------------|
| GET / POST | `/signup` | Register |
| GET / POST | `/login` | Log in |
| GET | `/logout` | Log out |

### Static Pages

`/about`, `/contact`, `/help`, `/faq`, `/privacy`, `/terms`

---

## 🗃️ Data Models

- **User** – `email`, plus `username` / hashed password via passport-local-mongoose
- **Listing** – `title`, `description`, `image {filename, url}`, `price`, `location`, `country`, `category`, `reviews[]`, `owner`
- **Review** – `comment`, `rating (1–5)`, `createdAt`, `author`
- **Booking** – `listing`, `user`, `checkIn`, `checkOut`, `rooms`, `nights`, `pricePerNight`, `totalPrice`, `bookingDate`

Deleting a listing automatically deletes its associated reviews (Mongoose middleware).

---

## 🔒 Security Notes & Recommended Improvements

Before deploying to production, consider:

- Move the hard-coded session secret in `app.js` into an environment variable
- Move the MongoDB connection string into an environment variable (e.g., MongoDB Atlas)
- Remove the `/demouser` demo route from `app.js`
- Add a `start` script (`"start": "node app.js"`) and `nodemon` for development
- Add a `.gitignore` for `node_modules/` and `.env`

---

## 🔮 Future Enhancements

- Online payment integration
- Map integration for listing locations
- Date-availability checks to prevent double bookings
- User profile and "My Bookings" dashboard
- Wishlist / favorites

---

## 🙌 Acknowledgements

Built as a learning project inspired by Airbnb. Sample images and data are for demonstration purposes only.
