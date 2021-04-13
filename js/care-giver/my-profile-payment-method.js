$(document).ready(function () {
  const userData = JSON.parse(localStorage.getItem("data"));
  if (!userData) {
    var loc = `${$(location).attr("origin")}/care-giver/login.html`;
    $(location).attr("href", loc);
  }
  $(".userfullname").html(`${userData.fullName}`);
});
