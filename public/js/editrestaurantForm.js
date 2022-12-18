(function () {
  let editrestaurantForm = document.getElementById("editrestaurant-form");

  const errorContainer = document.getElementById("error-container");
  const errorTextElement =
    errorContainer.getElementsByClassName("text-goes-here")[0];

  if (editrestaurantForm) {
    let name = document.getElementById("firstnameInput");
    let emailId = document.getElementById("emailId");
    let contactInfo = document.getElementById("contactInfo");
    let description = document.getElementById("description");
    let priceRange = document.getElementById("priceRange");
    let category = document.getElementById("category");
    let address = document.getElementById("address");
    let city = document.getElementById("city");
    let state = document.getElementById("state");
    let zip = document.getElementById("zip");
    let latitude = document.getElementById("latitude");
    let longitude = document.getElementById("longitude");
    let openingTime = document.getElementById("openingTime");
    let closingTime = document.getElementById("closingTime");
    let TableFor2 = document.getElementById("TableFor2");
    let TableFor4 = document.getElementById("TableFor4");
    let TableFor6 = document.getElementById("TableFor6");
    let TableFor8 = document.getElementById("TableFor8");
    let TableFor10 = document.getElementById("TableFor10");

    editrestaurantForm.addEventListener("submit", (event) => {
      let errorFlag = 0;
      let errors = [];

      let nameValue = name.value;
      let emailIdValue = emailId.value;
      let contactInfoValue = contactInfo.value;
      let descriptionValue = description.value;
      let priceRangeValue = priceRange.value;
      let categoryValue = category.value;
      let addressValue = address.value;
      let cityValue = city.value;
      let stateValue = state.value;
      let zipValue = zip.value;
      let latitudeValue = latitude.value;
      let longitudeValue = longitude.value;
      let openingTimeValue = openingTime.value;
      let closingTimeValue = closingTime.value;
      let TableFor2Value = TableFor2.value;
      let TableFor4Value = TableFor4.value;
      let TableFor6Value = TableFor6.value;
      let TableFor8Value = TableFor8.value;
      let TableFor10Value = TableFor10.value;
      if (!nameValue) {
        errorFlag += 1;
        errors.push("First Name is not defined");
      }
      if (!emailIdValue) {
        errorFlag += 1;
        errors.push("First Name is not defined");
      }
      if (!contactInfoValue) {
        errorFlag += 1;
        errors.push("First Name is not defined");
      }
      if (!descriptionValue) {
        errorFlag += 1;
        errors.push("First Name is not defined");
      }
      if (!priceRangeValue) {
        errorFlag += 1;
        errors.push("First Name is not defined");
      }
      if (!categoryValue) {
        errorFlag += 1;
        errors.push("First Name is not defined");
      }
      if (!addressValue) {
        errorFlag += 1;
        errors.push("First Name is not defined");
      }
      if (!cityValue) {
        errorFlag += 1;
        errors.push("First Name is not defined");
      }
      if (!stateValue) {
        errorFlag += 1;
        errors.push("First Name is not defined");
      }
      if (!zipValue) {
        errorFlag += 1;
        errors.push("First Name is not defined");
      }
      if (!latitudeValue) {
        errorFlag += 1;
        errors.push("First Name is not defined");
      }
      if (!longitudeValue) {
        errorFlag += 1;
        errors.push("First Name is not defined");
      }
      if (!openingTimeValue) {
        errorFlag += 1;
        errors.push("First Name is not defined");
      }
      if (!closingTimeValue) {
        errorFlag += 1;
        errors.push("First Name is not defined");
      }
      if (!TableFor2Value) {
        errorFlag += 1;
        errors.push("TableFor2 is not defined");
      }
      if (!TableFor4Value) {
        errorFlag += 1;
        errors.push("TableFor4 is not defined");
      }
      if (!TableFor6Value) {
        errorFlag += 1;
        errors.push("TableFor6 is not defined");
      }
      if (!TableFor8Value) {
        errorFlag += 1;
        errors.push("TableFor8 is not defined");
      }
      if (!TableFor10Value) {
        errorFlag += 1;
        errors.push("TableFor10 is not defined");
      }

      try {
        validateCity(nameValue, "editrestaurant Name");
      } catch (e) {
        errorFlag += 1;
        errors.push(e[1]);
      }
      try {
        validateEmail(emailIdValue, "Email ID");
      } catch (e) {
        errorFlag += 1;
        errors.push(e[1]);
      }
      try {
        validatePhoneNumber(contactInfoValue, "Phone Number");
      } catch (e) {
        errorFlag += 1;
        errors.push(e[1]);
      }
      try {
        validateNumber(priceRangeValue, "Price Range");
      } catch (e) {
        errorFlag += 1;
        errors.push(e[1]);
      }
      try {
        validateCategory(categoryValue, "Category");
      } catch (e) {
        errorFlag += 1;
        errors.push(e[1]);
      }
      try {
        validateCity(cityValue, "City");
      } catch (e) {
        errorFlag += 1;
        errors.push(e[1]);
      }
      try {
        if (!(stateValue !== "New Jersey" || stateValue !== "New York")) {
          throw [400, `Currently servicing only in New York and New Jersey`];
        }
      } catch (e) {
        errorFlag += 1;
        errors.push(e[1]);
      }
      try {
        zip = helper.validateNumber(zipValue, "Zip");
        if (zip.length != 5) {
          throw [400, `Zip Code Invalid Length`];
        }
      } catch (e) {
        errorFlag += 1;
        errors.push(e[1]);
      }
      try {
        validateLatitudeLongitude(latitudeValue, "Latitude");
      } catch (e) {
        errorFlag += 1;
        errors.push(e[1]);
      }
      try {
        validateLatitudeLongitude(longitudeValue, "Longitude");
      } catch (e) {
        errorFlag += 1;
        errors.push(e[1]);
      }
      try {
        validateTime(openingTimeValue, "Opening Time");
      } catch (e) {
        errorFlag += 1;
        errors.push(e[1]);
      }
      try {
        validateTime(closingTimeValue, "Closing Time");
      } catch (e) {
        errorFlag += 1;
        errors.push(e[1]);
      }
      try {
        compareTime(closingTimeValue, openingTimeValue);
      } catch (e) {
        errorFlag += 1;
        errors.push(e[1]);
      }
      try {
        validateNumber(TableFor2Value, "TableFor2");
      } catch (e) {
        errorFlag += 1;
        errors.push(e[1]);
      }
      try {
        validateNumber(TableFor4Value, "TableFor4");
      } catch (e) {
        errorFlag += 1;
        errors.push(e[1]);
      }
      try {
        validateNumber(TableFor6Value, "TableFor6");
      } catch (e) {
        errorFlag += 1;
        errors.push(e[1]);
      }
      try {
        validateNumber(TableFor8Value, "TableFor8");
      } catch (e) {
        errorFlag += 1;
        errors.push(e[1]);
      }
      try {
        validateNumber(TableFor10Value, "TableFor10");
      } catch (e) {
        errorFlag += 1;
        errors.push(e[1]);
      }

      if (errorFlag !== 0) {
        event.preventDefault();
        errorTextElement.textContent = `${errors[0]}`;
        errorContainer.classList.remove("hidden");
      }
    });
  }
})();

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

