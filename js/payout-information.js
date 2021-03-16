window.addEventListener("load", runOnLoad);
let token = localStorage.getItem("token")
$('body').prepend('<div class="error-message"></div>');

function runOnLoad() {

  
  $(".sign-out").click(function () {
    localStorage.clear();
    var loc = `${$(location).attr("origin")}/health-care-provider/login.html`;
    $(location).attr("href", loc);
  });
  const dashboardBtn = document.querySelector(".div-block-126 .button-medium");
  const closeBtn = document.querySelectorAll(".close-modal");
  const modal = document.querySelector(".box");
  const paypalCheckbox = document.querySelector(".paypal-checkbox");
  const paypalModal = document.querySelector(".box");
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
	const errorMessage = $(".error-message");
  

  const payoutMethod = [];

  let PayoutMethod = { paypal: "Paystack", bank: "Bank" };



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
    // const paymentData = "Paystack";
    
    localStorage.setItem("paymentData", paymentData);
    console.log(paypalEmail.value);
    paymentData.paypalEmail = paypalEmail.value;
    closeModal();
  });

  submitBank.addEventListener("click", () => {
    console.log(bankNum.value);
    console.log(swiftCode.value);
    paymentData.bankNum = bankNum.value;
    paymentData.swiftCode = swiftCode.value;
    closeModal();
  });

dashboardBtn.addEventListener("click", e => {
  if (paypalCheckbox.checked) {
    if (payoutMethod.includes(payoutMethod.paypal)) {
        console.log(payoutMethod);
           PayoutMethod.push(Paystack);
        return;
      }
    }
    if (bankCheckbox.checked) {
      if (payoutMethod.includes(PayoutMethod.bank)) {
        PayoutMethod.push(Bank);
        return;
      }
    }

    console.log(PayoutMethod);

    const userData = JSON.parse(localStorage.getItem("data"));
    const userID = userData.id;
    console.log(userID);
  $.ajax({
    url: "https://aluuka-graph.herokuapp.com",
    contentType: "application/json",
    type: "POST",
    headers: {
      authorization: `Bearer ${JSON.parse(token)} `
    },

    data: JSON.stringify({
      query: `mutation {
        onboardingCompletePayoutInformation(
          payoutMethod: Paystack
          payoutAccountNumberOrEmail: "${paymentData}"
          payoutAccountSwiftCode: ""
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
      if (!result.data.onboardingCompletePayoutInformation.success) {
        errorMessage.css("display", "block");
        errorMessage.css("background", "#c62828");
        errorMessage.html(
          result.data.onboardingCompleteProfile.message);
          console.log(result.data.onboardingCompleteProfile.message);
        errorMessage.animate({ top: "30px" }, 900, "linear");
      }
      // document.location.href =
      //   "/hospital-care-provider/medical-practice.html";
      else{
      console.log(result.data.onboardingCompletePayoutInformation.message);
      errorMessage.css("display", "block");
      errorMessage.css("background", "#43a047");
      errorMessage.html(
        result.data.onboardingCompletePayoutInformation.message);
        console.log(result.data.onboardingCompletePayoutInformation.message);
      errorMessage.animate({ top: "30px" }, 900, "linear");
      setTimeout(function () {
        errorMessage.style.display = "none";
      }, 2000);
      localStorage.setItem(
        "data",
        JSON.stringify(result.data.onboardingCompletePayoutInformation.data)
      );
      
      document.location.href =
        "/health-care-provider/treatments-main-dashboard.html";
      }
    },
    error: function (err) {
      console.log(err);
    }
  });
});

}