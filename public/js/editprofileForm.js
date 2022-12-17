(function () {
  let editprofileForm = document.getElementById("editprofile-form");

  const errorContainer = document.getElementById("error-container");
  const errorTextElement =
    errorContainer.getElementsByClassName("text-goes-here")[0];

  if (editprofileForm) {
    let firstname = document.getElementById("firstnameInput");
    let lastname = document.getElementById("lastnameInput");
    let emailId = document.getElementById("emailId");
    let contactInfo = document.getElementById("contactInfo");
    let age = document.getElementById("age");
    let city = document.getElementById("city");
    let state = document.getElementById("state");

    editprofileForm.addEventListener("submit", (event) => {
      let errorFlag = 0;
      let errors = [];

      let firstnameValue = firstname.value;
      let lastnameValue = lastname.value;
      let emailIdValue = emailId.value;
      let contactInfoValue = contactInfo.value;
      let ageValue = age.value;
      let cityValue = city.value;
      let stateValue = state.value;

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
        validateCity(stateValue, "State");
      } catch (e) {
        errorFlag += 1;
        errors.push(e[1]);
      }

      if (errorFlag !== 0) {
        event.preventDefault();
        errorTextElement.textContent = `${errors}`;
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
function validateNumber(string, variableName) {
  let result = Number(string);
  if (isNaN(result)) {
    throw [400, `${variableName} is not a valid number`];
  }
  return string;
}
