(function () {
  let restaurantForm = document.getElementById("restaurant-form");

  const errorContainer = document.getElementById("error-container");
  const errorTextElement =
    errorContainer.getElementsByClassName("text-goes-here")[0];

  if (restaurantForm) {
    restaurantForm.addEventListener("submit", (event) => {
      let errorFlag = 0;
      let errors = [];

      let firstNameValue = firstName.value;
      if (!firstNameValue) {
        errorFlag += 1;
        errors.push("First Name is not defined");
      }

      if (errorFlag !== 0) {
        event.preventDefault();
        errorTextElement.textContent = `${errors}`;
        errorContainer.classList.remove("hidden");
      }
    });
  }
})();
