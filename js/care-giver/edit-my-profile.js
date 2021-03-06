$(document).ready(function () {
  var errorMessage = $(".error-message");
  const token = localStorage.getItem("token");
  const userData = JSON.parse(localStorage.getItem("data"));
  if (!userData) {
    var loc = `${$(location).attr("origin")}/care-giver/login`;
    $(location).attr("href", loc);
  }
  const userfullname = userData.fullName;
  var firstName = userfullname.replace(/ .*/, "");
  $(".firstname").html(`Welcome, ${firstName}`);
  $(".userfullname").html(`${userfullname}`);
  $(".sign-out").click(function () {
    localStorage.clear();
    var loc = `${$(location).attr("origin")}/care-giver/login`;
    $(location).attr("href", loc);
  });
  $.get("https://restcountries.eu/rest/v2/all").done(function (data) {
    data.map(function (i) {
      $(".onboarding_complete_country").append(`<option value="${i.name}"> 
                                 ${i.name} 
                            </option>`);
    });
  });

  $(".onboarding_complete_gender").html(`
  <option value="male">Male</option>
  <option value="female">Female</option>
  `);

  var USER_IMAGE


  (function () {
    $.ajax({
      url: CONSTANTS.baseUrl,
      contentType: "application/json",
      type: "POST",
      headers: { authorization: `Bearer ${JSON.parse(token)}` },
      data: JSON.stringify({
        query: `
      query{
        getUserAccount
        }
            `,
      }),
      success: function (result) {
        if (result.data.getUserAccount) {
          const userInfo = result.data.getUserAccount;
          console.log(userInfo);
          $(".onboarding_complete_fullname").val(userInfo.fullName);
          $(".create_patient_dob").val(userInfo.dob.slice(0, 10));
          $(".onboarding_complete_gender").val(userInfo.gender);
          $(".onboarding_complete_country").val(userInfo.country);
          $(".onboarding_complete_address").val(userInfo.address);
          $(".onboarding_complete_phone").val(userInfo.phone);
          $(".onboarding_complete_email").val(userInfo.email);
          USER_IMAGE = userInfo.pictureURL || ""
          $(".mpe-profile-image").attr("src", userInfo.pictureURL || "https://cdn4.iconfinder.com/data/icons/small-n-flat/24/user-alt-512.png").css({ width: "200px", height: "200px", borderRadius: "100px" })

          if (userInfo.notificationChannel.includes("email")) {
            $("#notfemail").click();
          }

          if (userInfo.notificationChannel.includes("phone")) {
            $("#notfphone").click();
          }
        }
      },
      error: function (err) {
        console.log(err);
      },
    });
  })();

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

  // IMAGE SECTION
  $(".mpe-button-replace-image").replaceWith(`
  <input type="file" id="change_img" name="change_img" accept="image/png, image/jpeg" style="display:none"/>
  <label for="change_img" class="button-medium w-button image-label" style="color:#fff; cursor: pointer; text-align: center;">Replace Image</label>
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
      USER_IMAGE =  img_url
      console.log('Image URL', img_url)
      $(".image-label").text(fileName.name)
      $(".mpe-profile-image").attr("src", img_url).css({ width: "200px", height: "200px", borderRadius: "100px" });
      // updateFields(img_url)
    })
    .catch(err=>{
      console.log("Upload error", err)
      $(".image-label").text("Replace Image")
    })

    })


  // Edit Profile
  $(".onboard-comp-submit").click(function (event) {
    event.preventDefault();
    const fullName = $(".onboarding_complete_fullname").val();
    const dob = $(".create_patient_dob").val();
    const gender = $("select.onboarding_complete_gender option").filter(":selected").val();
    const country = $("select.onboarding_complete_country option").filter(":selected").val();
    const address = $(".onboarding_complete_address").val();
    const phone = $(".onboarding_complete_phone").val();
    const email = $(".onboarding_complete_email").val();
    $(".onboard-comp-submit").html("Please wait....");
    var notf = [];
    if ($("#notfemail").prop("checked")) {
      notf.push("email");
    }
    if ($("#notfphone").prop("checked")) {
      notf.push("phone");
    }
    if (fullName === "" || dob === "" || gender === "" || country === "" || address === "" || phone === "" || email === "") {
      showErrorMessageOnScreen(errorMessage, "Please fill in all field..", true);
      return false;
    }

    if (notf.includes("email") && notf.includes("phone")) {
      showErrorMessageOnScreen(errorMessage, "Select only one notification method", true);
      return false;
    }
    const valid_date = new Date(dob);
    console.log(dob);
    console.log(fullName, valid_date, gender, country, address, phone, email, notf);
    console.log("loading....");
    $.ajax({
      url: CONSTANTS.baseUrl,
      contentType: "application/json",
      type: "POST",
      headers: { authorization: `Bearer ${JSON.parse(token)}` },
      data: JSON.stringify({
        query: `mutation {
                                    onboardingCompleteProfile(
                                        fullName: "${fullName}"
                                        dob: "${valid_date}"
                                        gender: "${gender}"
                                        country: "${country}"
                                        address: "${address}"
                                        phone: "${phone}"
                                        email: "${email}"
                                        pictureURL: "${USER_IMAGE}"
                                        notificationChannel: ${notf}
                                    ) { 
                                            success message returnStatus data token
                                        }
                                }
                                `,
      }),
      success: function (result) {
        if (!result.data.onboardingCompleteProfile.success) {
          $(".onboard-comp-submit").html("Next: Patient Information");
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
          showSuccessMessageOnScreen(errorMessage, result.data.onboardingCompleteProfile.message, true);

          localStorage.setItem("data", JSON.stringify(result.data.onboardingCompleteProfile.data));
          setTimeout(function () {
            var loc = `${$(location).attr("origin")}/care-giver/my-profile.html`;
            $(location).attr("href", loc);
          }, 3000);
        }
        console.log(JSON.stringify(result.data));
      },
      error: function (err) {
        console.log(err);
      },
    });
  });
});