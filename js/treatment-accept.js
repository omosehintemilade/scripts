$(document).ready(function () {
    $("body").append('<div class="error-message"></div>');
    

    $(".treatment-detail-accept-form-entry-elements").html("");
    $(".treatment-detail-accept-form-entry-elements").css("width", "100%");
    $(".div-block-131").prepend(`
        <div class="start-end-form-group"><label for="start-time" class="cap-label">Start time</label><input type="datetime-local" class="start-time-field w-input" maxlength="256" name="start-time" data-name="start-time" placeholder="DD- MM- YYYY" id="start-time" required=""></div>
        <div class="start-end-form-group"><label for="end-time" class="cap-label">End time</label><input type="datetime-local" class="end-time-field w-input" maxlength="256" name="start-time" data-name="start-time" placeholder="DD- MM- YYYY" id="start-time" required=""></div>
    `);
    $(".start-end-form-group").css({"width": "33%", "margin-right": "10px"});
    $(".treatment-details-1-from-total").css("text-align", "right");
    
    const token = localStorage.getItem("token");
    const userData = JSON.parse(localStorage.getItem("data"));
  
    //remove dummy table
    $(".treatments-dashboard-table-div-block").html();
  
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


    const userfullname = userData.fullName;
    $(".profile-avatar-title").html(`${userfullname}`);

    $(".sign-out").click(function () {
      localStorage.clear();
      var loc = `${$(location).attr("origin")}/health-care-provider/login.html`;
      $(location).attr("href", loc);
    });



    const urlParams = new URLSearchParams(window.location.search);
    const treatmentID = urlParams.get("treatment_id");
    const hcpID = urlParams.get("hcp_id");

    $.ajax({
      url: "https://aluuka-graph.herokuapp.com",
      contentType: "application/json",
      type: "POST",
      headers: { authorization: `Bearer ${JSON.parse(token)}` },
      data: JSON.stringify({
        query: `query{
            getTreatmentById(id: "${treatmentID}"){
              patient{
                fullName
                id
              }
              isPaid
              isCompleted
              isAccepted
              notes
              treatmentItems{
                name
                price
                quantity
                description
              }
              healthcareProvider
              grandTotal
              subTotal
            }
            getHealthcareProviderById(id: "${hcpID}"){
              fullName
              email
              phone
            }
          }
                                `,
      }),
      success: function (result) {
          console.log(result);
        $(".health-care-provider-name").text(`${result.data.getHealthcareProviderById.fullName}`);
        $(".health-care-provider-phone").text(`${result.data.getHealthcareProviderById.phone}`);
        $(".health-care-provider-email").text(`${result.data.getHealthcareProviderById.email}`);

        // PATIENT
        const patientId = result.data.getTreatmentById.patient.id;
        $(".patient-name").text(`${result.data.getTreatmentById.patient.fullName}`);
        $(".patient-email").text(`${result.data.getTreatmentById.patient.email}`);
        $(".treatment-date").text(`${result.data.getTreatmentById.patient.date}`);
        $(".treatment-note").text(`${result.data.getTreatmentById.notes || "No Notes"}`);
        if (result.data.getTreatmentById.isCompleted){
          $(".div-block-130 .tda-custom").text('Completed');
        }
        if (result.data.getTreatmentById.isAccepted){
          $(".div-block-130 .tda-custom").text('Accepted');
          $(".div-block-130 .tda-custom").css('display', 'none');
        }
        if (result.data.getTreatmentById.isPaid){
          $(".div-block-130 .tda-custom").text('Paid');
        }else{
          $(".div-block-130 .tda-custom").text('Pending');
        }
        // $(".treatment-details-1-from-total").text(`Total: ${result.data.getTreatmentById.grandTotal}`);
        

        // TREATMENT
        $(".treatments-list-container").html("");
        $.map(result.data.getTreatmentById.treatmentItems, function (n, index) {
          $(".treatment-detail-accept-form-entry-elements").append(
            `<div class="div-block-132">
                  <div class="treatment-details-accept-form-entry-element-block">
                    <div class="view-treatment-form-text-element-block">
                      <div class="view-treatment-form-label">${n.name}</div>
                      <div class="view-treatment-form-sub-label">${n.name}</div>
                    </div>
                    <div class="view-treatment-form-price-label">${n.price}</div>
                  </div>
                </div>
                <div class="treatment-details-accept-horizontal-line"></div>
                <div class="treatment-details-accept-form-entry-total">
                  <div class="treatment-details-1-from-total">Total: ${result.data.getTreatmentById.grandTotal}</div>
                </div>
            `
          );
        });

        // FEE
        $(".grand-total").text(`$${result.data.getTreatmentById.grandTotal} (Treatment + Aluuka Fee)`);
        $(".aluuka-fee").text(`$${Number(result.data.getTreatmentById.grandTotal - result.data.getTreatmentById.subTotal).toFixed(2)}`);
      },
      error: function (err) {
        console.log(err);
      },
    });

    $(".div-block-133 .tda-button-custom").click(function(e){
      e.preventDefault();
      const startTime = document.querySelector(".start-time-field").value;
      const endTime = document.querySelector(".end-time-field").value;
      var temp_startTime = new Date(startTime);
      var temp_endTime = new Date(endTime);
      formattedMonth1 = temp_startTime.toLocaleDateString(),
      formattedTime1 = temp_startTime.toLocaleTimeString(navigator.language, {hour: '2-digit', minute:'2-digit'});
      
      formattedMonth2 = temp_endTime.toLocaleDateString(),
      formattedTime2 = temp_endTime.toLocaleTimeString(navigator.language, {hour: '2-digit', minute:'2-digit'});
      new_startTime = formattedMonth1 + " " + formattedTime1;
      new_endTime = formattedMonth2 + " " + formattedTime2;
      console.log(new_startTime, new_endTime);

    $.ajax({
      url: "https://aluuka-graph.herokuapp.com",
      contentType: "application/json",
      type: "POST",
      headers: { authorization: `Bearer ${JSON.parse(token)}` },
      data: JSON.stringify({
        query: `mutation{
          acceptTreatment(
              id: "${treatmentID}"
              startTime: "${new_startTime}"
              endTime: "${new_endTime}"
            ){
              data
            }
          }
            `,
      }),
      success: function (result) {
          console.log(result);
          $('.div-block-27').before(`
          <div class="notification-popup-modal-elements-block">
            <div class="notification-popup-modal-block-elements">
              <div class="notification-popup-modal-elements-top-block">
                <div class="div-top-block">
                  <div class="text-bold">Treatment Accepted</div>
                </div>
                <div id="w-node-fa9bff8b-c301-ec58-aca7-0ede9014eeaf-04900c6a" data-w-id="fa9bff8b-c301-ec58-aca7-0ede9014eeaf" class="text-cancel"><span></span></div>
              </div>
              <img src="../images/wait.svg" loading="lazy" alt="" />
              <a href="../health-care-provider/treatments-main-dashboard.html" class="new-treatment-popup-close-button w-button" style="padding: 10px; margin-top: 10px">Go to dashboard</a>
            </div>
          </div>`);
      },
      error: function (err) {
        console.log(err);
      },
    });
    })

  });


    // Treatment List
    // $.ajax({
    //   url: "https://aluuka-graph.herokuapp.com",
    //   contentType: "application/json",
    //   type: "POST",
    //   headers: { authorization: `Bearer ${JSON.parse(token)}` },
    //   data: JSON.stringify({
    //     query: `query {
    //                 listTreatments(
    //                     patientId: "${patientId}"
    //                     limit: 10
    //                     lastId: ""
    //                 ) {
    //                   count
    //                   totalAmount
    //                     data {
    //                         id
    //                         patientId
    //                         patient {
    //                             fullName
    //                         }
    //                         healthcareProviderId
    //                         healthcareProvider
    //                         careGiverId
    //                         careGiver
    //                         treatmentItems {
    //                                 price
    //                                 description
    //                                 quantity
    //                                 name
    //                         }
    //                         subTotal
    //                         grandTotal
    //                         isPaid
    //                         isAccepted
    //                         isCompleted
    //                         createdAt
    //                         updatedAt
    //                     }
    //                 },
    //                 listPatients(
    //                   lastId: ""
    //                   limit: 100
    //                 ) {
    //                   data {
    //                     id
    //                     fullName
    //                     gender
    //                     country
    //                     address
    //                     phone
    //                     email
    //                     dob
    //                   }
    //                 },
    //                 listAppointments(lastId: "", limit:0){
    //                   count
    //                 }
    //             }
    //               `,
    //   }),
    //   success: function (result) {
    //     console.log(result);
    //     // const treatment_count = result.data.listTreatments.count;
    //     // const payout_count = result.data.listTreatments.totalAmount;
    //     // const appointment_count = result.data.listAppointments.count;
    //     // var patient_list = result.data.listPatients.data;
    //     // var treatment_list = result.data.listTreatments.data;
    //     // for (i = 0; i < treatment_list.length; i++) {
    //     //   console.log(treatment_list[i].patient.fullName);
    //     // }
    //     // console.log(treatment_list);
        
    //       },
    //   error: function (err) {
    //     console.log(err);
    //   }
    // });
    
        $(".w-dropdown").on("click", ".dropdown-toggle-4", function () {
          var className = $(this).attr("class");
          var keyName = $(this).attr("key");
          alert(`${className} ${keyName}`);
          $(`${keyName}-show`).addClass("w--open");
        });
        // console.log(JSON.stringify(treatment_list));
  //   console.log("One time", treatment_list);
    /*$(".dropdown-toggle-4").click(function() {
  var className = $(this).attr("class");   
  var keyName = $(this).attr("key");
  alert(`${className} ${keyName}`);
  })*/
//   });
  