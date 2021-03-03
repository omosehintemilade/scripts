window.addEventListener("load", runOnLoad);

const signOut = document.querySelector(".sign-out");

function runOnLoad() {
  const fullname = document.querySelector(".onboarding_complete_fullname");
  const dob = document.querySelector(".create_patient_dob");
  const gender = document.querySelector(".onboarding_complete_gender");
  const country = document.querySelector(".onboarding_complete_country");
  const address = document.querySelector(".onboarding_complete_address");
  const email = document.querySelector(".onboarding_complete_email");
  const phone = document.querySelector(".onboarding_complete_phone");
  const notfemail = document.querySelector("#notfemail");
  const notfphone = document.querySelector("#notfphone");
  const submitBtn = document.querySelector(".onboard-comp-submit");
  const deleteBtn = document.querySelector(".mpe-button-delete");
  const errorMessage = document.querySelector(".error-message");
  const username = document.querySelector(".userfullname");

  $.get("https://restcountries.eu/rest/v2/all").done(function (data) {
    data.map(function (i) {
      $(".onboarding_complete_country").append(`<option value="${i.name}"> 
                                       ${i.name} 
                                  </option>`);
    });
  });

  const token = localStorage.getItem("token");
  let pictureURL = "";

  const userData = JSON.parse(localStorage.getItem("data"));
  console.log(userData);

  username.innerHTML = userData.fullName;

  if (!userData) {
    document.location.href = "/hospital-care-provider/login.html";
  }

  deleteBtn.addEventListener("click", () => {
    pictureURL = "";
  });

  submitBtn.addEventListener("click", e => {
    e.preventDefault();

    const notificationChannel = [];

    const NotificationChannel = { email: "email", phone: "phone" };

    if (notfemail.checked) {
      notificationChannel.push(NotificationChannel.email);
    }
    if (notfphone.checked) {
      notificationChannel.push(NotificationChannel.phone);
    }

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
    }

    $.ajax({
      url: "https://aluuka-backend.herokuapp.com",
      contentType: "application/json",
      type: "POST",
      headers: {
        authorization: `Bearer ${JSON.parse(token)} `
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
        pictureURL: "${pictureURL}"
        notificationChannel:[${notificationChannel}]
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
        document.location.href = "/hospital-care-provider/my-profile.html";
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
      },
      error: function (err) {
        console.log(err);
      }
    });
  });
}

signOut.addEventListener("click", () => {
  localStorage.clear();
  document.location.href = "/hospital-care-provider/login.html";
});
