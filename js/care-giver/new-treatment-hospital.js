$(document).ready(function () {
  var errorMessage = $(".error-message");
  const token = localStorage.getItem("token");
  const userData = JSON.parse(localStorage.getItem("data"));
  if (!userData) {
    var loc = `${$(location).attr("origin")}/care-giver/login.html`;
    $(location).attr("href", loc);
  }
  const userfullname = userData.fullName;
  $(".userfullname").html(`${userfullname}`);
});
