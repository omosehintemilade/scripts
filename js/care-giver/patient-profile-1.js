$(document).ready(function () {
  //INIT FUNC
  window.loadTreatmentsByFilterListener = function (type, value, extra = null) {
    loadTreatmentsByFilter(type, value, extra);
  };

  $("body").prepend('<div class="error-message"></div>');

  // TREATMENT TABLE
  $(".patient-profile-1-form").css({ overflow: "scroll" });

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

  function loadTreatmentsByFilter(type, value, extra) {
    showSuccessMessageOnScreen($(".error-message"), "Updating Table, please wait..", false);

    fetchTreatmentsByFilter(type, value, extra)
      .then(function (response) {
        hideAllScreenMessage();
        console.log(response);
        let treatment_list = response.data.listTreatments.data;

        console.log({ newList: treatment_list });

        updateTreatmentTable(treatment_list);
      })
      .catch(function (error) {
        showErrorMessageOnScreen($(".error-message"), "Unable to fetch treatments");
        console.error(error);
      });
  }

  function fetchTreatmentsByFilter(type, value, extra) {
    if (type == "status") {
      $(".text-block-9").html(extra);

      // Toggle Dropdown
      $(".dropdown-list-2.w-dropdown-list.w--open").removeClass("w--open");

      return $.ajax({
        url: CONSTANTS.baseUrl,
        contentType: "application/json",
        type: "POST",
        headers: {
          authorization: `Bearer ${JSON.parse(token)}`,
        },
        data: JSON.stringify({
          query: `${
            extra != "All"
              ? `query{
      listTreatments(
                ${value}: true,
                patientId: "${patient_id}",
                limit: 20,
                lastId: ""
            ) {
              count
              totalAmount
                data {
                    id
                    patientId
                    patient {
                        fullName
                    }
                    healthcareProviderId
                    healthcareProvider
                    careGiverId
                    careGiver
                    treatmentItems {
                            price
                            description
                            quantity
                            name
                    }
                    subTotal
                    grandTotal
                    isPaid
                    isAccepted
                    isCompleted
                    createdAt
                    updatedAt
                }
            }
        }
    `
              : `query{
      listTreatments(
        patientId: "${patient_id}",
                limit: 20,
                lastId: ""
            ) {
              count
              totalAmount
                data {
                    id
                    patientId
                    patient {
                        fullName
                    }
                    healthcareProviderId
                    healthcareProvider
                    careGiverId
                    careGiver
                    treatmentItems {
                            price
                            description
                            quantity
                            name
                    }
                    subTotal
                    grandTotal
                    isPaid
                    isAccepted
                    isCompleted
                    createdAt
                    updatedAt
                }
            }
        }
    `
          }`,
        }),
        success: function (result) {
          return Promise.resolve(result);
        },
        error: function (err) {
          return Promise.reject(err);
        },
      });
    }
  }

  function updateTreatmentTable(treatmentList) {
    // CLEAR TREATMENT TABLE
    $(".patient-profile-1-form-element-block").remove();
    $(".patient-profile-1-form-page-list").remove();

    const dateOptions = {
      year: "2-digit",
      month: "2-digit",
      day: "2-digit",
    };

    $.map(treatmentList, function (treatment) {
      $(".patient-profile-1-form").append(`
      <div class="patient-profile-1-form-element-block">
            <div class="patient-profile-1-tab-treatments-block">
              <div class="patient-profile-1-tab-treatments-text-block">
                <p class="treatment-payment-3-subtab-image-label">Treatment ($${treatment.grandTotal})</p>
                <div class="patient-profile-1-tab-sub-text">${new Date(Number(treatment.createdAt)).toLocaleDateString(
                  "en-US",
                  dateOptions
                )} &nbsp; | &nbsp; ${treatment.kindOfHealthcareProvider}</div>
                <div class="div-block-87">
                  <img src="../images/Ellipse-3.svg" loading="lazy" alt="" class="image-6">
                  <div class="heading-6-light">${treatment.healthcareProvider}</div>
                </div>
              </div>
              <div>
                ${
                  treatment.isPaid
                    ? `<a href="/care-giver/view-treatment.html?treatment_id=${treatment.id}&hcp_id=${treatment.healthcareProviderId}" class="button-medium-small top-padding w-button">View</a>`
                    : `<a href="/care-giver/treatment-details-payment.html?treatment_id=${treatment.id}&hcp_id=${treatment.healthcareProviderId}" class="button-medium-small top-padding w-button">View</a>`
                }
              </div>
            </div>
          </div>
      `);
    });
  }

  updateTreatmentTable([]);

  // MAP POSSIBLE STATUSES TO POSITION
  const status = [
    { name: "All", query: "" },
    { name: "Completed", query: "isCompleted" },
    { name: "Incomplete", query: "isNotComplete" },
    { name: "Pending", query: "isPending" },
    { name: "Unpaid", query: "isNotPaid" },
  ];

  // SET DETAULT
  $(".text-block-9").text("All");

  $("#w-dropdown-list-2").html("");
  $.map(status, function (statusData) {
    $("#w-dropdown-list-2").append(`
    <a 
    class="dropdown-link-3 w-dropdown-link" 
    tabindex="0" 
    style="cursor: pointer"
    onClick="loadTreatmentsByFilterListener('status', '${statusData.query}', '${statusData.name}'); return false;"
    >${statusData.name}</a>`);
  });

  var errorMessage = $(".error-message");
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
  // SET EDIT BUTTON HREF
  $("#editPatientDetailsButton").attr("href", `/care-giver/edit-patient-profile.html?patient_id=${patient_id}`);
  //
  console.log("patient id", patient_id);
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
                },
              listTreatments(
                patientId: "${patient_id}"
                limit: 20
                lastId: ""
            ) {
                data {
                    id
                    patientId
                    patient {
                        fullName
                    }
                    healthcareProviderId
                    healthcareProvider
                    kindOfHealthcareProvider
                    careGiverId
                    careGiver
                    treatmentItems {
                            price
                            description
                            quantity
                            name
                    }
                    subTotal
                    grandTotal
                    isPaid
                    isAccepted
                    isCompleted
                    createdAt
                    updatedAt
                }
            }
          }
                              `,
    }),
    success: function (result) {
      const patient_data = result.data.getPatientById;
      const treatment_list = result.data.listTreatments;

      $(".patient_profile_name").html(patient_data.fullName);
      $(".patient_profile_phone").html(patient_data.phone);
      $(".patient_profile_email").html(patient_data.email);
      $(".patient_profile_country").html(patient_data.country);
      $(".patient_profile_gender").html(patient_data.gender);
      $(".patient_profile_address").html(patient_data.address);
      console.log(patient_data);
      console.log(treatment_list);
      updateTreatmentTable(treatment_list.data);
    },
    error: function (err) {
      console.log(err);
    },
  });
});