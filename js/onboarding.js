
      $(document).ready(function () {
        var errorMessage = $(".error-message");
        // Getting users token from local storage
        const token = localStorage.getItem("token");
        if (!token) {
          var loc = `${$(location).attr("origin")}/sign-up`;
          $(location).attr("href", loc);
        }
        console.log(`Bearer ` + JSON.parse(token));
        // Care Giver Role
        $(".onboarding_role_caregiver").click(function (event) {
          event.preventDefault();
          console.log("CARE_GIVER");
          console.log("loading....");
          $.ajax({
            url: "https://aluuka-graph.herokuapp.com",
            contentType: "application/json",
            type: "POST",
            headers: { authorization: `Bearer ${JSON.parse(token)}` },
            data: JSON.stringify({
              query: `mutation {
                                        onboardingChooseRole(
                                            role: CARE_GIVER
                                        ) { 
                                                success
                                                message
                                                returnStatus
                                                data
                                            }
                                    }
                                    `
            }),
            success: function (result) {
              if (!result.data.onboardingChooseRole.success) {
                errorMessage.html(result.data.onboardingChooseRole.message);
                errorMessage.css("display", "block");
                errorMessage.css("background", "#c62828");
                errorMessage.animate(
                  { top: "40px" },
                  900,
                  "linear",
                  function () {
                    console.log("All is cool");
                  }
                );
                errorMessage.animate(
                  { top: "60px" },
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
                errorMessage.html(result.data.onboardingChooseRole.message);
                errorMessage.css("display", "block");
                errorMessage.css("background", "#43a047");
                errorMessage.animate(
                  { top: "40px" },
                  900,
                  "linear",
                  function () {
                    console.log("All is cool");
                  }
                );
                errorMessage.animate(
                  { top: "60px" },
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
                  JSON.stringify(result.data.onboardingChooseRole.data)
                );
                var loc = `${$(location).attr(
                  "origin"
                )}/care-giver/complete-profile.html`;
                $(location).attr("href", loc);
              }
              console.log(JSON.stringify(result.data));
            },
            error: function (err) {
              console.log(err);
            }
          });
        });
        // Hospital Health care Role
        $(".onboarding_role_hospital_healthcare").click(function (event) {
          event.preventDefault();
          console.log("HEALTHCARE_PROVIDER: Hospital");
          console.log("loading....");
          $.ajax({
            url: "https://aluuka-backend.herokuapp.com",
            contentType: "application/json",
            type: "POST",
            headers: { authorization: `Bearer ${JSON.parse(token)}` },
            data: JSON.stringify({
              query: `mutation {
                                        onboardingChooseRole(
                                        role: HEALTHCARE_PROVIDER
    																		kindOfHealthcareProvider: Hospital
                                        ) { 
                                                success
                                                message
                                                returnStatus
                                                data
                                            }
                                    }
                                    `
            }),
            success: function (result) {
              if (!result.data.onboardingChooseRole.success) {
                errorMessage.html(result.data.onboardingChooseRole.message);
                errorMessage.css("display", "block");
                errorMessage.css("background", "#c62828");
                errorMessage.animate(
                  { top: "40px" },
                  900,
                  "linear",
                  function () {
                    console.log("All is cool");
                  }
                );
                errorMessage.animate(
                  { top: "60px" },
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
                errorMessage.html(result.data.onboardingChooseRole.message);
                errorMessage.css("display", "block");
                errorMessage.css("background", "#43a047");
                errorMessage.animate(
                  { top: "40px" },
                  900,
                  "linear",
                  function () {
                    console.log("All is cool");
                  }
                );
                errorMessage.animate(
                  { top: "60px" },
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
                  JSON.stringify(result.data.onboardingChooseRole.data)
                );
                var loc = `${$(location).attr(
                  "origin"
                )}/hospital-care-provider/profile.html`;
                $(location).attr("href", loc);
              }
              console.log(JSON.stringify(result.data));
            },
            error: function (err) {
              console.log(err);
            }
          });
        });
        // Pharmacy Health care Role
        $(".onboarding_role_pharmacy_healthcare").click(function (event) {
          event.preventDefault();
          console.log("HEALTHCARE_PROVIDER: Pharmacy");
          console.log("loading....");
          $.ajax({
            url: "https://aluuka-backend.herokuapp.com",
            contentType: "application/json",
            type: "POST",
            headers: { authorization: `Bearer ${JSON.parse(token)}` },
            data: JSON.stringify({
              query: `mutation {
                                        onboardingChooseRole(
                                            role: HEALTHCARE_PROVIDER
                                            kindOfHealthcareProvider: Pharmacy
                                        ) { 
                                                success
                                                message
                                                returnStatus
                                                data
                                            }
                                    }
                                    `
            }),
            success: function (result) {
              if (!result.data.onboardingChooseRole.success) {
                errorMessage.html(result.data.onboardingChooseRole.message);
                errorMessage.css("display", "block");
                errorMessage.css("background", "#c62828");
                errorMessage.animate(
                  { top: "40px" },
                  900,
                  "linear",
                  function () {
                    console.log("All is cool");
                  }
                );
                errorMessage.animate(
                  { top: "60px" },
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
                errorMessage.html(result.data.onboardingChooseRole.message);
                errorMessage.css("display", "block");
                errorMessage.css("background", "#43a047");
                errorMessage.animate(
                  { top: "40px" },
                  900,
                  "linear",
                  function () {
                    console.log("All is cool");
                  }
                );
                errorMessage.animate(
                  { top: "60px" },
                  900,
                  "linear",
                  function () {
                    console.log("All is cool");
                  }
                );
                setTimeout(function () {
                  errorMessage.css("display", "none");
                }, 2000);
              }
              console.log(JSON.stringify(result.data));
            },
            error: function (err) {
              console.log(err);
            }
          });
        });
        // Laboratory Health care Role
        $(".onboarding_role_laboratory_healthcare").click(function (event) {
          event.preventDefault();
          console.log("HEALTHCARE_PROVIDER: Laboratory");
          console.log("loading....");
          $.ajax({
            url: "https://aluuka-backend.herokuapp.com",
            contentType: "application/json",
            type: "POST",
            headers: { authorization: `Bearer ${JSON.parse(token)}` },
            data: JSON.stringify({
              query: `mutation {
                                        onboardingChooseRole(
                                            role: HEALTHCARE_PROVIDER
                                            kindOfHealthcareProvider: Laboratory
                                        ) { 
                                                success
                                                message
                                                returnStatus
                                                data
                                            }
                                    }
                                    `
            }),
            success: function (result) {
              if (!result.data.onboardingChooseRole.success) {
                errorMessage.html(result.data.onboardingChooseRole.message);
                errorMessage.css("display", "block");
                errorMessage.css("background", "#c62828");
                errorMessage.animate(
                  { top: "40px" },
                  900,
                  "linear",
                  function () {
                    console.log("All is cool");
                  }
                );
                errorMessage.animate(
                  { top: "60px" },
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
                errorMessage.html(result.data.onboardingChooseRole.message);
                errorMessage.css("display", "block");
                errorMessage.css("background", "#43a047");
                errorMessage.animate(
                  { top: "40px" },
                  900,
                  "linear",
                  function () {
                    console.log("All is cool");
                  }
                );
                errorMessage.animate(
                  { top: "60px" },
                  900,
                  "linear",
                  function () {
                    console.log("All is cool");
                  }
                );
                setTimeout(function () {
                  errorMessage.css("display", "none");
                }, 2000);
              }
              console.log(JSON.stringify(result.data));
            },
            error: function (err) {
              console.log(err);
            }
          });
        });
      });
    