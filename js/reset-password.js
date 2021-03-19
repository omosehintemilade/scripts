$(document).ready(function(){

  $("body").prepend('<div class="error-message"></div>');
    
  $(".sign-out").click(function () {
    localStorage.clear();
    var loc = `${$(location).attr("origin")}/health-care-provider/login.html`;
    $(location).attr("href", loc);
  });

	var errorMessage = $('.error-message')

    function getUrlVars(){
        var vars = [], hash;
        var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
        for(var i = 0; i < hashes.length; i++) {
            hash = hashes[i].split('=');
            vars.push(hash[0]);
            vars[hash[0]] = hash[1];
        }
        return vars;
    }
    var token = getUrlVars()["token"]

    $(".reset_password_btn").click(function(event) {

        event.preventDefault()

        const reset_password = $(".reset_password").val()
        const reset_confirm_password = $(".reset_confirm_password").val()
        const reset_token = token

        $(".reset_password_btn").html("Please wait...")

        if (reset_token === "") {   
            $(".reset_password_btn").html("Reset Password")
            errorMessage.css("display", "block")
            errorMessage.css("background", "#c62828")
            errorMessage.html("Session expired, pls try again....")
            errorMessage.animate({ top: "30px" }, 900, "linear", function() {
              console.log("All is cool")
            })
            errorMessage.animate({ top: "50px" }, 900, "linear", function() {
              console.log("All is cool")
            })
            setTimeout(function(){  errorMessage.css("display", "none") }, 2000)
            return false;
        } 

        if (reset_password === "" || reset_confirm_password === "") {   
            $(".reset_password_btn").html("Reset Password")
            errorMessage.css("display", "block")
            errorMessage.css("background", "#c62828")
            errorMessage.html("Pls fill in all fields....")
            errorMessage.animate({ top: "30px" }, 900, "linear", function() {
              console.log("All is cool")
            })
            errorMessage.animate({ top: "50px" }, 900, "linear", function() {
              console.log("All is cool")
            })
            setTimeout(function(){  errorMessage.css("display", "none") }, 2000)
            return false;
        } 

        if (reset_password !== reset_confirm_password) {   
            $(".reset_password_btn").html("Reset Password")
            errorMessage.css("display", "block")
            errorMessage.css("background", "#c62828")
            errorMessage.html("Password does not match....")
            errorMessage.animate({ top: "30px" }, 900, "linear", function() {
              console.log("All is cool")
            })
            errorMessage.animate({ top: "50px" }, 900, "linear", function() {
              console.log("All is cool")
            })
            setTimeout(function(){  errorMessage.css("display", "none") }, 2000)
            return false;
        }
    

        $.ajax({
            url: "https://aluuka-graph.herokuapp.com",
            contentType: "application/json",
            type: 'POST',
            data: JSON.stringify({ query: `mutation {
                                                resetPassword(
                                                    resetToken: "${reset_token}"
                                                    password: "${reset_password}"
                                                    repeat_password: "${reset_confirm_password}"
                                                ){
                                                        success
                                                        message
                                                        returnStatus
                                                        token
                                                        data
                                                    }
                                                }
                                            `
            }), 
            success: function(result) {
                if(!result.data.resetPassword.success) {
                    $(".reset_password_btn").html("Reset password")
                    errorMessage.css("display", "block")
                    errorMessage.css("background", "#c62828")
                    errorMessage.html(result.data.resetPassword.message)
                    errorMessage.animate({ top: "30px" }, 900, "linear", function() { console.log("All is cool") })
                    errorMessage.animate({ top: "50px" }, 900, "linear", function() { console.log("All is cool") })
                    setTimeout(function(){  errorMessage.css("display", "none") }, 2000)
                } else {
                    $(".reset_password_btn").html("Reset password")
                    errorMessage.css("display", "block")
                    errorMessage.css("background", "#43a047")
                    errorMessage.html(result.data.resetPassword.message)

                    errorMessage.animate({ top: "30px" }, 900, "linear", function() { console.log("All is cool") })
                    errorMessage.animate({ top: "50px" }, 900, "linear", function() { console.log("All is cool") })
                    setTimeout(function(){  errorMessage.css("display", "none") }, 2000)
                    
                    var loc = `${$(location).attr('origin')}/sign-up`
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