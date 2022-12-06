// users data functions

const helper = require('../helpers');
const bcrypt = require('bcryptjs');
const {ObjectId} = require('mongodb');
const mongoCollections = require("../config/mongoCollections");
const users = mongoCollections.users;
saltRounds = 10;

// userId will get initialized in the function
// Reservations array and Reviews array get initialized as empty arrays in the createUser Function
async function createUser(emailId,contactInfo,firstName,lastName,age,gender,city,state,password){
    if(arguments.length!==9){
        throw [400,`Improper Number of Inputs`];
    }
    emailId = helper.checkIsProperString(emailId,"Email ID");
    emailId = helper.validateEmail(emailId,"Email ID");

    contactInfo = helper.checkIsProperString(contactInfo,"Phone Number");
    contactInfo = helper.validatePhoneNumber(contactInfo,"Phone Number");

    firstName = helper.checkIsProperString(firstName,"First Name");
    lastName = helper.checkIsProperString(lastName,"Last Name");

    age = helper.checkIsProperString(age,"Age");
    age = helper.validateNumber(age,"Age");
    age = parseInt(age);

    gender = helper.checkIsProperString(gender,"Gender");

    city = helper.checkIsProperString(city,"City");

    state = helper.checkIsProperString(state,"State");

    password = helper.checkIsProperString(password,"Password");
    password = helper.checkPassword(password,"Password");

    let reviews = [];
    let reservations = [];
    tag = "user"

    const userCollection = await users();

    const ifUserEmail = await userCollection.findOne({emailId:emailId});
    const ifUserPhoneNumber = await userCollection.findOne({contactInfo:contactInfo});

    if(!ifUserEmail && !ifUserPhoneNumber){
        const hashedPassword = await bcrypt.hash(password,saltRounds)
        const newUser = {
            // userId: ObjectId(),
            firstName:firstName,
            lastName:lastName,
            emailId:emailId,
            contactInfo:contactInfo,
            age:age,
            gender:gender,
            city:city,
            state:state,
            hashedPassword:hashedPassword,
            tag:tag,
            reviews:reviews,
            reservations:reservations
        }
        const insertInfo = await userCollection.insertOne(newUser);
        // const renameId = await userCollection.aggregate({ $project: { _id:0, userId:1,firstName:1,lastName:1,emailId:1,contactInfo:1,age:1,gender:1,city:1,state:1,hashedPassword:1,reviews:1,reservations:1}})
        // const renameInfo = await userCollection.updateMany({}, {$rename:{"_id":"userId"}}, false, true)
        if (!insertInfo.insertedId || !insertInfo.acknowledged){
          throw [500,'Internal Server Error'];
        }
        else{
            // return {insertedUser:true}
            const newId = insertInfo.insertedId.toString();

            const user = await userCollection.findOne({_id: ObjectId(newId)});
            user._id = newId
            return user; 
        }
      }
      else{
        throw [400,'Error: Email/Phone Number already registered']
      }

    };

async function checkUser(username,password){
    username = username.toLowerCase()

    const userCollection = await users();
    const ifUserEmail = await userCollection.findOne({emailId:username});
    const ifUserPhoneNumber = await userCollection.findOne({contactInfo:username});
    let user;

    if(ifUserPhoneNumber || ifUserEmail){
        let hashedPassword;
        if(ifUserEmail){
            user = ifUserEmail;
        }
        if(ifUserPhoneNumber){
            user = ifUserPhoneNumber;
        }
        hashedPassword = user.hashedPassword;
        hashCompare= await bcrypt.compare(password,hashedPassword)
        if(hashCompare){
            if(user.tag === "user"){
                return {authenticatedUser: true}
            }
            if(user.tag === "admin"){
                return {authenticatedAdmin: true}
            }
            
        }
        else{
            throw[400,"Error:Either the username or password is invalid"]
        }
    }
    else{
      throw[400,"Error:Either the username or password is invalid"]
    }
} 

    
// No parameters need to be passed for this
async function getAllUsers(){
    const userCollection = await users();
    let userList = await userCollection.find({},{projection:{_id:1,emailId:1}}).toArray(); 
    if(!userList){
        throw `No Users Present`
    }
    for(let i=0;i<userList.length;i++){
        userList[i]._id = userList[i]._id.toString()
    }

    return userList;
}

async function getUserById(userId){
    if(arguments.length>1){
        throw [400,`More Parameters Passed`]
    }
    userId = helper.checkIsProperString(userId,"ID");
    userId = helper.checkIsProperId(userId);
    const userCollection = await users();
    let user = await userCollection.findOne({_id: ObjectId(userId)});
    if(!user || user === null){
        throw [404,`No user corresponds to the ID`]
    }
    user._id = user._id.toString()
    return user;
}

async function removeUser(userId){
    if(arguments.length>1){
        throw [400,`More Parameters Passed`]
    }
    userId = helper.checkIsProperString(userId,"ID");
    userId = helper.checkIsProperId(userId);
    const userCollection = await users();
    const user = await getUserById(userId);
    let userName = user.firstName;
    const deletionInfo = await userCollection.deleteOne({_id: ObjectId(userId)});

    if (deletionInfo.deletedCount === 0) {
        throw [500,`Could not delete user with id: ${userId}`];
    }
    let statement = {
    "userId":userId,
    "deleted": true
    }
    return statement;
}

async function updateUser(userId,emailId,contactInfo,firstName,lastName,age,gender,city,state){
    if(arguments.length!==9){
        throw [400,`Improper Number of Inputs`];
    }
    emailId = helper.checkIsProperString(emailId,"Email ID");
    emailId = helper.validateEmail(emailId,"Email ID");

    contactInfo = helper.checkIsProperString(contactInfo,"Phone Number");
    contactInfo = helper.validatePhoneNumber(contactInfo,"Phone Number");

    firstName = helper.checkIsProperString(firstName,"First Name");
    lastName = helper.checkIsProperString(lastName,"Last Name");

    age = helper.checkIsProperString(age,"Age");
    age = helper.validateNumber(age,"Age");
    age = parseInt(age);

    gender = helper.checkIsProperString(gender,"Gender");

    city = helper.checkIsProperString(city,"City");

    state = helper.checkIsProperString(state,"State");

    
    const user = await getUserById(userId);
    const updatedUser = {
        firstName:firstName,
        lastName:lastName,
        emailId:emailId,
        contactInfo:contactInfo,
        age:age,
        gender:gender,
        city:city,
        state:state,
        hashedPassword:user.hashedPassword,
        reviews:user.reviews,
        reservations:user.reservations
    }

    const userCollection = await users();
    const updatedInfo = await userCollection.updateOne(
        {_id: ObjectId(userId)},
        {$set: updatedUser}
      );
      if (updatedInfo.modifiedCount === 0) {
        throw 'All new details exactly match the old details';
      }
      return await this.getUserById(userId);
}

module.exports = {
    createUser,
    checkUser,
    getAllUsers,
    getUserById,
    removeUser,
    updateUser
}