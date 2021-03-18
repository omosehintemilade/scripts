
$(document).ready(function(){
    var errorMessage = $('.error-message')
    // Forgot Password
    $(".forgot_password_btn").click(function(event) {
            event.preventDefault()
        var forgot_password_email = $('.forgot_password_email').val()
        $(".forgot_password_btn").html("Please wait...")
        if (forgot_password_email === "") {
                $(".forgot_password_btn").html("Recover Password")
            errorMessage.css("display", "block")
            errorMessage.css("background", "#c62828")
            errorMessage.html("Pls fill in all field....")
            errorMessage.animate({
              top: "30px"
            }, 1200, "linear", function() {
              console.log("All is cool")
            })
            errorMessage.animate({
              top: "50px"
            }, 1200, "linear", function() {
              console.log("All is cool")
            })
            setTimeout(function(){ 
                        errorMessage.css("display", "none")
            }, 2500)
            return false;
        }
        console.log("loading....")
        $.ajax({url: CONSTANTS.baseUrl,
            contentType: "application/json",
            type:'POST',
            data: JSON.stringify({ query: `mutation {
                                            forgotPassword(
                                                email: "${forgot_password_email}"
                                            ) { 
                                                    success
                                                    message
                                                }
                                        }
                                        `
            }),
            success: function(result) {
                if(!result.data.forgotPassword.success) {
                    $(".forgot_password_btn").html("Recover Password")
                    errorMessage.html(result.data.forgotPassword.message)
                    errorMessage.css("display", "block")
                    errorMessage.css("background", "#c62828")
                    errorMessage.animate({  top: "40px" }, 1200, "linear", function() { console.log("All is cool") })
                                    errorMessage.animate({  top: "60px" }, 1200, "linear", function() { console.log("All is cool") })
                    setTimeout(function(){ errorMessage.css("display", "none") }, 2500)
                } else {
                $(".forgot_password_btn").html("Recover Password")
                    errorMessage.html(result.data.forgotPassword.message)
                    errorMessage.css("display", "block")
                    errorMessage.css("background", "#43a047")
                    errorMessage.animate({  top: "40px" }, 1200, "linear", function() { console.log("All is cool") })
                                    errorMessage.animate({  top: "60px" }, 1200, "linear", function() { console.log("All is cool") })
                    setTimeout(function(){ errorMessage.css("display", "none") }, 2500)
                }
                console.log(JSON.stringify(result.data))
            },
            error: function(err) { 
                console.log(err)
            } 
        })
    })
    })