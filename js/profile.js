$(document).ready(function () {

  $("body").prepend('<div class="error-message"></div>');
  
  $(".sign-out").click(function () {
    localStorage.clear();
    var loc = `${$(location).attr("origin")}/health-care-provider/login.html`;
    $(location).attr("href", loc);
  });
  var errorMessage = $(".error-message");
  
  const token = localStorage.getItem("token");
  const userToken = JSON.parse(token)
  if(!userToken) {
      var loc = `${$(location).attr('origin')}/hospital-care-provider/login.html`
      $(location).attr('href',loc)
  }

  $.get("https://restcountries.eu/rest/v2/all").done(function (data) {
    data.map(function (i) {
      $(".country-field").append(`<option value="${i.name}"> 
                                       ${i.name} 
                                  </option>`);
    });
  });
  
  // const prof_fullName = document.querySelector(".full-name");
  // const prof_dob = document.querySelector(".dob");
  // const prof_gender = document.querySelector(".gender");
  // const prof_country = document.querySelector(".congo");
  // const prof_address = document.querySelector(".address-text");
  // const prof_phone = document.querySelector(".phone");
  // const prof_email = document.querySelector(".email");

  
  document.querySelector('.cap-dob-field').type = 'date';
  
  document.querySelector(".mpe-profile-image").style.borderRadius = "100%";
  
  
  const editUsername = document.querySelector(".cap-fullname-field");
  const editUseremail = document.querySelector(".cap-email-field");

  editUsername.disabled = true;  
  editUseremail.disabled = true;

  const userData = JSON.parse(localStorage.getItem("data"));
  
  console.log(userData.fullName, userData.email);

  editUsername.value = userData.fullName;
  editUseremail.value = userData.email;
  // prof_fullName.textContent = userData.fullName;
  // alert(token);
  // REMOVE PRECEEDING & TRAILING QUOTE SYMBOLS
  // token = token.substring(1, token.length - 1);

  let pictureURL = "";

  // deleteBtn.addEventListener("click", e => {
  //   pictureURL = "";
  // });

  // Upload Image

  // 
  // $('.mpe-button-replace-image').click(function(){
  //   alert('you clicked me0');
  //    $('#change_img').trigger('click'); 
  //   });
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
    localStorage.setItem("avatar", img_url);
    console.log('Image URL', img_url);
    $('.mpe-profile-image').attr('src', img_url);
    $(".image-label").text("Uploaded");
  })
  .catch(err=>{
    console.log("Upload error", err)
    $(".image-label").text("Replace Image")
  })


  })

  // End Upload Image


  var notf = [];
  var notfemail = false;
  var notfphone = false;
  $("#checkbox-2").click(function (event) {
    // alert("ooo yes")
    if (!notfemail) {
      notfemail = true;
      notf.push("email");
      // console.log("notfemail", notfemail);
      // console.log("notf", notf);
    } else {
      //alert("ooo no")
      notfemail = false;
      notf = notf.filter((notfItem) => notfItem !== "email");
      // console.log("notfemail", notfemail);
      // console.log("notf", notf);
    }
  });
  $("#checkbox-3").click(function (event) {
    if (!notfphone) {
      notfphone = true;
      notf.push("phone");
      // console.log("notfphone", notfphone);
      // console.log("notf", notf);
    } else {
      notfphone = false;
      notf = notf.filter((notfItem) => notfItem !== "phone");
      // console.log("notfphone", notfphone);
      // console.log("notf", notf);
    }
  });
 
$(".onboard-comp-submit").click(function (event) {
    event.preventDefault();
    const fullname = $(".cap-fullname-field").val();
    const image_url = localStorage.getItem("img_url")
    const staledob = $(".cap-dob-field").val();
    const dob = new Date(staledob);
    const gender = $(".sex-field").val();
    const country = $(".country-field").val();
    const address = $(".cap-address-field").val();
    const email = $(".cap-email-field").val();
    const phone = $(".cap-phone-field").val();
    const submitBtn = $(".onboard-comp-submit").val();
    const deleteBtn = $(".button-plain-icon").val();
    event.target.value = "Saving...";

    if (
      !fullname ||
      !dob ||
      !image_url ||
      !gender ||
      !country ||
      !address ||
      !phone ||
      !email ||
      !notf
    ) {
      errorMessage.css("display", "block");
      errorMessage.css("background", "#c62828");
      errorMessage.html("Please fill in all field....");
      errorMessage.animate({ top: "30px" }, 900, "linear");
      setTimeout(function () {
        errorMessage.css("display", "none");
      }, 2000);
      return;
    }

    console.log(notf);

      
      $.ajax({
        url: "https://aluuka-graph.herokuapp.com",
        contentType: "application/json",
        type: "POST",
        headers: {
          authorization: `Bearer ${token} `
        },

        data: JSON.stringify({
          query: `mutation {
        onboardingCompleteProfile(
          fullName: "${fullname}"
          pictureURL: "${image_url}"
          dob: "${dob}"
          gender: "${gender}"
          country: "${country}"
          address: "${address}"
          phone: "${phone}"
          email: "${email}"
          notificationChannel: ${notf}
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
            if (!result.data.onboardingCompleteProfile.success) {
            $(".onboard-comp-submit").text("Next: Patient Information");
            errorMessage.css("display", "block");
            errorMessage.css("background", "#c62828");
            errorMessage.html(result.data.onboardingCompleteProfile.message);
            errorMessage.animate({ top: "30px" }, 900, "linear", function () {
                console.log("All is cool");
            });
            errorMessage.animate({ top: "50px" }, 900, "linear", function () {
                console.log("All is cool");
            });
            setTimeout(function () {
                errorMessage.css("display", "none");
            }, 2000);
            } else {
            $(".onboard-comp-submit").text("Next: Patient Information");
            errorMessage.css("display", "block");
            errorMessage.css("background", "#43a047");
            errorMessage.html(result.data.onboardingCompleteProfile.message);
            errorMessage.animate({ top: "30px" }, 900, "linear", function () {
                console.log("All is cool");
            });
            errorMessage.animate({ top: "50px" }, 900, "linear", function () {
                console.log("All is cool");
            });
            setTimeout(function () {
                errorMessage.css("display", "none");
            }, 2000);
            localStorage.setItem("data", JSON.stringify(result.data.onboardingCompleteProfile.data));
            var loc = `${$(location).attr("origin")}/health-care-provider/medical-practice.html`;
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
