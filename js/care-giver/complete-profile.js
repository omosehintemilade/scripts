$(document).ready(function () {
var errorMessage = $(".error-message");
const token = localStorage.getItem("token");
$.get("https://restcountries.eu/rest/v2/all").done(function (data) {
    data.map(function (i) {
    $(".onboarding_complete_country").append(`<option value="${i.name}"> 
                                ${i.name} 
                            </option>`);
    });
});
var notf = [];
var notfemail = false;
var notfphone = false;
$("#notfemail").click(function (event) {
    if (!notfemail) {
    //alert("ooo yes")
    notfemail = true;
    notf.push("email");
    console.log("notfemail", notfemail);
    console.log("notf", notf);
    } else {
    //alert("ooo no")
    notfemail = false;
    notf = notf.filter((notfItem) => notfItem !== "email");
    console.log("notfemail", notfemail);
    console.log("notf", notf);
    }
});
$("#notfphone").click(function (event) {
    if (!notfphone) {
    //alert("ooo yes")
    notfphone = true;
    notf.push("phone");
    console.log("notfphone", notfphone);
    console.log("notf", notf);
    } else {
    //alert("ooo no")
    notfphone = false;
    notf = notf.filter((notfItem) => notfItem !== "phone");
    console.log("notfphone", notfphone);
    console.log("notf", notf);
    }
});
/*    if($("#notfemail").prop('checked')) {
    console.log("Yeah, you check email")
    notf.push("email")
    } else {
    console.log("No, you did not check email")
    }
    if($("#notfphone").prop('checked')) {
    console.log("Yeah, you check Phone")
    notf.push("phone")
    } else {
    console.log("No, you did not check phone")
}

*/

let USER_IMAGE;
let USER_DOB

$(".image-3").attr("src", "https://cdn4.iconfinder.com/data/icons/small-n-flat/24/user-alt-512.png").css({ width: "200px", height: "200px", borderRadius: "100px" });

// ADD SELECT IMAGE BUTTON
$(".div-block-44 > a.button-medium.w-button").replaceWith(`
<input type="file" id="change_img" name="change_img" accept="image/png, image/jpeg" style="display:none"/>
<label for="change_img" class="button-medium w-button image-label" style="color:#fff; cursor: pointer; text-align: center;">Replace Image</label>
`);

$("#change_img").change(function (e) {
    var fileName = e.target.files[0];
    if (!fileName) {
    return false;
    }
    console.log("Files name", fileName);
    $(".image-label").text("Please wait....");
    const data = new FormData();
    data.append("file", fileName);
    data.append("upload_preset", "s0qhad82");
    data.append("cloud_name", "cnq");
    fetch("https://api.cloudinary.com/v1_1/devwian/image/upload", { method: "post", body: data })
    .then((res) => res.json())
    .then((data_res) => {
        const img_url = data_res.url;
        USER_IMAGE = img_url;
        console.log("Image URL", img_url);
        $(".image-label").text(fileName.name);
        $(".image-3").attr("src", img_url).css({ width: "200px", height: "200px", borderRadius: "100px" });
        // updateFields(img_url)
    })
    .catch((err) => {
        console.log("Upload error", err);
        $(".image-label").text("Replace Image");
    });
});

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
          $(".onboarding_complete_email").val(userInfo.email);
        }
      },
      error: function (err) {
        console.log(err);
      },
    });
  })();

  // CREATE FILTER BY DATE INPUT ELEMENT
  function initiateOrResetDateInput(){
    $("#date-2").replaceWith(
      `<input
      id="selectDateElement"
      type="text"
      class="w-input"
      style="margin: auto;"
      placeholder="Enter Date" 
      onfocus="(this.type='date')" 
      onblur="if(this.value==''){this.type='text'}">`)
    }
    initiateOrResetDateInput()

    
    $("#selectDateElement").change(function(event) {
        let date = new Date(event.target.value)
        USER_DOB = `${date.getMonth() + 1}-${date.getDate()}-${date.getFullYear()}`
});

// Complete Profile
$(".onboard-comp-submit").click(function (event) {
    event.preventDefault();
    const fullName = $(".onboarding_complete_fullname").val();
    const dob = $(".onboarding_complete_dob").val();
    const gender = $("select.onboarding_complete_gender option").filter(":selected").val();
    const country = $("select.onboarding_complete_country option").filter(":selected").val();
    const address = $(".onboarding_complete_address").val();
    const phone = $(".onboarding_complete_phone").val();
    const email = $(".onboarding_complete_email").val();
    $(".onboard-comp-submit").text("Please wait....");
    console.log("main trial", notf);
    if (fullName === "" || gender === "" || country === "" || address === "" || phone === "" || email === "") {
    $(".onboard-comp-submit").text("Next: Patient Information");
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
    const valid_date = new Date(dob);
    console.log(fullName, valid_date, gender, country, address, phone, email, notf);
    console.log("loading....");
    $.ajax({
    url: CONSTANTS.baseUrl,
    contentType: "application/json",
    type: "POST",
    headers: { authorization: `Bearer ${JSON.parse(token)}` },
    data: JSON.stringify({
        query: `mutation ($notificationChannel: [NotificationChannel]!){
                                    onboardingCompleteProfile(
                                        fullName: "${fullName}"
                                        dob: "${USER_DOB || valid_date}"
                                        gender: "${gender}"
                                        country: "${country}"
                                        address: "${address}"
                                        phone: "${phone}"
                                        email: "${email}"
                                        pictureURL: "${USER_IMAGE || ""}"
                                        notificationChannel: $notificationChannel
                                    ) { 
                                            success message returnStatus data token
                                        }
                                }`,
        variables: {
        notificationChannel: notf,
        },
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
        var loc = `${$(location).attr("origin")}/care-giver/patient-profile-3.html`;
        $(location).attr("href", loc);
        }
        console.log(JSON.stringify(result.data));
    },
    error: function (err) {
        console.log(err);
    },
    });
});
});