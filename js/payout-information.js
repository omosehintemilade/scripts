window.addEventListener("load", runOnLoad);

function runOnLoad() {
  const dashboardBtn = document.querySelector(".button-medium");
  const closeBtn = document.querySelectorAll(".close-modal");
  const modal = document.querySelector(".box");
  const paypalCheckbox = document.querySelector(".paypal-checkbox");
  const bankModal = document.querySelector(".box-bank");
  const bankCheckbox = document.querySelector(".bank-checkbox");
  const paypalEmail = document.querySelector(".paypal-email");
  const swiftCode = document.querySelector(".bank-swift-code");
  const bankNum = document.querySelector(".bank-account");
  const submitBank = document.querySelector(".bank-submit");
  const submitPaypal = document.querySelector(".paypal-submit");
  const paymentData = {
    paypalEmail: "",
    bankNum: "",
    swiftCode: ""
  };
  const payoutMethod = [];

  const PayoutMethod = { paystack: "Paystack", bank: "Bank" };

  dashboardBtn.addEventListener("click", e => {
    if (paypalCheckbox.checked) {
      if (payoutMethod.includes(PayoutMethod.paystack)) {
        return;
      }
      payoutMethod.push(PayoutMethod.paystack);
    }
    if (bankCheckbox.checked) {
      if (payoutMethod.includes(PayoutMethod.bank)) {
        return;
      }
      payoutMethod.push(PayoutMethod.bank);
    }
   

// $.ajax({
//       url: "https://aluuka-backend.herokuapp.com",
//       contentType: "application/json",
//       type: "POST",
//       headers: {
//         authorization: `Bearer ${JSON.parse(token)} `
//       },

//       data: JSON.stringify({
//         query: `mutation {
//       onboardingCompleteProfile(
//         fullName: "${fullname.value}"
//         dob: "${dob.value}"
//         gender: "${gender.value}"
//         country: "${country.value}"
//         address: "${address.value}"
//         phone: "${phone.value}"
//         email: "${email.value}"
//         pictureURL: "${pictureURL}"
//         notificationChannel: [${notificationChannel}]
//       ) {
//         success
//         message
//         returnStatus
//         data
//         token
//       }
//     }`
//       }),
//       success: function (result) {
//         console.log(result);
//         if (!result.data.onboardingCompleteProfile.success) {
//           errorMessage.style.display = "block";
//           errorMessage.style.background = "#c62828";
//           errorMessage.innerHTML =
//             result.data.onboardingCompleteProfile.message;
//           errorMessage.animate({ top: "30px" }, 900, "linear");
//         }
//         document.location.href =
//           "/hospital-care-provider/medical-practice.html";
//         console.log(result.data.onboardingCompleteProfile.message);
//         errorMessage.style.display = "block";
//         errorMessage.style.background = "#43a047";
//         errorMessage.innerHTML = result.data.onboardingCompleteProfile.message;
//         errorMessage.animate({ top: "30px" }, 900, "linear");
//         setTimeout(function () {
//           errorMessage.style.display = "none";
//         }, 2000);
//         localStorage.setItem(
//           "data",
//           JSON.stringify(result.data.onboardingCompleteProfile.data)
//         );
//       },
//       error: function (err) {
//         console.log(err);
//       }
//     });




    document.location.href =
      "/hospital-care-provider/treatments-main-dashboard.html";
  });

  $.get("https://restcountries.eu/rest/v2/all").done(function (data) {
    data.map(function (i) {
      $(".payout-information-form-field").append(`<option value="${i.name}"> 
                                       ${i.name} 
                                  </option>`);
    });
  });

  closeBtn.forEach(btn => {
    btn.addEventListener("click", closeModal);
  });
  function closeModal() {
    modal.style.opacity = "0";
    modal.style.zIndex = "-10";
    bankModal.style.opacity = "0";
    bankModal.style.zIndex = "-10";
  }
  paypalCheckbox.addEventListener("click", e => {
    if (e.type === "click" && e.target.checked) {
      modal.style.display = "grid";
      modal.style.opacity = "1";
      modal.style.zIndex = "10";
    }
  });
  bankCheckbox.addEventListener("click", e => {
    if (e.type === "click" && e.target.checked) {
      bankModal.style.display = "grid";
      bankModal.style.opacity = "1";
      bankModal.style.zIndex = "10";
    }
  });

  submitPaypal.addEventListener("click", () => {
    paymentData.paypalEmail = paypalEmail.value;
    closeModal();
  });

  submitBank.addEventListener("click", () => {
    paymentData.bankNum = bankNum.value;
    paymentData.swiftCode = swiftCode.value;
    closeModal();
  });
}
