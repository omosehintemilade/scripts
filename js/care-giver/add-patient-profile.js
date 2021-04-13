$(document).ready(function () {
  var errorMessage = $(".error-message");
  $.get("https://restcountries.eu/rest/v2/all").done(function (data) {
    data.map(function (i) {
      $(".create_patient_country").append(`<option value="${i.name}"> 
                                 ${i.name} 
                            </option>`);
    });
  });

  $(".div-block-50 > h4").html("Add Patient");
  $(".div-block-51").remove();

  let PATIENT_DOB;
  // CREATE DATE INPUT ELEMENT
  function initiateOrResetDateInput() {
    $("#Email-field-2").replaceWith(
      `<input
        id="selectDateElement"
        type="text"
        class="w-input"
        style="margin: auto;"
        placeholder="Enter Date" 
        onfocus="(this.type='date')" 
        onblur="if(this.value==''){this.type='text'}">`
    );
  }
  initiateOrResetDateInput();

  $("#selectDateElement").change(function (event) {
    let date = new Date(event.target.value);
    PATIENT_DOB = `${
      date.getMonth() + 1
    }-${date.getDate()}-${date.getFullYear()}`;
  });

  var print_fname = $(".print_fname");
  $(".create_patient_fullname").keyup(function (event) {
    newText = event.target.value;
    $(".print_fname").text(newText);
  });
  var errorMessage = $(".error-message");
  const token = localStorage.getItem("token");
  const userData = JSON.parse(localStorage.getItem("data"));
  if (!userData) {
    var loc = `${$(location).attr("origin")}/care-giver/login.html`;
    $(location).attr("href", loc);
  }
  const userfullname = userData.fullName;
  $(".userfullname").html(`${userfullname}`);
  // Create Patient
  $(".create-patient-submit").click(function (event) {
    event.preventDefault();
    const fullName = $(".create_patient_fullname").val();
    const dob = PATIENT_DOB || $(".create_patient_dob").val();
    const gender = $("select.create_patient_gender option")
      .filter(":selected")
      .val();
    const country = $("select.create_patient_country option")
      .filter(":selected")
      .val();
    const address = $(".create_patient_address").val();
    const phone = $(".create_patient_phone").val();
    const email = $(".create_patient_email").val();
    var consent = true;
    $(".create-patient-submit").html("Please wait....");
    if (
      fullName === "" ||
      gender === "" ||
      country === "" ||
      address === "" ||
      phone === "" ||
      email === "" ||
      consent === ""
    ) {
      $(".create-patient-submit").html("Proceed");
      errorMessage.css("display", "block");
      errorMessage.css("background", "#c62828");
      errorMessage.html("Pls fill in all field....");
      errorMessage.animate({ top: "30px" }, 900, "linear", function () {
        console.log("Not cool");
      });
      errorMessage.animate({ top: "50px" }, 900, "linear", function () {
        console.log("Not cool");
      });
      setTimeout(function () {
        errorMessage.css("display", "none");
      }, 2000);
      return false;
    }
    const valid_date = new Date(dob);
    console.log(
      fullName,
      valid_date,
      gender,
      country,
      address,
      phone,
      email,
      consent
    );
    console.log("loading....");
    $.ajax({
      url: CONSTANTS.baseUrl,
      contentType: "application/json",
      type: "POST",
      headers: { authorization: `Bearer ${JSON.parse(token)}` },
      data: JSON.stringify({
        query: `mutation {
                                    createPatient(
                                        fullName: "${fullName}"
                                        dob: "${PATIENT_DOB || valid_date}"
                                        gender: "${gender}"
                                        country: "${country}"
                                        address: "${address}"
                                        phone: "${phone}"
                                        email: "${email}"
                                        acceptLegalConsent: ${consent}
                                    ) { 
                                            success
                                            message
                                            data
                                        }
                                }
                                `
      }),
      success: function (result) {
        if (!result.data.createPatient.success) {
          $(".create-patient-submit").html("Save");
          errorMessage.css("display", "block");
          errorMessage.css("background", "#c62828");
          errorMessage.html(result.data.createPatient.message);
          errorMessage.animate({ top: "30px" }, 900, "linear", function () {
            console.log(errorMessage);
          });
          errorMessage.animate({ top: "50px" }, 900, "linear", function () {
            console.log(errorMessage);
          });
          setTimeout(function () {
            errorMessage.css("display", "none");
          }, 2000);
        } else {
          $(".create-patient-submit").html("Save");
          errorMessage.css("display", "block");
          errorMessage.css("background", "#43a047");
          errorMessage.html(result.data.createPatient.message);
          errorMessage.animate({ top: "30px" }, 900, "linear", function () {
            console.log("All is cool");
          });
          errorMessage.animate({ top: "50px" }, 900, "linear", function () {
            console.log("All is cool");
          });
          setTimeout(function () {
            errorMessage.css("display", "none");
          }, 2000);
          var loc = `${$(location).attr(
            "origin"
          )}/care-giver/patient-profile-list.html`;
          $(location).attr("href", loc);
        }
        console.log(JSON.stringify(result.data));
      },
      error: function (err) {
        console.log(err);
      }
    });
  });
});
