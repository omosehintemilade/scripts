$(document).ready(function () {
  $("body").prepend('<div class="error-message"></div>');

  $(".sex-field").html(`
  <option value="male">Male</option>
  <option value="female">Female</option>
  `);

  $.get("https://restcountries.eu/rest/v2/all").done(function (data) {
    data.map(function (i) {
      $(".country-field").append(`<option value="${i.name}">${i.name}</option>`);
    });
  });

  const token = localStorage.getItem("token");
  const userData = JSON.parse(localStorage.getItem("data"));
  if (!userData) {
    var loc = `${$(location).attr("origin")}/care-giver/login`;
    $(location).attr("href", loc);
  }
  const userfullname = userData.fullName;
  $(".userfullname").html(`${userfullname}`);
  function getUrlVars() {
    var vars = [],
      hash;
    var hashes = window.location.href.slice(window.location.href.indexOf("?") + 1).split("&");
    for (var i = 0; i < hashes.length; i++) {
      hash = hashes[i].split("=");
      vars.push(hash[0]);
      vars[hash[0]] = hash[1];
    }
    return vars;
  }
  var patient_id = getUrlVars()["patient_id"];
  let careGiverId;

  function showErrorMessageOnScreen(errorMessage, message, clear = true) {
    errorMessage.css("display", "block");
    errorMessage.css("background", "#c62828");
    errorMessage.html(message);
    errorMessage.animate(
      {
        top: "30px",
      },
      900,
      "linear"
    );
    errorMessage.animate(
      {
        top: "50px",
      },
      900,
      "linear"
    );
    setTimeout(function () {
      if (clear) {
        errorMessage.css("display", "none");
      }
    }, 2000);
    return false;
  }

  function showSuccessMessageOnScreen(errorMessage, message, clear = true) {
    errorMessage.css("display", "block");
    errorMessage.css("background", "mediumseagreen");
    errorMessage.html(message);
    errorMessage.animate(
      {
        top: "30px",
      },
      900,
      "linear"
    );
    errorMessage.animate(
      {
        top: "50px",
      },
      900,
      "linear"
    );
    setTimeout(function () {
      if (clear) {
        errorMessage.css("display", "none");
      }
    }, 2000);
    return false;
  }

  function hideAllScreenMessage() {
    $(".error-message").css("display", "none");
    $(".error-message").html("");
  }

  // Patient List
  $.ajax({
    url: CONSTANTS.baseUrl,
    contentType: "application/json",
    type: "POST",
    headers: { authorization: `Bearer ${JSON.parse(token)}` },
    data: JSON.stringify({
      query: `query {
                                  getPatientById(
                                    id: "${patient_id}"
                                  ) {
                                        id
                                      fullName
                                      email
                                      phone
                                      gender
                                      address
                                      country
                                      dob
                                      careGiverId
                                  }
                                }
                              `,
    }),
    success: function (result) {
      const patient_data = result.data.getPatientById;
      careGiverId = patient_data.careGiverId;
      const options = {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "2-digit",
      };
      const main_date = new Date(patient_data.dob).toLocaleDateString("en-US", options);
      $(".edit_patient_profile_dob").val(main_date);
      $(".dis_fname").html(patient_data.fullName);
      $(".edit_patient_profile_name").val(patient_data.fullName);
      $(".edit_patient_profile_phone").val(patient_data.phone);
      $(".edit_patient_profile_email").val(patient_data.email);
      $(".country-field").val(patient_data.country);
      $(".sex-field").val(patient_data.gender);
      $(".edit_patient_profile_address").val(patient_data.address);
      console.log(patient_data);
    },
    error: function (err) {
      console.log(err);
    },
  });

  $(".bm").on("click", function (event) {
    event.preventDefault();

    showSuccessMessageOnScreen($(".error-message"), "Submiting details, please wait..", false);

    const dob = $(".edit_patient_profile_dob").val();
    const fullName = $(".edit_patient_profile_name").val();
    const phone = $(".edit_patient_profile_phone").val();
    const email = $(".edit_patient_profile_email").val();
    const country = $(".country-field").val();
    const gender = $(".sex-field").val();
    const address = $(".edit_patient_profile_address").val();

    $.ajax({
      url: CONSTANTS.baseUrl,
      contentType: "application/json",
      type: "POST",
      headers: { authorization: `Bearer ${JSON.parse(token)}` },
      data: JSON.stringify({
        query: `mutation{
        updatePatient(
          id: "${patient_id}",
          dob: "${dob}",
          phone: "${phone}",
          email: "${email}",
          gender: "${gender}",
          country: "${country}",
          address: "${address}",
          fullName: "${fullName}",
          careGiverId: "${careGiverId}",
          acceptLegalConsent: true
        ){
          success
          message
          data
        }
      }
      `,
      }),
      success: function (result) {
        if (result.data.updatePatient.success) {
          showSuccessMessageOnScreen($(".error-message"), result.data.updatePatient.message, true);
          setTimeout(function () {
            window.location.reload();
          }, 4000);
        } else {
          showErrorMessageOnScreen($(".error-message"), result.data.updatePatient.message, true);
        }
        console.log(result);
      },
      error: function (err) {
        showErrorMessageOnScreen($(".error-message"), err.statusText, true);
        console.log(err);
      },
    });
  });
});