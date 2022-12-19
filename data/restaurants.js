// restaurants data functions
const helper = require("../helpers");
const { ObjectId } = require("mongodb");
const mongoCollections = require("../config/mongoCollections");
const { compare } = require("bcryptjs");
const restaurants = mongoCollections.restaurants;

// RestaurantId will get initialized in the function
// availibility will get created using opening/closing time and restauranttablecapacities
// overallRating will get initialized with value 0
// reservations array and reviews array will be initialized empty
async function createRestaurant(
  name,
  emailId,
  contactInfo,
  description,
  mainImage,
  priceRange,
  category,
  address,
  city,
  state,
  zip,
  latitude,
  longitude,
  openingTime,
  closingTime,
  restaurantTableCapacities
) {
  if (arguments.length !== 16) {
    throw [400, `Improper Number of Inputs`];
  }
  name = helper.checkIsProperString(name, "Restaurant Name");
  name = helper.validateCity(name, "Restaurant Name");

  emailId = helper.checkIsProperString(emailId, "Email ID");
  emailId = helper.validateEmail(emailId, "Email ID");

  contactInfo = helper.checkIsProperString(contactInfo, "Phone Number");
  contactInfo = helper.validatePhoneNumber(contactInfo, "Phone Number");

  description = helper.checkIsProperString(description, "Description");

  mainImage = helper.checkIsProperString(mainImage, "Image Link");

  priceRange = helper.checkIsProperString(priceRange, "Price Range");
  priceRange = helper.validateNumber(priceRange, "Price Range");
  priceRange = parseInt(priceRange);

  category = helper.checkIsProperString(category, "Category");
  category = helper.validateCategory(category, "Category");

  address = helper.checkIsProperString(address, "Address");

  city = helper.checkIsProperString(city, "City");
  city = helper.validateCity(city, "City");

  state = helper.checkIsProperString(state, "State");
  if (!(state !== "New Jersey" || state !== "New York")) {
    throw [400, `Currently servicing only in New York and New Jersey`];
  }

  zip = helper.checkIsProperString(zip, "Zip");
  zip = helper.validateNumber(zip, "Zip");
  if (zip.length != 5) {
    throw [400, `Zip Code Invalid Length`];
  }

  latitude = helper.checkIsProperString(latitude, "Latitude");
  latitude = helper.validateLatitudeLongitude(latitude, "Latitude");

  longitude = helper.checkIsProperString(longitude, "Longitude");
  longitude = helper.validateLatitudeLongitude(longitude, "Longitude");

  openingTime = helper.checkIsProperString(openingTime, "Opening Time");
  openingTime = helper.validateTime(openingTime, "Opening Time");

  closingTime = helper.checkIsProperString(closingTime, "Closing Time");
  closingTime = helper.validateTime(closingTime, "Closing Time");

  helper.compareTime(closingTime, openingTime);

  // Time Validation, Timelogic, restaurantTableCapacities Validation, availibility Calculation using timelogic and restaurant table capacities UNFINISHED

  // restaurantTableCapacities = helper.checkIsProperString(restaurantTableCapacities,"Table Capacities");
  // restaurantTableCapacities = JSON.parse(restaurantTableCapacities);

  //   let availibility = [
  //     { "12/17/2022": { "08:30": { 2: 4, 4: 2 } } },
  //     { "12/17/2022": { "09:00": { 2: 3, 4: 2 } } },
  //     { "12/17/2022": { "10:00": { 2: 3, 4: 2 } } },
  //     { "12/17/2022": { "10:30": { 2: 4, 4: 1 } } },
  //   ];
  let availibility = {};
  let overallRating = 0;
  let reviews = [];
  let reservations = [];

  const newRestaurant = {
    name: name,
    emailId: emailId,
    contactInfo: contactInfo,
    description: description,
    mainImage: mainImage,
    priceRange: priceRange,
    category: category,
    address: address,
    city: city,
    state: state,
    zip: zip,
    latitude: latitude,
    longitude: longitude,
    openingTime: openingTime,
    closingTime: closingTime,
    restaurantTableCapacities: restaurantTableCapacities,
    availibility: availibility,
    overallRating: overallRating,
    reviews: reviews,
    reservations: reservations,
  };

  const restaurantCollection = await restaurants();
  const insertInfo = await restaurantCollection.insertOne(newRestaurant);
  if (!insertInfo.insertedId || !insertInfo.acknowledged) {
    throw [500, "Internal Server Error"];
  }
  // const newId = insertInfo.insertedId.toString();

  // const restaurant = await restaurantCollection.findOne({
  //   _id: ObjectId(newId),
  // });
  // restaurant._id = newId;
  // return restaurant;
  return { insertedRes: true };
}

