window.addEventListener("load", runOnLoad);
// alert('hello world')
const signOut = document.querySelector(".sign-out");

function runOnLoad() {
  const username = document.querySelector(".userfullname");
  const address = document.querySelector(".prof_address");
  const phone = document.querySelector(".prof_phone");
  const email = document.querySelector(".prof_email");
  const dob = document.querySelector(".prof_dob");
  const fullname = document.querySelector(".prof_fullname");
  const gender = document.querySelector(".prof_gender");
  const country = document.querySelector(".prof_country");

  const userData = JSON.parse(localStorage.getItem("data"));

  console.log(userData);

  username.innerHTML = userData.fullName;

  email.value = userData.email;

  if (!phone) {
    phone.placeholder = "+1 2345 67890";
  } else {
    phone.value = userData.phone;
  }
  if (!address) {
    address.placeholder = "Enter Your Address";
  } else {
    address.value = userData.address;
  }

  if (!dob) {
    dob.placeholder = "DD/MM/YYYY";
  } else {
    const date = Date.parse(userData.dob);
    function convert(str) {
      var date = new Date(str),
        mnth = ("0" + (date.getMonth() + 1)).slice(-2),
        day = ("0" + date.getDate()).slice(-2);
      return [day, mnth, date.getFullYear()].join("-");
    }
    dob.value = convert(date);
  }

  fullname.value = userData.fullName;
  gender.value = userData.gender;
  country.value = userData.country;
}

signOut.addEventListener("click", () => {
  localStorage.clear();
  document.location.href = "/hospital-care-provider/my-profile.html";
});
