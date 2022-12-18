const helper = require("../helpers");
const mongoCollections = require("../config/mongoCollections");
const reservations = mongoCollections.reservations;
const users = mongoCollections.users;
const restaurants = mongoCollections.restaurants;
const userData = require("./users");
const restaurantData = require("./restaurants");
const { ObjectId } = require("mongodb");

// reservationId will get initialized here
// timeWhenBooked and dateWhenBooked will get initialized according to current time and date
// status will get initialized to upcoming
async function createReservation(
  userId,
  restaurantId,
  reservationTime,
  reservationDate,
  people,
  bookedTable
) {
  userId = helper.checkIsProperString(userId, "User ID");
  userId = helper.checkIsProperId(userId);
  let user = await userData.getUserById(userId);
  if (!user) {
    throw `User doesn't exist`;
  }

  restaurantId = helper.checkIsProperString(restaurantId, "Restaurant ID");
  restaurantId = helper.checkIsProperId(restaurantId);
  let restaurant = await restaurantData.getRestaurantById(restaurantId);
  if (!restaurant) {
    throw `Restaurant doesn't exist`;
  }

  reservationTime = helper.checkIsProperString(
    reservationTime,
    "Reservation Time"
  );

  reservationDate = helper.checkIsProperString(
    reservationDate,
    "Reservation Date"
  );

  people = helper.checkIsProperString(people, "People");
  people = helper.validateNumber(people, "People");
  people = parseInt(people);

  let datetime = new Date();

  let timeWhenBooked = datetime.toTimeString();

  let dateWhenBooked = datetime.toDateString();

  let status = "upcoming";

  //TableLogic and Availibilty UNFINISHED

  const newReservation = {
    userId: ObjectId(userId),
    restaurantId: ObjectId(restaurantId),
    reservationTime: reservationTime,
    reservationDate: reservationDate,
    people: people,
    timeWhenBooked: timeWhenBooked,
    dateWhenBooked: dateWhenBooked,
    status: status,
    bookedTable: bookedTable,
  };

  const reservationCollection = await reservations();
  const insertInfo = await reservationCollection.insertOne(newReservation);
  if (!insertInfo.insertedId || !insertInfo.acknowledged) {
    throw [500, "Internal Server Error"];
  } else {
    // return {insertedReservation:true}
    const newId = insertInfo.insertedId.toString();
    let reservations1 = user.reservations;
    reservations1.push(newId);
    const updatedUser = {
      reservations: reservations1,
    };
    const userCollection = await users();
    const updatedInfo1 = await userCollection.updateOne(
      { _id: ObjectId(userId) },
      { $set: updatedUser }
    );
    if (updatedInfo1.modifiedCount === 0) {
      throw "could not update user successfully";
    }
    let reservations2 = restaurant.reservations;
    reservations2.push(newId);
    const updatedRestaurant = {
      reservations: reservations2,
    };
    const restaurantCollection = await restaurants();
    const updatedInfo2 = await restaurantCollection.updateOne(
      { _id: ObjectId(restaurantId) },
      { $set: updatedRestaurant }
    );
    if (updatedInfo2.modifiedCount === 0) {
      throw "could not update restaurant successfully";
    }

    const reservation = await reservationCollection.findOne({
      _id: ObjectId(newId),
    });
    reservation._id = newId;
    return reservation;
  }
}

async function getAllUserReservations(userId) {
  userId = helper.checkIsProperString(userId, "User ID");
  userId = helper.checkIsProperId(userId);
  let user = await userData.getUserById(userId);
  if (!user) {
    throw `User doesn't exist`;
  }
  const reservationCollection = await reservations();
  const reservationList = await reservationCollection
    .find({ userId: ObjectId(userId) })
    .toArray();
  if (!reservationList) {
    throw `No Reservations for the user`;
  }
  for (let i = 0; i < reservationList.length; i++) {
    reservationList[i]._id = reservationList[i]._id.toString();
    reservationList[i].userId = reservationList[i].userId.toString();
    reservationList[i].restaurantId =
      reservationList[i].restaurantId.toString();
  }
  return reservationList;
}

async function getUpcomingUserReservations(userId) {
  userId = helper.checkIsProperString(userId, "User ID");
  userId = helper.checkIsProperId(userId);
  let user = await userData.getUserById(userId);
  if (!user) {
    throw `User doesn't exist`;
  }
  const reservationCollection = await reservations();
  const reservationList = await reservationCollection
    .find({ userId: ObjectId(userId), status: "upcoming" })
    .toArray();
  if (!reservationList) {
    throw `No Reservations for the user`;
  }
  for (let i = 0; i < reservationList.length; i++) {
    reservationList[i]._id = reservationList[i]._id.toString();
    reservationList[i].userId = reservationList[i].userId.toString();
    reservationList[i].restaurantId =
      reservationList[i].restaurantId.toString();
  }
  return reservationList;
}

