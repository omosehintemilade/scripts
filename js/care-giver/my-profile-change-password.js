$(document).ready(function () {
  const userData = JSON.parse(localStorage.getItem("data"));
  if (!userData) {
    var loc = `${$(location).attr("origin")}/care-giver/login.html`;
    $(location).attr("href", loc);
  }
  $(".userfullname").html(`${userData.fullName}`);
  var errorMessage = $(".error-message");
  const token = localStorage.getItem("token");
  // Change Password
  $(".change_password_submit").click(function (event) {
    event.preventDefault();
    const old_password = $(".change_old_password").val();
    const new_password = $(".change_new_password").val();
    const confirm_password = $(".change_confirm_password").val();
    $(".change_password_submit").text("Please wait....");
    if (old_password === "" || new_password === "" || confirm_password === "") {
      $(".change_password_submit").text("Save");
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
    console.log(old_password, new_password, confirm_password);
    console.log("loading....");
    $.ajax({
      url: CONSTANTS.baseUrl,
      contentType: "application/json",
      type: "POST",
      headers: { authorization: `Bearer ${JSON.parse(token)}` },
      data: JSON.stringify({
        query: `mutation {
                                  updatePassword(
                                  previousPassword: "${old_password}"
                                  newPassword: "${new_password}"
                                  repeatNewPassword: "${confirm_password}"
                                  ) { 
                                          success
                                          message
                                          data
                                      }
                              }
                              `,
      }),
      success: function (result) {
        if (!result.data.updatePassword.success) {
          $(".change_password_submit").text("Save");
          errorMessage.css("display", "block");
          errorMessage.css("background", "#c62828");
          errorMessage.html(result.data.updatePassword.message);
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
          $(".change_password_submit").text("Save");
          errorMessage.css("display", "block");
          errorMessage.css("background", "#43a047");
          errorMessage.html(result.data.updatePassword.message);
          errorMessage.animate({ top: "30px" }, 900, "linear", function () {
            console.log("All is cool");
          });
          errorMessage.animate({ top: "50px" }, 900, "linear", function () {
            console.log("All is cool");
          });
          setTimeout(function () {
            errorMessage.css("display", "none");
          }, 2000);
          localStorage.setItem("data", JSON.stringify(result.data.updatePassword.data));
          localStorage.removeItem("data")
          var loc = `${$(location).attr("origin")}/care-giver/login.html`;
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