async function getAllRestaurants() {
  const restaurantCollection = await restaurants();
  let restaurantList = await restaurantCollection
    .find(
      {},
      {
        projection: {
          _id: 1,
          name: 1,
          overallRating: 1,
          address: 1,
          city: 1,
          state: 1,
          mainImage: 1,
          description: 1,
          category: 1,
          city: 1,
          state: 1,
          openingTime: 1,
        },
      }
    )
    .toArray();
  if (!restaurantList) {
    throw [500, `Internal Server Error`];
  }
  for (let i = 0; i < restaurantList.length; i++) {
    restaurantList[i]._id = restaurantList[i]._id.toString();
  }

  return restaurantList;
}

async function getRestaurantById(restaurantId) {
  if (arguments.length > 1) {
    throw [400, `More Parameters Passed`];
  }
  restaurantId = helper.checkIsProperString(restaurantId, "ID");
  restaurantId = helper.checkIsProperId(restaurantId);
  const restaurantCollection = await restaurants();
  let restaurant = await restaurantCollection.findOne({
    _id: ObjectId(restaurantId),
  });
  if (!restaurant || restaurant === null) {
    throw [404, `No user corresponds to the ID`];
  }
  restaurant._id = restaurant._id.toString();
  return restaurant;
}

async function getRestaurantByName(restaurantName) {
  if (arguments.length > 1) {
    throw [400, `More Parameters Passed`];
  }
  restaurantName = helper.checkIsProperString(restaurantName, "ID");

  let restaurantMatched = [];
  const restaurantCollection = await restaurants();
  let restaurantList = await restaurantCollection.find({}).toArray();
  for (let i = 0; i < restaurantList.length; i++) {
    if (
      restaurantList[i].name
        .toLowerCase()
        .includes(restaurantName.toLowerCase())
    ) {
      restaurantMatched.push(restaurantList[i]);
      if (restaurantMatched.length === 20) {
        break;
      }
    }
  }

  for (let i = 0; i < restaurantMatched.length; i++) {
    restaurantMatched[i]._id = restaurantMatched[i]._id.toString();
  }

  if (restaurantMatched.length == 0) {
    throw [404, "Error: Could not find any restaurants with that term"];
  }
  return restaurantMatched;
}

async function getRestaurantsByCategory(category) {
  if (arguments.length > 1) {
    throw [400, `More Parameters Passed`];
  }
  category = helper.checkIsProperString(category, "Category");
  category = helper.validateCategory(category, "Category");

  let restaurantList = [];
  const restaurantCollection = await restaurants();
  let restaurantMatched = await restaurantCollection
    .find({ category: category })
    .toArray();
  for (let i = 0; i < restaurantMatched.length; i++) {
    restaurantMatched[i]._id = restaurantMatched[i]._id.toString();
    if (i < 20) {
      restaurantList.push(restaurantMatched[i]);
    }
  }

  if (restaurantMatched.length == 0) {
    throw [404, "Error: Could not find any people with that term"];
  }
  return restaurantMatched;
}

async function getRestaurantsByCity(city) {
  if (arguments.length > 1) {
    throw [400, `More Parameters Passed`];
  }
  city = helper.checkIsProperString(city, "City");

  let restaurantList = [];
  const restaurantCollection = await restaurants();
  let restaurantMatched = await restaurantCollection
    .find({ city: city })
    .toArray();
  for (let i = 0; i < restaurantMatched.length; i++) {
    restaurantMatched[i]._id = restaurantMatched[i]._id.toString();
    if (i < 20) {
      restaurantList.push(restaurantMatched[i]);
    }
  }
  if (restaurantMatched.length == 0) {
    throw [404, "Error: Could not find any people with that term"];
  }
  return restaurantList;
}

async function removeRestaurant(restaurantId) {
  if (arguments.length > 1) {
    throw [400, `More Parameters Passed`];
  }
  restaurantId = helper.checkIsProperString(restaurantId, "ID");
  restaurantId = helper.checkIsProperId(restaurantId);
  const restaurantCollection = await restaurants();
  const restaurant = await getRestaurantById(restaurantId);
  let restaurantName = restaurant.name;
  const deletionInfo = await restaurantCollection.deleteOne({
    _id: ObjectId(restaurantId),
  });

  if (deletionInfo.deletedCount === 0) {
    throw [500, `Could not delete restaurant with id: ${restaurantId}`];
  }
  let statement = {
    restaurantId: restaurantId,
    deleted: true,
  };
  return statement;
}

