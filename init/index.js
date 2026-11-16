// const mongoose = require("mongoose");
// const initData = require("./data.js");
// const Listing=require("./models/listing.js");

// const MONGO_URL="mongodb://127.0.0.1:27017/wonderlust";

// async function main()
// {
//     await mongoose.connect(MONGO_URL);
// }

// main()
//  .then(() => {
//     console.log("Connected to DB");
//  })
//  .catch((err) => {
//     console.log(err);
//  });

// const initDB = async () => {
//     await Listing.deleteMany({});
//     await Listing.insertMany({initData.data});
//     console.log("Data was initialized");
// };

// initDB();

const mongoose = require("mongoose");

const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wonderlust";

async function main() {
    await mongoose.connect(MONGO_URL);
}

main()
    .then(() => {
        console.log("Connected to DB");
    })
    .catch((err) => {
        console.log(err);
    });

// const initDB = async () => {
//     await Listing.deleteMany({});
//     initData.data = initData.data.map((obj) => {{
//         ...obj,
//         owner:"6a8f0486876b4ba162fc328f",
//     }});
//     await Listing.insertMany(initData.data);
//     console.log("Data was initialized");
// };

const initDB = async () => {
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({
        ...obj,
        owner: "6a9003b4a6827d82928b07df",
    }));
    await Listing.insertMany(initData.data);
    console.log("Data was initialized");
};

initDB();