$(document).ready(function () {
  //INIT FUNC
  window.loadTreatmentsByFilterListener = function (type, value, extra=null) {
    loadTreatmentsByFilter(type, value, extra);
  };

  $("body").prepend('<div class="error-message"></div>');

  $(`[data-w-id="11ec8ace-d6e8-d31d-20fb-66ccba3167e0"]`).click(function () {
    loadTreatmentsByFilter("patientId", "");
  });

  const token = localStorage.getItem("token");
  const userData = JSON.parse(localStorage.getItem("data"));
  var treatment_list = "One";
  if (!userData) {
    var loc = `${$(location).attr("origin")}/care-giver/login`;
    $(location).attr("href", loc);
  }
  const status = { name: "Completed", name: "Pending", name: "Cancelled" };
  $(".status_data").html(
    $.map(status, function (status_data) {
      return `<a href="/care-giver/treatments-main-dashboard?status=${status_data.name}" class="dropdown-link-3 w-dropdown-link" tabindex="0">${status_data.name}</a>`;
    })
  );
  const userfullname = userData.fullName;
  var firstName = userfullname.replace(/ .*/, "");
  $(".firstname").html(`Welcome, ${firstName}`);
  $(".userfullname").html(`${userfullname}`);
  $(".sign-out").click(function () {
    localStorage.clear();
    var loc = `${$(location).attr("origin")}/care-giver/login`;
    $(location).attr("href", loc);
  });
  const dateoptions = {
    year: "2-digit",
    month: "2-digit",
    day: "2-digit",
  };
  // output  "12/08/18"

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
    if (type == "patientId") {
        //Set Value : Extra Value is sent as to Patient Name
        $('.text-block-11').html(extra || "Patient Name")
        // Toggle Dropdown
        $(".dropdown-list-2.w-dropdown-list.pat_list.w--open").removeClass("w--open")

      return $.ajax({
        url: CONSTANTS.baseUrl,
        contentType: "application/json",
        type: "POST",
        headers: {
          authorization: `Bearer ${JSON.parse(token)}`,
        },
        data: JSON.stringify({
          query: `query{
            listTreatments(
                      patientId: "${value}"
                      limit: 20
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
          `,
        }),
        success: function (result) {
          return Promise.resolve(result);
        },
        error: function (err) {
          return Promise.reject(err);
        },
      });
    } else {
      // Pass: Temp!
    }
  }

  function updateTreatmentTable(treatment_list) {
    // Clear Table
    $(".treatments-dashboard-table-row-5").remove();

    $(".treatment_list_table").after(
      $.map(treatment_list, function (data) {
        const date_treat = new Date(Number(data.createdAt)).toLocaleDateString("en-US", dateoptions);
        var feenum = data.grandTotal - data.subTotal;
        var nfee = data.grandTotal.toFixed(2);

        return `
                  <div class="treatments-dashboard-table-row-5">
                  <div class="treatments-dashboard-table-row-5-block-1">
                      <div class="treatments-dashboard-table-row-5-label">
                          <a href="/care-giver/view-treatment.html?treatment_id=${data.id}&hcp_id=${data.healthcareProviderId}">${data.patient.fullName}</a>
                      </div>
                  </div>
                  <div id="w-node-f6533b15-1108-ca7c-8368-91a6c714355c-f6900c70" class="treatments-dashboard-table-row-5-block-2">
                      <div class="treatments-dashboard-table-row-5-label">${date_treat}</div>
                  </div>
                  <div class="treatments-dashboard-table-row-5-block-3">
                      <div class="treatments-dashboard-table-row-5-label">${data.healthcareProvider}</div>
                  </div>
                  <div id="w-node-f6533b15-1108-ca7c-8368-91a6c7143562-f6900c70" class="treatments-dashboard-table-row-5-block-4">
                      <div data-hover="" data-delay="20" class="w-dropdown">
                          <div class="dropdown-toggle-4 w-dropdown-toggle" key="${
                            data.id
                          }" id="w-dropdown-toggle-10" aria-controls="w-dropdown-list-10" aria-haspopup="menu" aria-expanded="false" role="button" tabindex="0">
                              <div class="icon-27 w-icon-dropdown-toggle"></div>
                              <div>View</div>
                          </div>
                          <nav class="dropdown-list-3 w-dropdown-list ${data.id}-show" id="w-dropdown-list-10" aria-labelledby="w-dropdown-toggle-10">
                              <div class="div-block-143">
                                  <a href="#" class="table-dropdown-link-3 w-dropdown-link" tabindex="0">Treatment</a>
                                  <div class="table-dropdown-link-3-sub">$1400</div>
                              </div>
                              ${$.map(data.treatmentItems, function (treat_data) {
                                `<div class="div-block-143">
                                      <a href="#" class="table-dropdown-link-3-plain w-dropdown-link" tabindex="0">${treat_data.name}</a>
                                      <div class="table-dropdown-link-3-plain-sub">$${treat_data.price}.00</div>
                                  </div>
                                  `;
                              })}
                          </nav>
                      </div>
                  </div>
                  <div id="w-node-f6533b15-1108-ca7c-8368-91a6c714356f-f6900c70" class="treatments-dashboard-table-row-5-block-5">
                      <div class="treatments-dashboard-table-row-5-label">$${nfee}</div>
                  </div>
                  <div id="w-node-f6533b15-1108-ca7c-8368-91a6c7143572-f6900c70" class="treatments-dashboard-table-row-3-block-6">
                          ${
                        data.isPaid
                          ? `${
                              data.isAccepted
                                ? `${
                                    data.isCompleted
                                      ? `<a href="#" class="treatments-dashboard-table-row-5-button w-button">COMPLETED</a>`
                                      : `<a href="#" class="treatments-dashboard-table-row-5-button w-button">INCOMPLETE</a>`
                                  }`
                                : `<a href="#" class="treatments-dashboard-table-row-3-button w-button">PENDING</a>`
                            }`
                          : `<a href="#" class="treatments-dashboard-table-row-3-button w-button">UNPAID</a>`
                      }
                  </div>
              </div>
              `;
      })
    );
  }

  $.ajax({
    url: CONSTANTS.baseUrl,
    contentType: "application/json",
    type: "POST",
    headers: { authorization: `Bearer ${JSON.parse(token)}` },
    data: JSON.stringify({
      query: `query {
                  listTreatments(
                      patientId: ""
                      limit: 10
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
                  },
                  listPatients(
                    lastId: ""
                    limit: 100
                  ) {
                    data {
                      id
                      fullName
                      gender
                      country
                      address
                      phone
                      email
                      dob
                    }
                  },
                  listAppointments(lastId: "", limit:0){
                    count
                  }
              }
                `,
    }),
    success: function (result) {
      console.log(result);
      treatment_list = result.data.listTreatments.data;

      let patient_list = result.data.listPatients.data;

      // APPEND PATIENT LIST TO TEMPLATE
      $.map(patient_list, function (patient, index) {
        $(".pat_list").append(
          `<a data-patient-id="${patient.id}" onClick="loadTreatmentsByFilterListener('patientId', '${patient.id}', '${patient.fullName}'); return false;"  class="dropdown-link-3 w-dropdown-link">${patient.fullName}</a>`
        );
      });
      //

      if (Array.isArray(treatment_list) && !treatment_list.length) {
        //var loc = `${$(location).attr('origin')}/empty-states/empty-state-1`
        //$(location).attr('href',loc)
        $(".treatment_list_table").after(`
          <div class="empty-state-1-body">
          <div class="empty-state-1-body-elements">
              <img src="https://uploads-ssl.webflow.com/5fe9d2f67366097441900c56/5fe9d2f67366093bd9900ca7_Group%205302.png" loading="lazy" width="297" alt="" />
              <div class="emply-state-header">You have no Treatment</div>
              <div class="empty-state-subheader">Click to add a new Treatment</div>
              <a href="../care-giver/new-treatment-laboratory.html" class="button-medium-stretch w-button">Create Treatment</a>
          </div>
          </div>
      `);
        return false;
      }
      $(".treat_num").html(`${result.data.listTreatments.count}`);

      updateTreatmentTable(treatment_list);

      // Total Payout
      $(".total-payout").text(`$${result.data.listTreatments.totalAmount.toFixed(2)}`);
      // Appointments Count
      $(".treatments-summary-tab-1-div-label-big").text(`${result.data.listAppointments.count}`);
      $(".w-dropdown").on("click", ".dropdown-toggle-4", function () {
        var className = $(this).attr("class");
        var keyName = $(this).attr("key");
        alert(`${className} ${keyName}`);
        $(`${keyName}-show`).addClass("w--open");
      });
      //console.log(JSON.stringify(treatment_list));
    },
    error: function (err) {
      console.log(err);
    },
  });
  /*$(".dropdown-toggle-4").click(function() {
var className = $(this).attr("class");   
var keyName = $(this).attr("key");
alert(`${className} ${keyName}`);
})*/
});