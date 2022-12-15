const dbConnection = require("../config/mongoConnection");
const data = require("../data");
const {getRestaurantByName} = require("../data/restaurants");
const userData = data.users;
const restaurantData = data.restaurants;
const reservationData = data.reservations;
const reviewData = data.reviews;

async function main() {
    const db = await dbConnection.dbConnection();
    await db.dropDatabase();
    let user1, user2, user3, user4, user5;
    let res1, res2, res3, res4, res5;
    let reserv1, reserv2, reserv3, reserv4, reserv5;
    let rev1, rev2, rev3, rev4, rev5;
    let admin1;

    console.log("Let's seed the databases!");
    console.log("*************************");

    try {
        await userData.createUser(
            "dk@gmail.com",
            "9826371262",
            "Dhavan",
            "Kanakia",
            "23",
            "Male",
            "Mumbai",
            "Maharashtra",
            "David#34"
        );
        await userData.createUser(
            "mm@gmail.com",
            "9765431092",
            "Manzoor",
            "Mehaboob",
            "24",
            "Male",
            "Hoboken",
            "New Jersey",
            "Manz%90"
        );
        await userData.createUser(
            "ml@gmail.com",
            "5587431204",
            "Mao",
            "Li",
            "23",
            "Male",
            "NYC",
            "New York",
            "Mao$87"
        );
        await userData.createUser(
            "zy@gmail.com",
            "9765434509",
            "Zerong",
            "Yu",
            "24",
            "Male",
            "Jersey City",
            "New Jersey",
            "zerOng&1"
        );
        await userData.createUser(
            "ph@gmail.com",
            "5587431678",
            "Patrick",
            "Hill",
            "35",
            "Male",
            "New York City",
            "New York",
            "Phill@1972"
        );

        admin1 = await userData.createAdmin(
            "dgk@gmail.com",
            "9826371263",
            "Dhavan",
            "Kanakia",
            "23",
            "Male",
            "Mumbai",
            "Maharashtra",
            "David#34"
        );

        const userList = await userData.getAllUsers();
        user1 = userList[0];
        user2 = userList[1];
        user3 = userList[2];
        user4 = userList[3];
        user5 = userList[4];

        admin1 = userList[5];

        // console.log(await userData.checkUser("Dk@gmail.com","David#34"));
        // console.log(await userData.checkUser("9765431092","Manz%90"));

        // console.log(await userData.getUserById((user1._id).toString()));

        // console.log(await userData.updateUser((user2._id).toString(),"mm@gmail.com","9765431092","Manzoor","Mehaboob","27","Male","Hoboken","New Jersey"));

        // console.log(await userData.removeUser((user3._id).toString()));

        // console.log(await userData.getAllUsers());
    } catch (e) {
        console.log(e);
    }

    try {
        res1 = await restaurantData.createRestaurant(
            "Papa Johns",
            "5538741204",
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
            "/public/images/imageOne.jpg",
            "30 and under",
            "Pizza",
            "338 Palisade Avenue",
            "Jersey City",
            "New Jersey",
            "07307",
            "38.213990",
            "-85.531390",
            "0800",
            "2000",
            {2: 4, 4: 6}
        );
        // console.log(res1);
        res2 = await restaurantData.createRestaurant(
            "Club A Steakhouse",
            "5538741236",
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
            "/public/images/imageOne.jpg",
            "30 and under",
            "Steakhouse",
            "28th Street",
            "New York City",
            "New York",
            "17307",
            "40.427818",
            "-3.850970",
            "1100",
            "2200",
            {2: 6, 4: 3}
        );
        res3 = await restaurantData.createRestaurant(
            "Renatos",
            "8538741356",
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
            "/public/images/imageOne.jpg",
            "30 and under",
            "Pizza",
            "338 Central Avenue",
            "Jersey City",
            "New Jersey",
            "07307",
            "37.213990",
            "-95.531390",
            "1000",
            "2100",
            {2: 8, 4: 4, 6: 2}
        );
        res4 = await restaurantData.createRestaurant(
            "Club B Steakhouse",
            "5538748233",
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
            "/public/images/imageOne.jpg",
            "30 and under",
            "Steakhouse",
            "34th Street",
            "New York City",
            "New York",
            "17308",
            "43.427818",
            "-8.850970",
            "1200",
            "2300",
            {2: 4, 4: 3, 8: 1}
        );
        res5 = await restaurantData.createRestaurant(
            "Artichokes",
            "7538741208",
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
            "/public/images/imageOne.jpg",
            "30 and under",
            "Pizza",
            "100 Washington Street",
            "Hoboken",
            "New Jersey",
            "17309",
            "58.213990",
            "-105.531390",
            "0900",
            "0000",
            {4: 4, 6: 2}
        );
        // console.log(await restaurantData.getAllRestaurants());

        // console.log(await restaurantData.getRestaurantById((res2._id).toString()));

        // console.log(await restaurantData.getRestaurantByName("Papa"));

        // console.log(await restaurantData.getRestaurantsByCategory("Pizza"));

        // console.log(await restaurantData.getRestaurantsByCity("New York City"));

        // console.log(await restaurantData.updateRestaurant((res1._id).toString(),"Papa Johns","5538741204","Pizza","338 Palisade Avenue","Jersey City","New Jersey","07307","38.213990","-85.531390","0800","0000","{2:4,4:6}"))

        // console.log(await restaurantData.removeRestaurant((res1._id).toString()));
        // console.log(await restaurantData.getAllRestaurants());
    } catch (e) {
        console.log(e);
    }

    try {
        reserv1 = await reservationData.createReservation(
            user1._id.toString(),
            res1._id.toString(),
            "2000",
            "5th May 2002",
            "6"
        );
        reserv2 = await reservationData.createReservation(
            user1._id.toString(),
            res2._id.toString(),
            "2100",
            "10th Sep 1999",
            "8"
        );
        reserv3 = await reservationData.createReservation(
            user2._id.toString(),
            res1._id.toString(),
            "2200",
            "8th Mar 2012",
            "10"
        );
        reserv4 = await reservationData.createReservation(
            user1._id.toString(),
            res2._id.toString(),
            "1400",
            "5th May 2020",
            "7"
        );
        reserv5 = await reservationData.createReservation(
            user2._id.toString(),
            res5._id.toString(),
            "1200",
            "25th May 2022",
            "10"
        );

        // console.log(await reservationData.getAllUserReservations((user1._id).toString()));

        // console.log(await reservationData.getAllRestaurantReservations((res1._id).toString()));

        // console.log(await reservationData.getReservationById((reserv3._id).toString()));

        // console.log(await reservationData.removeReservation((reserv2._id).toString()));
        // console.log(await reservationData.getAllRestaurantReservations((res2._id).toString()));

        // console.log(await reservationData.getAllUserReservations((user1._id).toString()));
    } catch (e) {
        console.log(e);
    }

    try {
        rev1 = await reviewData.createReview(
            user1._id.toString(),
            res1._id.toString(),
            "FirstReview",
            "Good",
            "4.2"
        );
        rev2 = await reviewData.createReview(
            user1._id.toString(),
            res1._id.toString(),
            "SecondReview",
            "Bad",
            "1.8"
        );
        rev3 = await reviewData.createReview(
            user2._id.toString(),
            res2._id.toString(),
            "MyFirstReview",
            "Okay",
            "2.5"
        );
        rev4 = await reviewData.createReview(
            user3._id.toString(),
            res1._id.toString(),
            "ReviewforFirstTime",
            "Decent",
            "3"
        );
        rev5 = await reviewData.createReview(
            user2._id.toString(),
            res4._id.toString(),
            "MySecondReview",
            "Amazing",
            "4.5"
        );

        // console.log(await reviewData.getAllUserReviews((user1._id).toString()));

        // console.log(await reviewData.getAllRestaurantReviews((res1._id).toString()));

        // console.log(await reviewData.getReviewById((rev3._id).toString()));

        // console.log(await reviewData.removeReview((rev2._id).toString()));

        // console.log(await reviewData.getAllUserReviews((user1._id).toString()));
        // console.log(await reviewData.getAllRestaurantReviews((res1._id).toString()));
        // add to restaurants - add email, password;
    } catch (e) {
        console.log(e);
    }

    await dbConnection.closeConnection();
    console.log('Done seeding databases!');
}

main();
