$(document).ready(function () {
  const userData = JSON.parse(localStorage.getItem("data"));
  //console.log(userData);
  if (!userData) {
    var loc = `${$(location).attr("origin")}/care-giver/login.html`;
    $(location).attr("href", loc);
  }
  $(".userfullname").html(`${userData.fullName}`);
  $(".prof_fullname").attr("placeholder", `${userData.fullName}`);
  const options = {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "2-digit",
  };
  const main_date = new Date(userData.dob).toLocaleDateString("en-US", options);
  $(".prof_dob").attr("placeholder", `${main_date}`);
  $(".prof_address").attr("placeholder", `${userData.address}`);
  $(".prof_email").attr("placeholder", `${userData.email}`);
  $(".prof_phone").attr("placeholder", `${userData.phone}`);
  $(".image-5")
    .attr("src", userData.pictureURL || "https://cdn4.iconfinder.com/data/icons/small-n-flat/24/user-alt-512.png")
    .css({ width: "100px", height: "100px", borderRadius: "50px" });
});