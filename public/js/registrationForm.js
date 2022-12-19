(function () {
  let registrationForm = document.getElementById("registration-form");

  let errorContainer = document.getElementById("error-container");
  let errorTextElement =
    errorContainer.getElementsByClassName("text-goes-here")[0];

  if (registrationForm) {
    let firstname = document.getElementById("firstnameInput");
    let lastname = document.getElementById("lastnameInput");
    let emailId = document.getElementById("emailId");
    let contactInfo = document.getElementById("contactInfo");
    let age = document.getElementById("age");
    let city = document.getElementById("city");
    let state = document.getElementById("state");
    let password = document.getElementById("password");

    registrationForm.addEventListener("submit", (event) => {
      errorContainer.classList.add("hidden");
      let errorFlag = 0;
      let errors = [];

      let firstnameValue = firstname.value;
      let lastnameValue = lastname.value;
      let emailIdValue = emailId.value;
      let contactInfoValue = contactInfo.value;
      let ageValue = age.value;
      let cityValue = city.value;
      let stateValue = state.value;
      let passwordValue = password.value;

      if (!firstnameValue) {
        errorFlag += 1;
        errors.push("First Name is not defined");
      }
      if (firstnameValue.length < 2) {
        errorFlag += 1;
        errors.push("First Name should be longer than 2");
      }
      try {
        validateName(firstnameValue, "First Name");
      } catch (e) {
        errorFlag += 1;
        errors.push(e[1]);
      }

      if (!lastnameValue) {
        errorFlag += 1;
        errors.push("Last Name is not defined");
      }
      if (lastnameValue.length < 2) {
        errorFlag += 1;
        errors.push("Last Name should be longer than 2");
      }
      try {
        validateName(lastnameValue, "Last Name");
      } catch (e) {
        errorFlag += 1;
        errors.push(e[1]);
      }

      if (!emailIdValue) {
        errorFlag += 1;
        errors.push("Email ID Name is not defined");
      }
      try {
        validateEmail(emailIdValue, "Email ID");
      } catch (e) {
        errorFlag += 1;
        errors.push(e[1]);
      }

      if (!contactInfoValue) {
        errorFlag += 1;
        errors.push("Phone Number is not defined");
      }
      try {
        validatePhoneNumber(contactInfoValue, "Phone Number");
      } catch (e) {
        errorFlag += 1;
        errors.push(e[1]);
      }

      if (!ageValue) {
        errorFlag += 1;
        errors.push("Age is not defined");
      }
      try {
        validateNumber(ageValue, "Age");
      } catch (e) {
        errorFlag += 1;
        errors.push(e[1]);
      }

      if (!cityValue) {
        errorFlag += 1;
        errors.push("City is not defined");
      }
      try {
        validateCity(cityValue, "City");
      } catch (e) {
        errorFlag += 1;
        errors.push(e[1]);
      }

      if (!stateValue) {
        errorFlag += 1;
        errors.push("State is not defined");
      }
      try {
        validateState(stateValue, "State");
      } catch (e) {
        errorFlag += 1;
        errors.push(e[1]);
      }

      if (!passwordValue) {
        errorFlag += 1;
        errors.push("Password is not defined");
      }
      try {
        checkPassword(passwordValue, "Password");
      } catch (e) {
        errorFlag += 1;
        errors.push(e[1]);
      }

      if (errorFlag !== 0) {
        event.preventDefault();
        errorContainer.classList.remove("hidden");
        errorTextElement.textContent = `${errors[0]}`;
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
  string = string.trim();
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