async function updateRestaurant(
  restaurantId,
  name,
  emailId,
  contactInfo,
  description,
  priceRange,
  category,
  address,
  city,
  state,
  zip,
  latitude,
  longitude,
  openingTime,
  closingTime,
  restaurantTableCapacities
) {
  if (arguments.length !== 16) {
    throw [400, `Improper Number of Inputs`];
  }
  name = helper.checkIsProperString(name, "Restaurant Name");
  name = helper.validateCity(name, "Restaurant Name");

  emailId = helper.checkIsProperString(emailId, "Email ID");
  emailId = helper.validateEmail(emailId, "Email ID");

  contactInfo = helper.checkIsProperString(contactInfo, "Phone Number");
  contactInfo = helper.validatePhoneNumber(contactInfo, "Phone Number");

  description = helper.checkIsProperString(description, "Description");

  priceRange = helper.checkIsProperString(priceRange, "Price Range");
  priceRange = helper.validateNumber(priceRange, "Price Range");
  priceRange = parseInt(priceRange);

  category = helper.checkIsProperString(category, "Category");
  category = helper.validateCategory(category, "Category");

  address = helper.checkIsProperString(address, "Address");

  city = helper.checkIsProperString(city, "City");
  city = helper.validateCity(city, "City");

  state = helper.checkIsProperString(state, "State");
  if (!(state !== "New Jersey" || state !== "New York")) {
    throw [400, `Currently servicing only in New York and New Jersey`];
  }

  zip = helper.checkIsProperString(zip, "Zip");
  zip = helper.validateNumber(zip, "Zip");
  if (zip.length != 5) {
    throw [400, `Zip Code Invalid Length`];
  }

  latitude = helper.checkIsProperString(latitude, "Latitude");
  latitude = helper.validateLatitudeLongitude(latitude, "Latitude");

  longitude = helper.checkIsProperString(longitude, "Longitude");
  longitude = helper.validateLatitudeLongitude(longitude, "Longitude");

  openingTime = helper.checkIsProperString(openingTime, "Opening Time");
  openingTime = helper.validateTime(openingTime, "Opening Time");

  closingTime = helper.checkIsProperString(closingTime, "Closing Time");
  closingTime = helper.validateTime(closingTime, "Closing Time");

  helper.compareTime(closingTime, openingTime);

  // restaurantTableCapacities = helper.checkIsProperString(
  //   restaurantTableCapacities,
  //   "Table Capacities"
  // );
  // restaurantTableCapacities = JSON.parse(restaurantTableCapacities);

  availibility = {};

  const restaurant = await getRestaurantById(restaurantId);
  const updatedRestaurant = {
    name: name,
    emailId: emailId,
    contactInfo: contactInfo,
    description: description,
    priceRange: priceRange,
    category: category,
    address: address,
    city: city,
    state: state,
    zip: zip,
    latitude: latitude,
    longitude: longitude,
    openingTime: openingTime,
    closingTime: closingTime,
    restaurantTableCapacities: restaurantTableCapacities,
    availibility: availibility,
    overallRating: restaurant.overallRating,
    reviews: restaurant.reviews,
    reservations: restaurant.reservations,
  };

  const restaurantCollection = await restaurants();
  const updatedInfo = await restaurantCollection.updateOne(
    { _id: ObjectId(restaurantId) },
    { $set: updatedRestaurant }
  );
  if (updatedInfo.modifiedCount === 0) {
    throw [400, "All new details exactly match the old details"];
  }
  // return await this.getRestaurantById(restaurantId);
  return { updatedRes: true };
}

// async function createRestaurant(
//   name,
//   contactInfo,
//   description,
//   mainImage,
//   priceRange,
//   category,
//   address,
//   city,
//   state,
//   zip,
//   latitude,
//   longitude,
//   openingTime,
//   closingTime,
//   restaurantTableCapacities
// ) {
//   if (arguments.length !== 15) {
//     throw [400, `Improper Number of Inputs`];
//   }
//   name = helper.checkIsProperString(name, "Restaurant Name");

//   contactInfo = helper.checkIsProperString(contactInfo, "Phone Number");
//   contactInfo = helper.validatePhoneNumber(contactInfo, "Phone Number");

