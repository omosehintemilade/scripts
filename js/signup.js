$(document).ready(function () {
  var errorMessage = $(".error-message");

  // Sign Up
  $(".onboardregsubmit").click(function () {
    const full_name = $(".onboarding_reg_fullname").val();
    const email = $(".onboarding_reg_email").val();
    const password = $(".onboarding_reg_password").val();
    const password_two = $(".onboarding_reg_password_two").val();

    $(".onboardregsubmit").html("Loading....");

    if (
      full_name === "" ||
      email === "" ||
      password === "" ||
      password_two === ""
    ) {
      $(".onboardregsubmit").html("Sign Up");
      errorMessage.html("Pls fill in all field....");
      errorMessage.css("display", "block");
      errorMessage.css("background", "#c62828");
      errorMessage.animate({ top: "20px" }, 900, "linear", function () {
        console.log("All is cool");
      });
      errorMessage.animate({ top: "40px" }, 900, "linear", function () {
        console.log("All is cool");
      });
      setTimeout(function () {
        errorMessage.css("display", "none");
      }, 2000);
      return;
    }

    if (password !== password_two) {
      $(".onboardregsubmit").html("Sign Up");
      errorMessage.html("Password doesn't match....");
      errorMessage.css("display", "block");
      errorMessage.css("background", "#c62828");
      errorMessage.animate({ top: "20px" }, 900, "linear", function () {
        console.log("All is cool");
      });
      errorMessage.animate({ top: "40px" }, 900, "linear", function () {
        console.log("All is cool");
      });
      setTimeout(function () {
        errorMessage.css("display", "none");
      }, 2000);
      return false;
    }

    console.log(full_name, email, password);
    console.log("loading....");

    $.ajax({
      url: "https://aluuka-backend.herokuapp.com",
      contentType: "application/json",
      type: "POST",
      data: JSON.stringify({
        query: `mutation {
                                            onboardingCreateAccount(
                                                fullName: "${full_name}"
                                                email: "${email}"
                                                password: "${password}") { 
                                                    success
                                                    message
                                                    data
                                                    token
                                                }
                                        }`
      }),
      success: function (result) {
        if (!result.data.onboardingCreateAccount.success) {
          $(".onboardregsubmit").html("Sign Up");
          errorMessage.css("display", "block");
          errorMessage.css("background", "#c62828");
          errorMessage.html(result.data.onboardingCreateAccount.message);
          errorMessage.animate({ top: "20px" }, 900, "linear", function () {
            console.log("All is cool");
          });
          errorMessage.animate({ top: "40px" }, 900, "linear", function () {
            console.log("All is cool");
          });
          setTimeout(function () {
            errorMessage.css("display", "none");
          }, 2000);
        } else {
          $(".onboardregsubmit").html("Sign Up");
          errorMessage.css("display", "block");
          errorMessage.css("background", "#43a047");
          errorMessage.html(result.data.onboardingCreateAccount.message);
          errorMessage.animate({ top: "20px" }, 900, "linear", function () {
            console.log("All is cool");
          });
          errorMessage.animate({ top: "40px" }, 900, "linear", function () {
            console.log("All is cool");
          });
          setTimeout(function () {
            errorMessage.css("display", "none");
          }, 2000);
          localStorage.setItem(
            "data",
            JSON.stringify(result.data.onboardingCreateAccount.data)
          );
          localStorage.setItem(
            "token",
            JSON.stringify(result.data.onboardingCreateAccount.token)
          );
          var loc = `${$(location).attr("origin")}/onboarding.html`;
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
