$(document).ready(function(){

    var errorMessage = $('.error-message')
    
  $(".sign-out").click(function () {
    localStorage.clear();
    var loc = `${$(location).attr("origin")}/health-care-provider/login.html`;
    $(location).attr("href", loc);
  });
    const token = localStorage.getItem("token")
    
    const userToken = JSON.parse(token)
    
    if(!userToken) {
        var loc = `${$(location).attr('origin')}/hospital-care-provider/login.html`
        $(location).attr('href',loc)
    }
    
    // onboard Complete Medical Practice
    $(".submit-medical").click(function(event) {
    
        event.preventDefault()
    
        const med_location = $("#Location").val()
        const jobTitle = $("#Email-field-2").val()
        const yearsOfPractice = $("#YEARS-OF-PRACTICE-2").filter(":selected").val()
        const bio = $("#field.textarea-3").val()
        const department = $("#Department").filter(":selected").val()
        const supervisor = $("#Supervisor").filter(":selected").val()
    
            $(".submit-medical").html("Please wait....")
    
        if (med_location === "" || jobTitle === "" || yearsOfPractice === "" || bio === "" || department === "" || supervisor === "") {
            $(".onboard_comp_medical_practice_submit").html("Next: Payout Information")
            errorMessage.css("display", "block")
            errorMessage.css("background", "#c62828")
            errorMessage.html("Pls fill in all field....")
            errorMessage.animate({ top: "30px" }, 900, "linear", function() {
              console.log("All is cool")
            })
            errorMessage.animate({ top: "50px" }, 900, "linear", function() {
              console.log("All is cool")
            })
            setTimeout(function(){ errorMessage.css("display", "none") }, 2000)
            return false;
        }
        
        $(".submit-medical").html("Please wait....")
        console.log(med_location,jobTitle,yearsOfPractice,bio,department,supervisor)
        console.log("loading....")
    
        $.ajax({url: "https://aluuka-graph.herokuapp.com",
            contentType: "application/json",type:'POST',
            headers: { 'authorization': `Bearer ${JSON.parse(token)}` },
            data: JSON.stringify({ query: `mutation {
                                            onboardingCompleteMedicalPractice(
                                                    location: "${med_location}"
                                                jobTitle: "${jobTitle}"
                                                yearsOfPractice: "${yearsOfPractice}"
                                                bio: "${bio}"
                                                nameOfDepartment: "${department}"
                                                nameOfSupervisor: "${supervisor}"
                                            ) { 
                                                    success
                                                    message
                                                    data
                                                    token
                                                }
                                        }
                                        `
            }),
            success: function(result) {
                if(!result.data.onboardingCompleteMedicalPractice.success) {
                    $(".submit-medical").html("Next: Payout Information")
                    errorMessage.css("display", "block")
                    errorMessage.css("background", "#c62828")
                    errorMessage.html(result.data.onboardingCompleteMedicalPractice.message)
                    errorMessage.animate({
                      top: "30px"
                    }, 900, "linear", function() {
                      console.log("All is cool")
                    })
                    errorMessage.animate({
                      top: "50px"
                    }, 900, "linear", function() {
                      console.log("All is cool")
                    })
                    setTimeout(function(){ 
                        errorMessage.css("display", "none")
                    }, 2000)
                } else {
                       $(".submit-medical").html("Next: Payout Information")
                    errorMessage.css("display", "block")
                    errorMessage.css("background", "#43a047")
                        errorMessage.html(result.data.onboardingCompleteMedicalPractice.message)
                    errorMessage.animate({
                      top: "30px"
                    }, 900, "linear", function() {
                      console.log("All is cool")
                    })
                    errorMessage.animate({
                      top: "50px"
                    }, 900, "linear", function() {
                      console.log("All is cool")
                    })
                    setTimeout(function(){ 
                        errorMessage.css("display", "none")
                    }, 2000)
                    
                    var loc = `${$(location).attr('origin')}/hospital-care-provider/payout-information`
                                    $(location).attr('href',loc)
                }
                console.log(JSON.stringify(result.data))
            },
            error: function(err) { 
                console.log(err)
            } 
        })
        
    })
    
    
    })