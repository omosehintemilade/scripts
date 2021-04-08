$("body").prepend('<div class="error-message"></div>');
 $('.dropdown-list-2').html('');
 $('.treatment_data').html(`
 <div class="new-treatments-pharmacy-body-table-block">
   <div class="div-block-95">
     <div class="ntp-treatment-table-element-1">
       <div class="new-treatment-pharmacy-table-text-plain">No treatment available at the moment</div>
     </div>
 </div>
 </div>`);
 
 $(".sign-out").click(function () {
  localStorage.clear();
  var loc = `${$(location).attr("origin")}/health-care-provider/login.html`;
  $(location).attr("href", loc);
});

$(".new-treatements-pharmacy-details-1-from-total").html(`Total: 0.00`);

$(".add_treatment_toggle").click(function(){
    $(".new-treatment-add-treatment-popup-modal").css("display", "block");
    $(".new-treatment-add-treatment-popup-modal").css("opacity", "1");
})
      // function setTreatmentOption(val) {
      //   treatmentOption = val;
      //   $(".treatment-option-val").text(`${treatmentOption}`);
      // }

      $(document).ready(function () {
        const token = localStorage.getItem("token");
        var treatmentOption = localStorage.getItem("data");
        // var treatmentOption = JSON.parse(treatmentOption);
        // var treatmentOption = treatmentOption.kindOfHealthcareProvider;
        // var dataJson = JSON.stringify(result.data.login.data);
        var healthCareProviderType = JSON.parse(treatmentOption);
        var FormattedHealthCareProviderType = healthCareProviderType.kindOfHealthcareProvider;
        // alert(healthCareProviderType.kindOfHealthcareProvider);
        var errorMessage = $(".error-message");
        var treate_data = $(".treatment_data");
        var patient_log = $(".patient_log");

        const userData = JSON.parse(localStorage.getItem("data"));
        if (!userData) {
          var loc = `${$(location).attr("origin")}/health-care-provider/login`;
          $(location).attr("href", loc);
        }
        const userfullname = userData.fullName;
        $(".userfullname").html(`${userfullname}`);
        $(".sign-out").click(function () {
          localStorage.clear();
          var loc = `${$(location).attr("origin")}/health-care-provider/login.html`;
          $(location).attr("href", loc);
        });
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
        const patient_name = getUrlVars()["patient_name"];

        if (getUrlVars()["patient_name"]){
          $(".text-block-9").html(patient_name.replace(/[^a-zA-Z ]/g, " "));
        }else{
          $(".text-block-9").html("Select patient");
        }
        
        

        let treatment_laboratory_category_data
        let treatment_subCategory
        let TREAMENT_CATEGORY_SELECTED_INDEX
        let TREAMENT_SUBCATEGORY_SELECTED

    // treatment diagnosis list
    $.ajax({
      url: "https://aluuka-graph.herokuapp.com",
      contentType: "application/json",
      type: "POST",
      headers: { authorization: `Bearer ${JSON.parse(token)}` },
      data: JSON.stringify({
        query: `query{
          listTreatmentCategory{
            status
            data{
              name
              description
              subCategory
            }
          }
        }`,
      }),
      success: function (result) {
        console.log(result)

        treatment_laboratory_category_data = result.data.listTreatmentCategory.data;
        treatment_laboratory_category_data.forEach(function (data) {
          $(".add_treatment_category").append(`<option value="${data.name}"> ${data.name.toUpperCase()} </option>`);
        });
      },
      error: function (err) {
        console.log(err);
      },
    });

  

  $(".add_treatment_category").on("change", function (el) {
    treatment_laboratory_category_data.forEach(function(data, index){
      if(data.name == el.target.value){
        TREAMENT_CATEGORY_SELECTED_INDEX = index
        treatment_subCategory = data.subCategory
      }
    })
    console.log(treatment_subCategory)
    $(".add_treatment_name").html('<option>--Select Treatment</option>')
      treatment_subCategory.map(function (i) {
        $(".add_treatment_name").append(`<option value="${i.treatmentName}"> ${i.treatmentName.toUpperCase()} </option>`);
      });
  });

  $(".add_treatment_name").on("change", function (el) {
    TREAMENT_SUBCATEGORY_SELECTED = el.target.value

    treatment_laboratory_category_data[TREAMENT_CATEGORY_SELECTED_INDEX].subCategory.forEach((treatment) => {
      if(treatment.treatmentName == TREAMENT_SUBCATEGORY_SELECTED){
        setTreamentDescriptionAndCost(treatment.treatmentDescription, treatment.amount)
      }
    })

  })

  function setTreamentDescriptionAndCost(description, cost){
    $("#Field-Additional-Description").val(description)
    $("#Field-2-Cost").val(cost)
  }

  var treatment_data = [];




        // Patient List
        $.ajax({
          url: "https://aluuka-graph.herokuapp.com",
          contentType: "application/json",
          type: "POST",
          headers: { authorization: `Bearer ${JSON.parse(token)}` },
          data: JSON.stringify({
            query: `query { 
                      listTreatments(
                        patientId: ""
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
                          }
                        }
                      }`,
                  }),
          success: function (result) {
            const patient_list = result.data.listTreatments.data;
            
            // // the code you're looking for
            // var needle = 'fullName';
            
            // // iterate over each element in the array
            // for (var i = 0; i < patient_list.length; i++){
            //   // look for the entry with a matching `code` value
            //   if (patient_list[i].patient.fullName == needle){
            //      // we found it
            //      return patient_list[i].patient_id
            //   }
            // }
            // const patient_id = result.data.listTreatments.data[].patient_id;
            // alert(patient_id);
            console.log(result);
            $(".dropdown-list-2.w-dropdown-list").html(
              $.map(patient_list, function (data) {
                localStorage.setItem("patient_id", data.patientId);
                return ` <div class="div-block-144"> <a href="/health-care-provider/new-treatment.html?patient_name=${data.patient.fullName}&patient_id=${data.patientId}" class="new-treatments-laboratory-patient-dropdown-link-3 w-dropdown-link" tabindex="0">${data.patient.fullName}</a> <div class="text-block-20"><span class="text-span-20"></span></div> </div> `;
                
              })
            );
            // console.log(JSON.stringify(patient_list));
          },
          error: function (err) {
            console.log(err);
          },
        }); 
        var count = "";
        // Add treatment item
        $(".add_treatment_submit").click(function (event) {
          event.preventDefault();
          const treatment_name = $("select.add_treatment_name option").filter(":selected").val();
          const treatment_description = $(".add_treatment_description").val();
          const treatment_cost = $(".add_treatment_cost").val();
          $(".add_treatment_submit").html("Please wait....");
          if (treatment_name === "" || treatment_description === "" || treatment_cost === "") {
            $(".add_treatment_submit").html("Add");
            errorMessage.css("display", "block");
            errorMessage.css("background", "#c62828");
            errorMessage.html("Pls fill in all field....");
            errorMessage.animate({ top: "30px" }, 900, "linear", function () {
              console.log("All is cool");
            });
            errorMessage.animate({ top: "50px" }, 900, "linear", function () {
              console.log("All is cool");
            });
            setTimeout(function () {
              errorMessage.css("display", "none");
            }, 2000);
            return false;
          }
          const new_data = { name: treatment_name, description: treatment_description, quantity: 1, price: Number(treatment_cost) };
          treatment_data.push(new_data);
          // console.log("new_data", new_data);
          // console.log("treatment_data", treatment_data);
          $(".new-treatment-add-treatment-popup-modal").css("display", "none");
          // $(".new-treatment-add-treatment-popup-modal").css("opacity", "0");
          treate_data.html(
            $.map(treatment_data, function (data) {
              return `<div class="new-treatments-laboratory-body-table-block-x">
          <div class="new-treatments-laboratory-body-table-block-elements">
              <div id="w-node-beb3450bdcef-40900c6e" class="ntp-treatment-table-element-1">
                  <div class="ntp-treatment-table-element-1-block-1">
                      <div class="new-treatment-pharmacy-table-text-plain">${data.name}</div>
                      <div data-hover="1" data-delay="0" class="ntp-treatment-table-element-1-block-1-dropdown w-dropdown" style="">
                          <div class="dropdown-toggle-8 w-dropdown-toggle" id="w-dropdown-toggle-5" aria-controls="w-dropdown-list-5" aria-haspopup="menu" aria-expanded="false" role="button" tabindex="0">
                              <div class="text-span-8">
                                  <span></span>
                              </div>
                          </div>
                          <nav class="dropdown-list-4 w-dropdown-list" id="w-dropdown-list-5" aria-labelledby="w-dropdown-toggle-5">
                              <a href="#" class="dropdown-link-5 w-dropdown-link" tabindex="0">${data.description}</a>
                          </nav>
                      </div>
                  </div>
              </div>
              <div id="w-node-beb3450bdcf9-40900c6e" class="div-block-96">
                  <div class="div-block-97"><div class="new-treatments-laboratory-table-text-bold">$${data.price}.00</div><div class="text-block-10 del_treatment"></div></div>
                  </div>
          </div>
      </div>`;
            })
          );
          count = treatment_data.reduce((result, { price }) => result + price, 0);
          var treatment_price = $(".new-treatements-pharmacy-details-1-from-total");
          treatment_price.html(`Total: $${count}.00`);
          console.log("count", count);
        });
        // patient_name = patient_name.replace(/%20/g, " ");
        // console.log("patient name", patient_name, patient_id);
        // patient_log.html(patient_name || "Select Patient");

        //Create treatment
        $(".hospital-new-treatment-checkout-button").click(function (event) {
          event.preventDefault();
          $(".hospital-new-treatment-checkout-button").html("Please wait...");
          if (treatment_data.length === 0) {
            $(".hospital-new-treatment-checkout-button").html("Checkout");
            errorMessage.css("display", "block");
            errorMessage.css("background", "#c62828");
            errorMessage.html("Please add treatment....");
            setTimeout(function () {
              errorMessage.css("display", "none");
            }, 2000);
            return false;
          }
          if (localStorage.getItem("patient_id") === "") {
            $(".hospital-new-treatment-checkout-button").html("Checkout");
            errorMessage.css("display", "block");
            errorMessage.css("background", "#c62828");
            errorMessage.html("Please select patient....");
            setTimeout(function () {
              errorMessage.css("display", "none");
            }, 2000);
            return false;
          }
          var treat_it = $.each(treatment_data, function (index, room) {
            return room;
          });
          console.log(treat_it);
          console.log("loading....");

          let new_patient_id = localStorage.getItem("patient_id");
          
          $.ajax({
            url: "https://aluuka-graph.herokuapp.com",
            contentType: "application/json",
            type: "POST",
            headers: { authorization: `Bearer ${JSON.parse(token)}` },
            data: JSON.stringify({
              query: `mutation ($treatmentItemInput: [TreatmentItemInput!]!){ 
            createTreatment( patientId: "${new_patient_id}", treatmentItems: $treatmentItemInput, notes: " ", kindOfHealthcareProvider: ${FormattedHealthCareProviderType} ) 
              { 
              	success message returnStatus data
              }
            }`,
              variables: {
                treatmentItemInput: treatment_data,
              },
            }),
            success: function (result) {
              if (!result.data.createTreatment.success) {
                alert(result.data.createTreatment.message);
                alert(new_patient_id);
                $(".hospital-new-treatment-checkout-button").html("Checkout");
                errorMessage.css("display", "block");
                errorMessage.css("background", "#c62828");
                errorMessage.html(result.data.createTreatment.message);
                setTimeout(function () {
                  errorMessage.css("display", "none");
                }, 2000);
                console.log("NOTE:", "NOT SUCCESFUL");
                return false;
              } else {
                $(".hospital-new-treatment-checkout-button").html("Hold on ...");
                errorMessage.css("display", "block");
                errorMessage.css("background", "#43a047");
                errorMessage.html(result.data.createTreatment.message);
                setTimeout(function () {
                  errorMessage.css("display", "none");
                }, 2000);
                console.log("NOTE:", "HURRAY!!");
                var loc = `${$(location).attr("origin")}/health-care-provider/treatment-details-payment.html?treatment_id=${result.data.createTreatment.data.id}&hcp_id=${
                  result.data.createTreatment.data.healthcareProviderId
                }`;
                $(location).attr("href", loc);
              }
            },
            error: function (err) {
              console.log("err:", err);
            },
          });
        });
      });
