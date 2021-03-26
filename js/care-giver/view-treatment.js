$(document).ready(function () {
  $(".view-treatment-1-label").eq(4).text("PAYMENT STATUS");
  $(".active-payment-method").html(`<h2 style="color: #185f56">Paid</h2>`).css("all", "inherit");
  var errorMessage = $(".error-message");
  const token = localStorage.getItem("token");
  const userData = JSON.parse(localStorage.getItem("data"));
  if (!userData) {
    var loc = `${$(location).attr("origin")}/care-giver/login.html`;
    $(location).attr("href", loc);
  }
  const userfullname = userData.fullName;
  $(".userfullname").html(`${userfullname}`);

  const urlParams = new URLSearchParams(window.location.search);
  const treatmentID = urlParams.get("treatment_id");
  const hcpID = urlParams.get("hcp_id");

  $.ajax({
    url: CONSTANTS.baseUrl,
    contentType: "application/json",
    type: "POST",
    headers: { authorization: `Bearer ${JSON.parse(token)}` },
    data: JSON.stringify({
      query: `query{
          getTreatmentById(id: "${treatmentID}"){
            patient{
              fullName
            }
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
      $(".patient-name").text(`${result.data.getTreatmentById.patient.fullName}`);
      $(".treatment-note").text(`${result.data.getTreatmentById.notes || "No Notes"}`);

      // TREATMENT
      $(".treatments-list-container").html("");
      $.map(result.data.getTreatmentById.treatmentItems, function (n, index) {
        $(".treatments-list-container").append(
          `
          <div class="view-treatment-form-element-block">
              <div class="view-treatment-form-text-element-block">
                <div class="view-treatment-form-label">${n.name}</div>
                <div class="view-treatment-form-sub-label">${n.description}</div>
              </div>
              <div class="view-treatment-form-price-label">$${n.price} X ${n.quantity}</div>
            </div>
            <div class="div-block-66"></div>
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
});