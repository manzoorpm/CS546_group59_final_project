// users data functions

const mongoCollections = require("../config/mongoCollections");
const users = mongoCollections.users;

async function createUser(){}

async function getAllUsers(){}

async function getUserById(){}

async function removeUser(){}

async function updateUser(){}

module.exports = {
    createUser,
    getAllUsers,
    getUserById,
    removeUser,
    updateUser
}