function validateTime(string, variableName) {
  string = string.trim();
  let a = string.split(":");
  if (a.length != 2) {
    throw [400, `Invalid Time Format`];
  }
  let a1 = a[0];
  let a2 = a[1];
  if (a1.length != 2) {
    throw [
      400,
      `Invalid Time Format, ${variableName} should be in hh:mm format`,
    ];
  }
  if (a2.length != 2) {
    throw [
      400,
      `Invalid Time Format, ${variableName} should be in hh:mm format`,
    ];
  }

  if (isNaN(Number(a1))) {
    throw [
      400,
      `Invalid Time Format, ${variableName} should be in hh:mm format`,
    ];
  }
  if (isNaN(Number(a2))) {
    throw [
      400,
      `Invalid Time Format, ${variableName} should be in hh:mm format`,
    ];
  }
  if (!(Number(a1) < 24 || Number(a1) >= 0)) {
    throw [
      400,
      `Invalid Time Format, ${variableName} should be in hh:mm format`,
    ];
  }
  if (!(Number(a2) == 30 || Number(a2) == 0)) {
    throw [400, `Time attributes allowed in half hourly intervals`];
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

function compareTime(bigTime, smallTime) {
  bigTime = bigTime.trim();
  smallTime = smallTime.trim();
  let a = bigTime.split(":");
  let a1 = a[0];
  let a2 = a[1];

  let b = smallTime.split(":");
  let b1 = b[0];
  let b2 = b[1];

  if (parseInt(a1) < parseInt(b1)) {
    throw [400, "Closing Time is before Opening Time"];
  }
  if (parseInt(a1) == parseInt(b1)) {
    if (parseInt(a2) < parseInt(b2)) {
      throw [400, "Closing Time is before Opening Time"];
    }
  }
  return true;
}
