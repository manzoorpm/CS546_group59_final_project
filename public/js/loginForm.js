(function () {
  let loginForm = document.getElementById("login-form");

  const errorContainer = document.getElementById("error-container");
  const errorTextElement =
    errorContainer.getElementsByClassName("text-goes-here")[0];

  if (loginForm) {
    let username = document.getElementById("floatingInput");
    let password = document.getElementById("floatingPassword");

    loginForm.addEventListener("submit", (event) => {
      let errorFlag = 0;
      let errors = [];

      let usernameValue = username.value;
      let passwordValue = password.value;
      if (!usernameValue) {
        errorFlag += 1;
        errors.push("Email/Phone Number is not supplied");
      }
      if (!passwordValue) {
        errorFlag += 1;
        errors.push("Password is not supplied");
      }

      if (errorFlag !== 0) {
        event.preventDefault();
        errorTextElement.textContent = `${errors[0]}`;
        errorContainer.classList.remove("hidden");
      }
    });
  }
})();