//   category = helper.checkIsProperString(category, "Category");
//   if (
//     !(
//       category === "Pizza" ||
//       category === "Bakery" ||
//       category === "Steakhouse" ||
//       category === "Indian" ||
//       category === "Asian" ||
//       category === "English" ||
//       category === "Thai"
//     )
//   ) {
//     throw [400, `Category is not from valid values list`];
//   }

//   address = helper.checkIsProperString(address, "Address");

//   city = helper.checkIsProperString(city, "City");

//   state = helper.checkIsProperString(state, "State");
//   if (!(state !== "New Jersey" || state !== "New York")) {
//     throw [400, `Currently servicing only in New York and New Jersey`];
//   }

//   zip = helper.checkIsProperString(zip, "Zip");
//   zip = helper.validateNumber(zip, "Zip");
//   zip = parseInt(zip);

//   latitude = helper.checkIsProperString(latitude, "Latitude");
//   latitude = helper.validateLatitudeLongitude(latitude, "Latitude");

//   longitude = helper.checkIsProperString(longitude, "Longitude");
//   longitude = helper.validateLatitudeLongitude(longitude, "Longitude");

//   openingTime = helper.checkIsProperString(openingTime, "Opening Time");

//   closingTime = helper.checkIsProperString(closingTime, "Closing Time");

//   // Time Validation, Timelogic, restaurantTableCapacities Validation, availibility Calculation using timelogic and restaurant table capacities UNFINISHED

//   // restaurantTableCapacities = helper.checkIsProperString(restaurantTableCapacities,"Table Capacities");
//   // restaurantTableCapacities = JSON.parse(restaurantTableCapacities);

//   //   let availibility = [
//   //     {
//   //       "12/17/2022": {
//   //         "08:30": { 2: 4, 4: 2 },
//   //         "09:00": { 2: 3, 4: 2 },
//   //         "09:30": { 2: 2, 4: 2 },
//   //         "10:00": { 2: 4, 4: 1 },
//   //       },
//   //     },
//   //   ];
//   let availibility = {};
//   let overallRating = 0;
//   let reviews = [];
//   let reservations = [];

//   const newRestaurant = {
//     name: name,
//     contactInfo: contactInfo,
//     description: description,
//     mainImage: mainImage,
//     priceRange: priceRange,
//     category: category,
//     address: address,
//     city: city,
//     state: state,
//     zip: zip,
//     latitude: latitude,
//     longitude: longitude,
//     openingTime: openingTime,
//     closingTime: closingTime,
//     restaurantTableCapacities: restaurantTableCapacities,
//     availibility: availibility,
//     overallRating: overallRating,
//     reviews: reviews,
//     reservations: reservations,
//   };

//   const restaurantCollection = await restaurants();
//   const insertInfo = await restaurantCollection.insertOne(newRestaurant);
//   if (!insertInfo.insertedId || !insertInfo.acknowledged) {
//     throw [500, "Internal Server Error"];
//   }
//   const newId = insertInfo.insertedId.toString();

//   const restaurant = await restaurantCollection.findOne({
//     _id: ObjectId(newId),
//   });
//   restaurant._id = newId;
//   return restaurant;
// }
const getAvailability = async (time) => {
  req.body.time = helper.checkInputTime(time);
  const restaurantCollection = await restaurants();
  let availabiliyByTime = await restaurantCollection.findOne({
    availibility: { $elemMatch: { time } },
  });
  if (!availabiliyByTime) throw "No Review in system!";
  return availabiliyByTime;
};

const addAvailability = async (restaurantId, object, date, time) => {
  date = helper.checkBookingDateData(date);
  time = helper.checkInputTime(time);
  restaurantId = helper.checkIsProperString(restaurantId, "ID");
  restaurantId = helper.checkIsProperId(restaurantId);
  path = "availibility." + date + "." + time;

  const restaurantCollection = await restaurants();
  const updateInfo = await restaurantCollection.updateOne(
    { _id: ObjectId(restaurantId) },
    { $set: { [path]: object } }
  );
  if (!updateInfo.matchedCount && !updateInfo.modifiedCount)
    throw "Error: Update failed";
};

// addAvailability(
//   "639e8d79d03c1eeb84422982",
//   { 2: 1, 4: 5 },
//   "12/03/2022",
//   "08:00"
// );

module.exports = {
  createRestaurant,
  getAllRestaurants,
  getRestaurantById,
  getRestaurantByName,
  getRestaurantsByCategory,
  getRestaurantsByCity,
  removeRestaurant,
  updateRestaurant,
  //updateAvailability,
  getAvailability,
  addAvailability,
};
