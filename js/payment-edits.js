$(document).ready(function () {

  $("body").prepend('<div class="error-message"></div>');
  
  $(".sign-out").click(function () {
    localStorage.clear();
    var loc = `${$(location).attr("origin")}/health-care-provider/login.html`;
    $(location).attr("href", loc);
  });

  const token = localStorage.getItem("token");
  const userData = JSON.parse(localStorage.getItem("data"));
  const userfullname = userData.fullName;

  $(".profile-avatar-title").html(userfullname);
//   var treatment_list = "One";
  if (!userData) {
    var loc = `${$(location).attr("origin")}/health-care-provider/login.html`;
    $(location).attr("href", loc);
  }
  const status = { name: "Completed", name: "Pending", name: "Cancelled" };
  $(".status_data").html(
    $.map(status, function (status_data) {
      return `<a href="/health-care-provider/treatments-main-dashboard?status=${status_data.name}" class="dropdown-link-3 w-dropdown-link" tabindex="0">${status_data.name}</a>`;
    })
  );
  $(".sign-out").click(function () {
    localStorage.clear();
    var loc = `${$(location).attr("origin")}/health-care-provider/login.html`;
    $(location).attr("href", loc);
  });

  $.ajax({
    url: "https://aluuka-graph.herokuapp.com",
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
      const payment_email = result.data.listTreatments.count;
      const totalTransactions = result.data.listTreatments.data.length;
      const totalPayout = result.data.listTreatments.totalAmount;
      let patient_list = result.data.listPatients.data;
      let treatment_list = result.data.listTreatments.data;

      
      $(".total-transactions").html(totalTransactions);
      $(".total-payout").html(totalPayout);
      // 
      // $(".payments-dashboard-table-div-block").html(patient_list);
    
      // APPEND PATIENT LIST TO TEMPLATE
      $.map(patient_list, function (patient, index) {
        $(".pat_list").append(`<a href="#${patient.id}" class="dropdown-link-3 w-dropdown-link">${patient.fullName}</a>`);
      });
      //

      if (Array.isArray(treatment_list) && !treatment_list.length) {
        //var loc = `${$(location).attr('origin')}/empty-states/empty-state-1`
        //$(location).attr('href',loc)
        $(".payments-dashboard-table-div-block").html(`
            <div class="treatments-dashboard-table-row-1">
            <div class="treatments-dashboard-table-row-1-block-1">
                <div class="treatments-dashboard-table-column-label">
                Patient Name
                </div>
            </div>
            <div
                id="w-node-e6bbbcb8-82ce-bf78-56df-d683a55d83a1-c3900c77"
                class="treatments-dashboard-table-row-1-block-2"
            >
                <div class="treatments-dashboard-table-column-label">Date</div>
            </div>
            <div
                id="w-node-cc1ab0bc-be93-b387-bb74-33198ef75f23-c3900c77"
                class="treatments-dashboard-table-row-1-block-4"
            >
                <div class="treatments-dashboard-table-column-label">
                Treatment
                </div>
            </div>
            <div class="treatments-dashboard-table-row-1-block-3">
                <div class="treatments-dashboard-table-column-label">Cost</div>
            </div>
            <div
                id="w-node-c214a8f0-05fb-acab-aaa0-96ce3b328417-c3900c77"
                class="treatments-dashboard-table-row-1-block-5"
            >
                <div class="treatments-dashboard-table-column-label">
                Payment Status
                </div>
            </div>
            <div
                id="w-node-e5139410-fc55-d579-1749-60360008d427-c3900c77"
                class="treatments-dashboard-table-row-1-block-6"
            >
                <div class="treatments-dashboard-table-column-label">
                Status
                </div>
            </div>
            </div>
            <br>
          <div class="empty-state-1-body">
          <div class="empty-state-1-body-elements">
              <img src="https://uploads-ssl.webflow.com/5fe9d2f67366097441900c56/5fe9d2f67366093bd9900ca7_Group%205302.png" loading="lazy" width="297" alt="" />
              <div class="emply-state-header">You have no Treatment</div>
              <div class="empty-state-subheader">Click to add a new Treatment</div>
              <a href="../health-care-provider/new-treatment-laboratory.html" class="button-medium-stretch w-button">Create Treatment</a>
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
      $(".total appointment").text(`${result.data.listAppointments.count}`);
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
      $(".treatment_list_table").html(
        $.map(treatment_list, function (data) {
          const date_treat = new Date(data.createdAt).toLocaleDateString("en-US", dateoptions);
          console.log(date_treat);
          var feenum = data.grandTotal - data.subTotal;
          var nfee = feenum.toFixed(2);
          return `
                    <div class="treatments-dashboard-table-row-1">
                        <div class="treatments-dashboard-table-row-1-block-1">
                        <div class="treatments-dashboard-table-column-label">
                            Patient Name
                        </div>
                        </div>
                        <div
                        id="w-node-e6bbbcb8-82ce-bf78-56df-d683a55d83a1-c3900c77"
                        class="treatments-dashboard-table-row-1-block-2"
                        >
                        <div class="treatments-dashboard-table-column-label">Date</div>
                        </div>
                        <div
                        id="w-node-cc1ab0bc-be93-b387-bb74-33198ef75f23-c3900c77"
                        class="treatments-dashboard-table-row-1-block-4"
                        >
                        <div class="treatments-dashboard-table-column-label">
                            Treatment
                        </div>
                        </div>
                        <div class="treatments-dashboard-table-row-1-block-3">
                        <div class="treatments-dashboard-table-column-label">Cost</div>
                        </div>
                        <div
                        id="w-node-c214a8f0-05fb-acab-aaa0-96ce3b328417-c3900c77"
                        class="treatments-dashboard-table-row-1-block-5"
                        >
                        <div class="treatments-dashboard-table-column-label">
                            Payment Status
                        </div>
                        </div>
                        <div
                        id="w-node-e5139410-fc55-d579-1749-60360008d427-c3900c77"
                        class="treatments-dashboard-table-row-1-block-6"
                        >
                        <div class="treatments-dashboard-table-column-label">
                            Status
                        </div>
                        </div>
                    </div>
                  <div class="treatments-dashboard-table-row-5">
                  <div class="treatments-dashboard-table-row-5-block-1">
                      <div class="treatments-dashboard-table-row-5-label">
                          <a href="/health-care-provider/view-treatment.html?treatment_id=${data.id}&hcp_id=${data.healthcareProviderId}">${data.patient.fullName}</a>
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
                        data.isCompleted
                          ? `<a href="#" class="treatments-dashboard-table-row-5-button w-button">COMPLETED</a>`
                          : `<a href="#" class="treatments-dashboard-table-row-3-button w-button">PENDING</a>`
                      }
                  </div>
              </div>
              `;
        })
      );
    },
  });
      $(".w-dropdown").on("click", ".dropdown-toggle-4", function () {
        var className = $(this).attr("class");
        var keyName = $(this).attr("key");
        alert(`${className} ${keyName}`);
        $(`${keyName}-show`).addClass("w--open");
      });
      console.log(JSON.stringify(treatment_list));
//   console.log("One time", treatment_list);
  /*$(".dropdown-toggle-4").click(function() {
var className = $(this).attr("class");   
var keyName = $(this).attr("key");
alert(`${className} ${keyName}`);
})*/
});

