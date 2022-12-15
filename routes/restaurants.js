const express = require("express");
const router = express.Router();
const data = require("../data");
const restaurantData = data.restaurants;
const reviewData = data.reviews;
const helper = require("../helpers");

router.route("/").get(async (req, res) => {
    let restaurantList = await restaurantData.getAllRestaurants();

    if (req.session.user) {
        return res.render("home", {
            title: "Explore Restaurants",
            user: req.session.user,
            userId: req.session.userId,
            name: req.session.name,
            restaurants: restaurantList,
            loggedIn: true,
            hasErrors: false,
        });
    }
    if (req.session.admin) {
        return res.render("home", {
            title: "Explore Restaurants",
            admin: req.session.admin,
            adminId: req.session.adminId,
            name: req.session.name,
            restaurants: restaurantList,
            loggedIn: true,
            hasErrors: false,
        });
    }
    if (req.session.restaurant) {
        return res.render("home", {
            title: "Explore Restaurants",
            restaurant: req.session.restaurant,
            restaurantId: req.session.restaurantId,
            name: req.session.name,
            restaurants: restaurantList,
            loggedIn: true,
            hasErrors: false,
        });
    }
    return res.render("home", {
        title: "Explore Restaurants",
        noUser: true,
        loggedIn: false,
        hasErrors: false,
        restaurants: restaurantList,
    });
});

router
    .route("/restaurant/:restaurantId")
    .get(async (req, res) => {
        //code here for GET
        let restaurantValues = await restaurantData.getRestaurantById(
            req.params.restaurantId
        );
        let reviewsForRestaurant = await reviewData.getAllRestaurantReviews(req.params.restaurantId);


        if (req.session.user && req.session.message) {
            let message = req.session.message;
            req.session.message = null;
            return res.render("restaurant", {
                message: message,
                title: restaurantValues.name,
                user: req.session.user,
                userId: req.session.userId,
                name: req.session.name,
                restaurantValues: restaurantValues,
                restaurantValueId: req.params.restaurantId,
                review: reviewsForRestaurant,
                loggedIn: true,
                hasErrors: false,
            });
        }
        if (req.session.admin && req.session.message) {
            let message = req.session.message;
            req.session.message = null;
            return res.render("restaurant", {
                message: message,
                title: restaurantValues.name,
                admin: req.session.admin,
                adminId: req.session.adminId,
                name: req.session.name,
                restaurantValues: restaurantValues,
                restaurantValueId: req.params.restaurantId,
                review: reviewsForRestaurant,
                loggedIn: true,
                hasErrors: false,
            });
        }
        if (req.session.restaurant) {
            return res.render("restaurant", {
                title: restaurantValues.name,
                restaurant: req.session.restaurant,
                restaurantId: req.session.restaurantId,
                name: req.session.name,
                restaurantValues: restaurantValues,
                restaurantValueId: req.params.restaurantId,
                review: reviewsForRestaurant,
                loggedIn: true,
                hasErrors: false,
            });
        }
        return res.render("restaurant", {
            title: restaurantValues.name,
            noUser: true,
            loggedIn: false,
            hasErrors: false,
            restaurantValues: restaurantValues,
            restaurantValueId: req.params.restaurantId,
            review: reviewsForRestaurant,
            hasErrors: false,
        });
    })
    .post(async (req, res) => {

        let restaurantValues = await restaurantData.getRestaurantById(
            req.params.restaurantId
        );
        openingTime = restaurantValues.openingTime;
        closingTime = restaurantValues.closingTime;

        if (typeof restaurantValues.availability == "undefined") {
            return res.render("restaurant", {
                title: restaurantValues.name,
                noUser: true,
                loggedIn: false,
                hasErrors: false,
                restaurantValues: restaurantValues,
                restaurantValueID: req.params.restaurantId,
                hasErrors: false,
            });
        }


    });

router
    .route("/restaurant/:restaturantId/addreservation")
    .get(async (req, res) => {
    })
    .post(async (req, res) => {
    });


router
    .route("/restaurant/:restaurantId/post-review")
    .get(async (req, res) => {
        return res.redirect(`/restaurant/${req.params.restaurantId}`);
    })
    .post(async (req, res) => {
        try {

            if (req.session.user) {
                let reviewTitleInput = req.body.reviewTitleInput;
                let reviewRatingInput = req.body.reviewRatingInput;
                let reviewInput = req.body.reviewInput;
                //validation
                const goodInsertedReview = await reviewData.createReview(
                    req.session.userId,
                    req.params.restaurantId,
                    reviewTitleInput,
                    reviewInput,
                    reviewRatingInput);
                return res.redirect(`/restaurant/${req.params.restaurantId}`);
            } else {
                return res.render("login", {title: "Login Page", hasErrors: false});

            }
        } catch (e) {
            req.session.message = e;
            res.redirect('back');
        }
    });

router
    .route("/restaurant/delete-review/:id")
    .get(async (req, res) => {
        try {
            let reviewId = req.params.id;
            if (!req.session.user) {
                return res.render("login", {title: "Login Page", hasErrors: false});
            }
            const review = await reviewData.getReviewById(reviewId);
            if (review.userId.toString() !== req.session.userId) {
                throw "You can only delete your own comment!";
            } else {
                await reviewData.removeReview(reviewId);
                res.redirect('back');
            }
        } catch (e) {
            req.session.message = e;
            res.redirect('back');
        }

    });

module.exports = router;
