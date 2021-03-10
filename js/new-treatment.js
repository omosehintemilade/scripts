 var treatmentOption = "";
      function setTreatmentOption(val) {
        treatmentOption = val;
        $(".treatment-option-val").text(`${treatmentOption}`);
      }

      $(document).ready(function () {
        const token = localStorage.getItem("token");
        var errorMessage = $(".error-message");
        var treate_data = $(".treate_data");
        var treatment_price = $(".treatment_price");
        var patient_log = $(".patient_log");

        const userData = JSON.parse(localStorage.getItem("data"));
        if (!userData) {
          var loc = `${$(location).attr("origin")}/care-giver/login`;
          $(location).attr("href", loc);
        }
        const userfullname = userData.fullName;
        $(".userfullname").html(`${userfullname}`);
        $(".sign-out").click(function () {
          localStorage.clear();
          var loc = `${$(location).attr("origin")}/care-giver/login.html`;
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
        var patient_name = getUrlVars()["patient_name"];
        console.log(patient_name);
        var patient_id = getUrlVars()["patient_id"];
        const treatment_laboratory_category_data = [
          { title: "blood count" },
          { title: "urinalysis" },
          { title: "cholesterol tests" },
          { title: "spinal fluid analysis" },
          { title: "liver function tests" },
        ];
        const blood_count_data = [
          { name: "blood count" },
          { name: "blood count" },
          { name: "blood count" },
          { name: "blood count" },
          { name: "blood count" },
          { name: "blood count" },
        ];
        treatment_laboratory_category_data.map(function (i) {
          $(".add_treatment_category").append(`<option value="${i.title}"> ${i.title.toUpperCase()} </option>`);
        });
        $(".add_treatment_category").on("change", function () {
          if (this.value === "blood count") {
            blood_count_data.map(function (i) {
              $(".add_treatment_name").append(`<option value="${i.name}"> ${i.name.toUpperCase()} </option>`);
            });
          }
        });
        var treatment_data = [];
        // Create Treatment
        $(".creat_treat").click(function (event) {
          event.preventDefault();
          $(".white").html("Please wait...");
          if (treatment_data.length === 0) {
            $(".white").html("Checkout");
            errorMessage.css("display", "block");
            errorMessage.css("background", "#c62828");
            errorMessage.html("Please add treatment....");
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
          if (patient_id === "") {
            $(".white").html("Checkout");
            errorMessage.css("display", "block");
            errorMessage.css("background", "#c62828");
            errorMessage.html("Please select patient....");
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
          console.log(patient_id, treatment_data);
          var treat_it = $.each(treatment_data, function (index, room) {
            return room;
          });
          console.log(treat_it);
          console.log("loading....");
          $.ajax({
            url: "http://localhost:5500",
            contentType: "application/json",
            type: "POST",
            headers: { authorization: `Bearer ${JSON.parse(token)}` },
            data: JSON.stringify({
              query: `mutation ($treatmentItemInput: [TreatmentItemInput!]!){ 
            createTreatment( patientId: "${patient_id}", treatmentItems: $treatmentItemInput, notes: " ", kindOfHealthcareProvider: ${treatmentOption} ) 
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
                $(".white").html("Checkout");
                errorMessage.css("display", "block");
                errorMessage.css("background", "#c62828");
                errorMessage.html(result.data.createTreatment.message);
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
              } else {
                $(".white").html("Checkout");
                errorMessage.css("display", "block");
                errorMessage.css("background", "#43a047");
                errorMessage.html(result.data.createTreatment.message);
                errorMessage.animate({ top: "30px" }, 900, "linear", function () {
                  console.log("All is cool");
                });
                errorMessage.animate({ top: "50px" }, 900, "linear", function () {
                  console.log("All is cool");
                });
                setTimeout(function () {
                  errorMessage.css("display", "none");
                }, 2000);
                var loc = `${$(location).attr("origin")}/care-giver/treatment-details-payment.html?treatment_id=${result.data.createTreatment.data.id}&hcp_id=${
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
        // Patient List
        $.ajax({
          url: "http://localhost:5500",
          contentType: "application/json",
          type: "POST",
          headers: { authorization: `Bearer ${JSON.parse(token)}` },
          data: JSON.stringify({
            query: `query { listPatients( lastId: "" limit: 100 ) {
                                          data {
                                            id fullName gender
                                          }}}`,
          }),
          success: function (result) {
            const patient_list = result.data.listPatients.data;
            $(".pat_list").html(
              $.map(patient_list, function (data) {
                return ` <div class="div-block-144"> <a href="/care-giver/new-treatment-laboratory.html?patient_name=${data.fullName}&patient_id=${data.id}" class="new-treatments-laboratory-patient-dropdown-link-3 w-dropdown-link" tabindex="0">${data.fullName}</a> <div class="text-block-20"><span class="text-span-20"></span></div> </div> `;
              })
            );
            console.log(JSON.stringify(patient_list));
          },
          error: function (err) {
            console.log(err);
          },
        }); 
        var count = "";
        // Add treatment
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
          console.log("new_data", new_data);
          console.log("treatment_data", treatment_data);
          treate_data.html(
            $.map(treatment_data, function (data) {
              return `<div class="new-treatments-laboratory-body-table-block">
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
          treatment_price.html(`Total: $${count}.00`);
          console.log("count", count);
        });
        // patient_name = patient_name.replace(/%20/g, " ");
        console.log("patient name", patient_name, patient_id);
        patient_log.html(patient_name || "Select Patient");
      });
