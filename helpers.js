// Helper functions

const { ObjectId } = require("mongodb");

function checkIsProperString(string, variableName) {
  if (typeof string === "undefined") {
    throw `${variableName} is undefined`;
  }
  if (typeof string !== "string") {
    throw `${variableName} is not a string, it must be a string`;
  }
  if (string.length === 0) {
    throw `${variableName} is an empty string`;
  }
  if (string.trim().length === 0) {
    throw `${variableName} is a string with only empty spaces`;
  }
  string = string.trim();
  return string;
}

function checkIsProperArray(array, variableName) {
  if (typeof array === "undefined") {
    throw `${variableName} is undefined`;
  }
  if (typeof array !== "object") {
    throw `${variableName} is not an array, it must be an array`;
  }
  if (!Array.isArray(array)) {
    throw `${variableName} is not an array, it must be an array`;
  }
  if (array.length === 0) {
    throw `${variableName} is an empty array`;
  }
}

function validateEmail(string, variableName) {
  string = string.trim();
  string = string.toLowerCase();
  let re =
    /^[a-zA-Z0-9][\-_\.\+\!\#\$\%\&\'\*\/\=\?\^\`\{\|]{0,1}([a-zA-Z0-9][\-_\.\+\!\#\$\%\&\'\*\/\=\?\^\`\{\|]{0,1})*[a-zA-Z0-9]@[a-zA-Z0-9][-\.]{0,1}([a-zA-Z][-\.]{0,1})*[a-zA-Z0-9]\.[a-zA-Z0-9]{1,}([\.\-]{0,1}[a-zA-Z]){0,}[a-zA-Z0-9]{0,}$/i;
  result = re.test(string);
  if (!result) {
    throw [400, `${variableName} is not valid`];
  }
  return string;
}

function validatePhoneNumber(string, variableName) {
  string = string.trim();
  let re = /^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/;
  result = re.test(string);
  if (!result) {
    throw [400, `${variableName} is not valid`];
  }
  string = string.replace(/\D/g, "");
  return string;
}

function validateName(string, variableName) {
  string = string.trim();
  let re = /^[a-z]+$/i;
  result = re.test(string);
  if (!result) {
    throw [400, `${variableName} is not valid`];
  }
  return string;
}

function validateCity(string, variableName) {
  string = string.trim();
  let re = /^[a-z][a-z\s]*$/i;
  result = re.test(string);
  if (!result) {
    throw [400, `${variableName} is not valid`];
  }
  return string;
}

function validateState(string, variableName) {
  let states = string.trim();
  if (
    !(
      states === "Alabama" ||
      states === "Alaska" ||
      states === "American Samoa" ||
      states === "Arizona" ||
      states === "Arkansas" ||
      states === "Baker Island" ||
      states === "California" ||
      states === "Colorado" ||
      states === "Connecticut" ||
      states === "Delaware" ||
      states === "District of Columbia" ||
      states === "Florida" ||
      states === "Georgia" ||
      states === "Guam" ||
      states === "Hawaii" ||
      states === "Howland Island" ||
      states === "Idaho" ||
      states === "Illinois" ||
      states === "Indiana" ||
      states === "Iowa" ||
      states === "Jarvis Island" ||
      states === "Johnston Atoll" ||
      states === "Kansas" ||
      states === "Kentucky" ||
      states === "Kingman Reef" ||
      states === "Louisiana" ||
      states === "Maine" ||
      states === "Maryland" ||
      states === "Massachusetts" ||
      states === "Michigan" ||
      states === "Midway Atoll" ||
      states === "Minnesota" ||
      states === "Mississippi" ||
      states === "Missouri" ||
      states === "Montana" ||
      states === "Navassa Island" ||
      states === "Nebraska" ||
      states === "Nevada" ||
      states === "New Hampshire" ||
      states === "New Jersey" ||
      states === "New Mexico" ||
      states === "New York" ||
      states === "North Carolina" ||
      states === "North Dakota" ||
      states === "Northern Mariana Islands" ||
      states === "Ohio" ||
      states === "Oklahoma" ||
      states === "Oregon" ||
      states === "Palmyra Atoll" ||
      states === "Pennsylvania" ||
      states === "Puerto Rico" ||
      states === "Rhode Island" ||
      states === "South Carolina" ||
      states === "South Dakota" ||
      states === "Tennessee" ||
      states === "Texas" ||
      states === "United States Minor Outlying Islands" ||
      states === "United States Virgin Islands" ||
      states === "Utah" ||
      states === "Vermont" ||
      states === "Virginia" ||
      states === "Wake Island" ||
      states === "Washington" ||
      states === "West Virginia" ||
      states === "Wisconsin" ||
      states === "Wyoming"
    )
  ) {
    throw [400, `${variableName} is not from valid values list`];
  }
  return string;
}

function validateNumber(string, variableName) {
  let result = Number(string);
  if (isNaN(result)) {
    throw [400, `${variableName} is not a valid number`];
  }
  return string;
}

function checkPassword(string, variableName) {
  let scFlag = 0;
  let capsFlag = 0;
  let numsFlag = 0;
  const specialCharacters = `\`!@#$%^&*()_+={};':"\\|<>\/?~`;
  const r1 = specialCharacters.split("").some((sCh) => {
    if (string.includes(sCh)) {
      scFlag = 1;
      return true;
    } else {
      return false;
    }
  });
  const alphabets = `ABCDEFGHIJKLMNOPQRSTUVWXYZ`;
  const r2 = alphabets.split("").some((sCh) => {
    if (string.includes(sCh)) {
      capsFlag = 1;
      return true;
    } else {
      return false;
    }
  });
  const numbers = `0123456789`;
  const r3 = numbers.split("").some((sCh) => {
    if (string.includes(sCh)) {
      numsFlag = 1;
      return true;
    } else {
      return false;
    }
  });
  if (
    !((r1 && r2 && r3) || (scFlag === 1 && capsFlag === 1 && numsFlag === 1))
  ) {
    throw [
      400,
      `Error: Password should have atleast one special charcter, one capital letter, one number`,
    ];
  } else {
    return string;
  }
}

function checkIsProperId(id) {
  if (!ObjectId.isValid(id)) {
    throw [400, `Invalid Object ID`];
  }
  return id;
}

function validateLatitudeLongitude(string, variableName) {
  string = string.trim();
  let re = /^((\-?|\+?)?\d+(\.\d+)?)$/gi;
  result = re.test(string);
  if (!result) {
    throw [400, `${variableName} is not valid`];
  }
  return string;
}

function isEmptyObject(obj) {
  return Object.keys(obj).length === 0;
}

function dateFormat(input) {
  var pattern = /(\d{4})\-(\d{2})\-(\d{2})/;
  if (!input || !input.match(pattern)) {
    return null;
  }
  return input.replace(pattern, "$2/$3/$1");
}

function getRestaurantCapacity(restaurant) {
  let restaurantCapacity = 0;
  let p = restaurant.restaurantTableCapacities;
  for (var key in p) {
    if (p.hasOwnProperty(key)) {
      restaurantCapacity = restaurantCapacity + key * p[key];
    }
  }
  return restaurantCapacity;
}

var getTableCombinations = function (candidates, target) {
  candidates.sort((a, b) => a - b);
  return backtrack(candidates, target);
};

var backtrack = function (candidates, target) {
  let res = [];

  for (const [ind, candidate] of candidates.entries()) {
    if (candidates[ind - 1] == candidate) continue;
    if (candidate < target) {
      let subResult = backtrack(candidates.slice(ind + 1), target - candidate);
      subResult.map((sub) => sub.unshift(candidate));
      if (subResult.length > 0) res.push(...subResult);
    } else {
      if (candidate == target) res.push([candidate]);
      break;
    }
  }

  return res;
};

//Restaurant route helpers

function getClosingTime(time) {
  let openingTimeHour = parseInt(time.split(":")[0]);
  let openingTimeMin = parseInt(time.split(":")[1]);

  openingTimeHour = openingTimeHour - 2;
  if (openingTimeHour.toString().length == 1) {
    openingTimeHour = "0" + openingTimeHour;
  }
  if (openingTimeMin.toString().length == 1) {
    openingTimeMin = "0" + openingTimeMin;
  }
  return openingTimeHour + ":" + openingTimeMin;
}
function getAllTime(time) {
  let getAllTimeArray = [];
  getAllTimeArray.push(time);
  let openingTimeHour = parseInt(time.split(":")[0]);
  let openingTimeMin = parseInt(time.split(":")[1]);

  for (let i = 0; i < 3; i++) {
    ///fix 24 +
    if (openingTimeMin == 0) openingTimeMin = 30;
    else {
      openingTimeHour = openingTimeHour + 1;
      openingTimeMin = 0;
    }
    if (openingTimeHour.toString().length == 1) {
      currentTimeHour = "0" + openingTimeHour;
    } else {
      currentTimeHour = openingTimeHour;
    }
    if (openingTimeMin.toString().length == 1) {
      currentTimeMin = "0" + openingTimeMin;
    } else {
      currentTimeMin = openingTimeMin;
    }
    currentTime = currentTimeHour + ":" + currentTimeMin;
    getAllTimeArray.push(currentTime);
  }
  return getAllTimeArray;
}

function getTimeSlots(openingTime, closingTime) {
  let availabilityArray = [];
  let currentTime = "";
  let currentTimeHour = "";
  let currentTimeMin = "";
  let openingTimeHour = parseInt(openingTime.split(":")[0]);
  let openingTimeMin = parseInt(openingTime.split(":")[1]);
  closingTime = getClosingTime(closingTime);
  availabilityArray.push(openingTime);

  while (currentTime != closingTime) {
    if (openingTimeMin == 0) openingTimeMin = 30;
    else {
      openingTimeHour = openingTimeHour + 1;
      openingTimeMin = 0;
    }
    if (openingTimeHour.toString().length == 1) {
      currentTimeHour = "0" + openingTimeHour;
    } else {
      currentTimeHour = openingTimeHour;
    }
    if (openingTimeMin.toString().length == 1) {
      currentTimeMin = "0" + openingTimeMin;
    } else {
      currentTimeMin = openingTimeMin;
    }
    currentTime = currentTimeHour + ":" + currentTimeMin;
    availabilityArray.push(currentTime);
  }
  return availabilityArray;
}

function objectToArrayOfAvailability(object) {
  let availabilityObject = object;
  let availabilityArray = [];
  for (var key in availabilityObject) {
    if (availabilityObject.hasOwnProperty(key)) {
      for (let i = 0; i < availabilityObject[key]; i++) {
        availabilityArray.push(key);
      }
    }
  }
  return availabilityArray;
}
function getTableCombinationSlots(availabilityObject, guests) {
  availabilityArray = objectToArrayOfAvailability(availabilityObject);

  if (guests % 2 == 0) {
    guests = parseInt(guests);
  } else {
    guests = parseInt(guests) + 1;
  }

  if (getTableCombinations(availabilityArray, guests).length == 0)
    throw {
      name: "noSeats",
      message: "There are no available seats for chosen requirements!",
    };

  var tableCombinations = getTableCombinations(availabilityArray, guests);
  var tableCombinationSlots = [];
  for (let i = 0; i < tableCombinations.length; i++) {
    tableCombinationSlots.push(tableCombinations[i].join(" and "));
  }
  return tableCombinationSlots;
}

function validateCategory(string, variableName) {
  let category = string.trim();
  if (
    !(
      category === "Pizza" ||
      category === "Bakery" ||
      category === "Steakhouse" ||
      category === "Indian" ||
      category === "Asian" ||
      category === "English" ||
      category === "Thai" ||
      category === "Chinese" ||
      category === "Japanese" ||
      category === "American" ||
      category === "English" ||
      category === "Mexican" ||
      category === "Mediterenean"
    )
  ) {
    throw [400, `${variableName} is not from valid values list`];
  }
  return string;
}

function checkForSpaces(string) {
  let spaces = /\s/g;
  let result = string.match(spaces);
  if (result) {
    return true;
  } else {
    return false;
  }
}

function isValidDate(dateString) {
  // First check for the pattern
  if (!/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(dateString)) return false;

  // Parse the date parts to integers
  var parts = dateString.split("/");
  var day = parseInt(parts[1], 10);
  var month = parseInt(parts[0], 10);
  var year = parseInt(parts[2], 10);

  // Check the ranges of month and year
  if (year < 1000 || year > 3000 || month == 0 || month > 12) return false;

  var monthLength = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  // Adjust for leap years
  if (year % 400 == 0 || (year % 100 != 0 && year % 4 == 0))
    monthLength[1] = 29;

  // Check the range of the day
  return day > 0 && day <= monthLength[month - 1];
}

function checkBookingDate(date) {
  date = dateFormat(date);
  const futureDate = new Date();
  futureDate.setMonth(futureDate.getMonth() + 12);

  if (!isValidDate(date)) {
    throw "Input is not in valid date format (mm/dd/yyy)";
  }
  let varDate = new Date(date);
  let today = new Date();
  today.setHours(0, 0, 0, 0);

  if (varDate < today) {
    throw "Input date had passed, unable to book";
  }
  if (varDate > futureDate) {
    throw "Sorry, Unable to book more than a year advance";
  }
  return date;
}

function isInDesiredForm(str) {
  str = checkIsProperString(str);
  var n = Math.floor(Number(str));
  return n !== Infinity && String(n) === str && n >= 0;
}

function checkGuests(str) {
  str = checkIsProperString(str, "Guests");
  if (!isInDesiredForm(str)) {
    throw "Number of guests should be a postive number";
  }
  if (parseInt(str) == 1) {
    throw "Number of Guests should be atleast two, for single guests, bar seating is available, contact restaurant directly";
  }
  return str;
}

function checkInputTime(str) {
  str = checkIsProperString(str, Guests);
  return str;
}

module.exports = {
  checkIsProperString,
  checkIsProperArray,
  validateEmail,
  validatePhoneNumber,
  validateName,
  validateCity,
  validateState,
  validateNumber,
  checkPassword,
  checkIsProperId,
  validateLatitudeLongitude,
  isEmptyObject,
  dateFormat,
  getRestaurantCapacity,
  getTableCombinations,
  getAllTime,
  getTimeSlots,
  objectToArrayOfAvailability,
  getTableCombinationSlots,
  validateCategory,
  checkForSpaces,
  checkBookingDate,
  checkGuests,
  checkInputTime,
};
