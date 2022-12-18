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
  validateCategory,
  checkForSpaces,
};
