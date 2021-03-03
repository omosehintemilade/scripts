window.addEventListener("load", runOnLoad);

const signOut = document.querySelector(".sign-out");

function runOnLoad() {
  const username = document.querySelector(".userfullname");

  const userData = JSON.parse(localStorage.getItem("data"));

  username.innerHTML = userData.fullName;
}

signOut.addEventListener("click", () => {
  localStorage.clear();
  document.location.href = "/hospital-care-provider/my-profile.html";
});
