window.addEventListener("load", runOnLoad);

function runOnLoad() {
  const fullname = document.querySelector(".onboarding_complete_fullname");
  const dob = document.querySelector(".onboarding_complete_dob");
  const gender = document.querySelector(".onboarding_complete_gender");
  const country = document.querySelector(".country-field");
  const address = document.querySelector(".onboarding_complete_address");
  const email = document.querySelector(".onboarding_complete_email");
  const phone = document.querySelector(".onboarding_complete_phone");
  const notfemail = document.querySelector("#notfemail");
  const notfphone = document.querySelector("#notfphone");
  const submitBtn = document.querySelector(".onboard-comp-submit");
  const deleteBtn = document.querySelector(".button-plain-icon");
  const errorMessage = document.querySelector(".error-message");

  $.get("https://restcountries.eu/rest/v2/all").done(function (data) {
    data.map(function (i) {
      $(".country-field").append(`<option value="${i.name}"> 
                                       ${i.name} 
                                  </option>`);
    });
  });

  let token = localStorage.getItem("token")
  // REMOVE PRECEEDING & TRAILING QUOTE SYMBOLS
  token = token.substring(1, token.length - 1);

  let pictureURL = "";

  deleteBtn.addEventListener("click", e => {
    pictureURL = "";
  });

  submitBtn.addEventListener("click", e => {
    e.preventDefault();
    e.target.value = "Saving...";
    const notificationChannel = [];

    const NotificationChannel = { email: "email", phone: "phone" };

    if (notfemail.checked) {
      notificationChannel.push(NotificationChannel.email);
    }
    if (notfphone.checked) {
      notificationChannel.push(NotificationChannel.phone);
    }
    console.log(notificationChannel);
    if (
      !fullname.value ||
      !dob.value ||
      !gender.value ||
      !country.value ||
      !address.value ||
      !phone.value ||
      !email.value
    ) {
      errorMessage.style.display = "block";
      errorMessage.style.background = "#c62828";
      errorMessage.innerHTML = "Please fill in all field....";
      errorMessage.animate({ top: "30px" }, 900, "linear");
      setTimeout(function () {
        errorMessage.style.display = "none";
      }, 2000);
      return;
    }

    $.ajax({
      url: "https://aluuka-backend.herokuapp.com",
      contentType: "application/json",
      type: "POST",
      headers: {
        authorization: `Bearer ${token} `
      },

      data: JSON.stringify({
        query: `mutation {
      onboardingCompleteProfile(
        fullName: "${fullname.value}"
        dob: "${dob.value}"
        gender: "${gender.value}"
        country: "${country.value}"
        address: "${address.value}"
        phone: "${phone.value}"
        email: "${email.value}"
        notificationChannel: [${notificationChannel}]
      ) {
        success
        message
        returnStatus
        data
        token
      }
    }`
      }),
      success: function (result) {
        console.log(result);
        if (!result.data.onboardingCompleteProfile.success) {
          errorMessage.style.display = "block";
          errorMessage.style.background = "#c62828";
          errorMessage.innerHTML =
            result.data.onboardingCompleteProfile.message;
          errorMessage.animate({ top: "30px" }, 900, "linear");
        }
        console.log(result.data.onboardingCompleteProfile.message);
        errorMessage.style.display = "block";
        errorMessage.style.background = "#43a047";
        errorMessage.innerHTML = result.data.onboardingCompleteProfile.message;
        errorMessage.animate({ top: "30px" }, 900, "linear");
        setTimeout(function () {
          errorMessage.style.display = "none";
        }, 2000);
        localStorage.setItem(
          "data",
          JSON.stringify(result.data.onboardingCompleteProfile.data)
        );
        document.location.href =
          "/hospital-care-provider/medical-practice.html";
        e.target.value = "Next: Medical Practice";
      },
      error: function (err) {
        console.log(err);
      }
    });
  });
}
