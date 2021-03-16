$(document).ready(function () {
  
  // import { CONSTANTS } from '../js/constants';
$(".sign-out").click(function () {
  localStorage.clear();
  var loc = `${$(location).attr("origin")}/health-care-provider/login.html`;
  $(location).attr("href", loc);
});



  const fullname = document.querySelector(".onboarding_complete_fullname");
  const image_url = localStorage.getItem("img_url")
  const staledob = document.querySelector(".create_patient_dob").value;
  const dob = new Date(staledob);
  const gender = $(".onboarding_complete_gender").children("option:selected").val();
  console.log(gender);
  const country = $(".onboarding_complete_country").children("option:selected").val();;
  console.log(country);
  // const genderSelect = document.querySelector(".onboarding_complete_gender").selectedIndex;
  // const gender = document.getElementsByTagName("option")[genderSelect].value;
  // const countrySelect = document.querySelector(".onboarding_complete_country").selectedIndex;
  // const country = document.getElementsByTagName("option")[countrySelect].value;
  // const country = $(".onboarding_complete_country").filter(":selected").val();
  const address = document.querySelector(".onboarding_complete_address");
  const email = document.querySelector(".onboarding_complete_email");
  const phone = document.querySelector(".onboarding_complete_phone");
  const notfemail = document.querySelector("#notfemail");
  const notfphone = document.querySelector("#notfphone");
  const submitBtn = document.querySelector(".onboard-comp-submit");
  const deleteBtn = document.querySelector(".mpe-button-delete");
  const errorMessage = document.querySelector(".error-message");
  const username = document.querySelector(".userfullname");

  $.get("https://restcountries.eu/rest/v2/all").done(function (data) {
    data.map(function (i) {
      $(".onboarding_complete_country").append(`<option value="${i.name}"> 
                                       ${i.name} 
                                  </option>`);
    });
  });

  const token = localStorage.getItem("token");
  let pictureURL = "";

  const userData = JSON.parse(localStorage.getItem("data"));
  console.log(userData);

  username.innerHTML = userData.fullName;

  
  $(".mpe-button-replace-image").replaceWith(`
  <input type="file" id="change_img" name="change_img" accept="image/png, image/jpeg" style="display:none"/>
  <label for="change_img" class="button-medium w-button image-label" style="color:#fff; cursor: pointer;">Replace Image</label>
  `)

  
  $('#change_img').change(function(e) {
    var fileName = e.target.files[0]
    if(!fileName) {
      return false
    }
    console.log("Files name", fileName)
    $(".image-label").text("Please wait....")
    const data = new FormData()
    data.append("file",fileName)
    data.append("upload_preset","s0qhad82")
    data.append("cloud_name","cnq")
    fetch("https://api.cloudinary.com/v1_1/devwian/image/upload",{ method:"post", body:data})
    .then(res=>res.json())
    .then(data_res=>{
      const img_url = data_res.url
      localStorage.setItem("avatar", img_url)
      console.log('Image URL', img_url)
      // updateFields(img_url)
    })
    .catch(err=>{
      console.log("Upload error", err)
      $(".image-label").text("Replace Image")
    })
  
  
    })

  if (!userData) {
    document.location.href = "/hospital-care-provider/login.html";
  }

  deleteBtn.addEventListener("click", () => {
    pictureURL = "";
  });

  submitBtn.addEventListener("click", e => {
    e.preventDefault();
    console.log(gender, country);

    const notificationChannel = [];

    const NotificationChannel = { email: "email", phone: "phone" };

    if (notfemail.checked) {
      notificationChannel.push(NotificationChannel.email);
    }
    if (notfphone.checked) {
      notificationChannel.push(NotificationChannel.phone);
    }

    if (
      !fullname.value ||
      !dob.value ||
      !gender.value ||
      !country.value ||
      !address.value ||
      !phone.value ||
      !email.value
    ) {
      errorMessage.style.display = "block";
      errorMessage.style.background = "#c62828";
      errorMessage.innerHTML = "Please fill in all field....";
      errorMessage.animate({ top: "30px" }, 900, "linear");
      setTimeout(function () {
        errorMessage.style.display = "none";
      }, 2000);
    }

    

    $.ajax({
      url: "https://aluuka-graph.herokuapp.com",
      contentType: "application/json",
      type: "POST",
      headers: {
        authorization: `Bearer ${JSON.parse(token)} `
      },

      data: JSON.stringify({
        query: `mutation {
      onboardingCompleteProfile(
        fullName: "${fullname.value}"
        pictureURL: "${image_url}"
        dob: "${dob}"
        gender: "${gender}"
        country: "${country}"
        address: "${address.value}"
        phone: "${phone.value}"
        email: "${email.value}"
        notificationChannel:[${notificationChannel}]
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
        if (!result.data.onboardingCompleteProfile.success) {
          errorMessage.style.display = "block";
          errorMessage.style.background = "#c62828";
          errorMessage.innerHTML =
            result.data.onboardingCompleteProfile.message;
          errorMessage.animate({ top: "30px" }, 900, "linear");
        }
        document.location.href = "/hospital-care-provider/my-profile.html";
        errorMessage.style.display = "block";
        errorMessage.style.background = "#43a047";
        errorMessage.innerHTML = result.data.onboardingCompleteProfile.message;
        errorMessage.animate({ top: "30px" }, 900, "linear");
        setTimeout(function () {
          errorMessage.style.display = "none";
        }, 2000);
        localStorage.setItem(
          "data",
          JSON.stringify(result.data.onboardingCompleteProfile.data)
        );
      },
      error: function (err) {
        console.log(err);
      }
    });
  });


});
