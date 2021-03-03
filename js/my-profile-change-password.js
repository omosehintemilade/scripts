window.addEventListener("load", runOnLoad);

function runOnLoad() {
  const username = document.querySelector(".userfullname");
  const oldPassword = document.querySelector(".old-password");
  const newPassword = document.querySelector(".new-password");
  const confirmPassword = document.querySelector(".confirm-password");
  const errorMessage = document.querySelector(".error-message");
  const submitBtn = document.querySelector(".bm");
  const userData = JSON.parse(localStorage.getItem("data"));

  username.innerHTML = userData.fullName;
  const token = localStorage.getItem("token");

  submitBtn.addEventListener("click", e => {
    e.preventDefault();
    if (newPassword.value === confirmPassword.value) {
      $.ajax({
        url: "https://aluuka-backend.herokuapp.com",
        contentType: "application/json",
        type: "POST",
        headers: {
          authorization: `Bearer ${JSON.parse(token)} `
        },

        data: JSON.stringify({
          query: `mutation {
  updatePassword(
previousPassword: "${oldPassword.value}"
    newPassword: "${newPassword.value}"
    repeatNewPassword: "${confirmPassword.value}"
  ) {
    success
    message
    data
    token
  }
}`
        }),
        success: function (result) {
          errorMessage.style.display = "block";
          errorMessage.style.background = "#43a047";
          errorMessage.innerHTML = result.data.updatePassword.message;
          errorMessage.animate({ top: "30px" }, 900, "linear");
          setTimeout(function () {
            errorMessage.style.display = "none";
          }, 2000);
          oldPassword.value = "";
          newPassword.value = "";
          confirmPassword.value = "";
        },

        error: function (err) {
          console.log(err);
          errorMessage.style.display = "block";
          errorMessage.style.background = "#c62828";
          errorMessage.innerHTML = result.data.updatePassword.message;
          errorMessage.animate({ top: "30px" }, 900, "linear");
          setTimeout(function () {
            errorMessage.style.display = "none";
          }, 2000);
        }
      });
    } else {
      errorMessage.style.display = "block";
      errorMessage.style.background = "#c62828";
      errorMessage.innerHTML =
        "New pasword and confirm password does not match";
      errorMessage.animate({ top: "30px" }, 900, "linear");
      setTimeout(function () {
        errorMessage.style.display = "none";
      }, 2000);
    }
  });
}