async function getAllRestaurantReservations(restaurantId) {
  restaurantId = helper.checkIsProperString(restaurantId, "Restaurant Id");
  restaurantId = helper.checkIsProperId(restaurantId);
  let restaurant = await restaurantData.getRestaurantById(restaurantId);
  if (!restaurant) {
    throw `Restaurant doesn't exist`;
  }
  const reservationCollection = await reservations();
  const reservationList = await reservationCollection
    .find({ restaurantId: ObjectId(restaurantId) })
    .toArray();
  if (!reservationList) {
    throw `No Reservations for the restaurant`;
  }
  for (let i = 0; i < reservationList.length; i++) {
    reservationList[i]._id = reservationList[i]._id.toString();
    reservationList[i].userId = reservationList[i].userId.toString();
    reservationList[i].restaurantId =
      reservationList[i].restaurantId.toString();
  }
  return reservationList;
}
async function getRestaurantReservationsByDate(restaurantId, date) {
  restaurantId = helper.checkIsProperString(restaurantId, "Restaurant Id");
  restaurantId = helper.checkIsProperId(restaurantId);
  //check date here

  let restaurant = await restaurantData.getRestaurantById(restaurantId);
  if (!restaurant) {
    throw `Restaurant doesn't exist`;
  }
  const reservationCollection = await reservations();
  const reservationList = await reservationCollection
    .find({ restaurantId: ObjectId(restaurantId), reservationDate: date })
    .toArray();
  if (!reservationList) {
    throw `No Reservations for the restaurant`;
  }
  for (let i = 0; i < reservationList.length; i++) {
    reservationList[i]._id = reservationList[i]._id.toString();
    reservationList[i].userId = reservationList[i].userId.toString();
    reservationList[i].restaurantId =
      reservationList[i].restaurantId.toString();
  }
  return reservationList;
}
async function getUpcomingRestaurantReservations(restaurantId) {
  restaurantId = helper.checkIsProperString(restaurantId, "Restaurant Id");
  restaurantId = helper.checkIsProperId(restaurantId);
  let restaurant = await restaurantData.getRestaurantById(restaurantId);
  if (!restaurant) {
    throw `Restaurant doesn't exist`;
  }
  const reservationCollection = await reservations();
  const reservationList = await reservationCollection
    .find({ restaurantId: ObjectId(restaurantId), status: "upcoming" })
    .toArray();
  if (!reservationList) {
    throw `No Reservations for the restaurant`;
  }
  for (let i = 0; i < reservationList.length; i++) {
    reservationList[i]._id = reservationList[i]._id.toString();
    reservationList[i].userId = reservationList[i].userId.toString();
    reservationList[i].restaurantId =
      reservationList[i].restaurantId.toString();
  }
  return reservationList;
}

async function getReservationById(reservationId) {
  if (arguments.length > 1) {
    throw [400, `More Parameters Passed`];
  }
  reservationId = helper.checkIsProperString(reservationId, "Reservation ID");
  reservationId = helper.checkIsProperId(reservationId);
  const reservationCollection = await reservations();
  let reservation = await reservationCollection.findOne({
    _id: ObjectId(reservationId),
  });
  if (!reservation || reservation === null) {
    throw [404, `No user corresponds to the ID`];
  }
  reservation._id = reservation._id.toString();
  return reservation;
}

async function removeReservation(reservationId) {
  // Table Logic and availibility UNFINISHED
  if (arguments.length > 1) {
    throw [400, `More Parameters Passed`];
  }
  reservationId = helper.checkIsProperString(reservationId, "Reservation ID");
  reservationId = helper.checkIsProperId(reservationId);
  const reservationCollection = await reservations();
  const reservation = await getReservationById(reservationId);

  const updatedReservation = {
    status: "cancelled",
  };

  const updatedInfo = await reservationCollection.updateOne(
    { _id: ObjectId(reservationId) },
    { $set: updatedReservation }
  );
  if (updatedInfo.modifiedCount === 0) {
    throw "Could not cancel reservation";
  }
  let statement = {
    reservationId: reservationId,
    canceled: true,
  };

  // const deletionInfo = await reservationCollection.deleteOne({_id: ObjectId(reservationId)});

  // if (deletionInfo.deletedCount === 0) {
  //     throw [500,`Could not delete reservation with id: ${reservationId}`];
  // }
  // let statement = {
  // "reservationId":reservationId,
  // "deleted": true
  // }
  return statement;
}

// async function updateReservation(){}

module.exports = {
  createReservation,
  getAllUserReservations,
  getUpcomingUserReservations,
  getAllRestaurantReservations,
  getUpcomingRestaurantReservations,
  getReservationById,
  removeReservation,
  getRestaurantReservationsByDate,
  // updateReservation
};
