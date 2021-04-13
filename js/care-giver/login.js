$(document).ready(function () {
  var errorMessage = $(".error-message");
  // Login
  $(".loginsubmit").click(function () {
    const email = $(".login_email").val();
    const password = $(".login_password").val();
    $(".loginsubmit").html("Loading....");
    if (email === "" || password === "") {
      $(".loginsubmit").html("Login");
      errorMessage.css("display", "block");
      errorMessage.css("background", "#c62828");
      errorMessage.html("Pls fill in all field....");
      errorMessage.animate(
        {
          top: "30px"
        },
        900,
        "linear",
        function () {
          console.log("All is cool");
        }
      );
      errorMessage.animate(
        {
          top: "50px"
        },
        900,
        "linear",
        function () {
          console.log("All is cool");
        }
      );
      setTimeout(function () {
        errorMessage.css("display", "none");
      }, 2000);
      return false;
    }
    console.log(email);
    console.log("loading....");
    $.ajax({
      url: CONSTANTS.baseUrl,
      contentType: "application/json",
      type: "POST",
      data: JSON.stringify({
        query: `mutation {
                                        login(
                                            email: "${email}"
		                                    		password: "${password}"
                                        ) { 
                                                success
                                                message
                                                data
                                                token
                                            }
                                    }
                                    `
      }),
      success: function (result) {
        if (!result.data.login.success) {
          $(".loginsubmit").html("Login");
          errorMessage.css("display", "block");
          errorMessage.css("background", "#c62828");
          errorMessage.html(result.data.login.message);
          errorMessage.animate(
            {
              top: "30px"
            },
            900,
            "linear",
            function () {
              console.log("All is cool");
            }
          );
          errorMessage.animate(
            {
              top: "50px"
            },
            900,
            "linear",
            function () {
              console.log("All is cool");
            }
          );
          setTimeout(function () {
            errorMessage.css("display", "none");
          }, 2000);
        } else {
          if (result.data.login.data.role !== "CARE_GIVER") {
            $(".loginsubmit").html("Login");
            errorMessage.css("display", "block");
            errorMessage.css("background", "#c62828");
            errorMessage.html("User not a Care Giver");
            errorMessage.animate(
              {
                top: "30px"
              },
              900,
              "linear",
              function () {
                console.log("All is cool");
              }
            );
            errorMessage.animate(
              {
                top: "50px"
              },
              900,
              "linear",
              function () {
                console.log("All is cool");
              }
            );
            setTimeout(function () {
              errorMessage.css("display", "none");
            }, 2000);
            var loc = `${$(location).attr(
              "origin"
            )}/health-care-provider/login.html`;
            $(location).attr("href", loc);
          } else {
            $(".loginsubmit").html("Login");
            errorMessage.css("display", "block");
            errorMessage.css("background", "#43a047");
            errorMessage.html(result.data.login.message);
            errorMessage.animate(
              {
                top: "30px"
              },
              900,
              "linear",
              function () {
                console.log("All is cool");
              }
            );
            errorMessage.animate(
              {
                top: "50px"
              },
              900,
              "linear",
              function () {
                console.log("All is cool");
              }
            );
            setTimeout(function () {
              errorMessage.css("display", "none");
            }, 2000);
            localStorage.setItem(
              "data",
              JSON.stringify(result.data.login.data)
            );
            localStorage.setItem(
              "token",
              JSON.stringify(result.data.login.token)
            );
            var loc = `${$(location).attr(
              "origin"
            )}/care-giver/treatments-main-dashboard.html`;
            $(location).attr("href", loc);
          }
        }
        console.log(JSON.stringify(result.data));
      },
      error: function (err) {
        console.log(err);
      }
    });
  });
});
