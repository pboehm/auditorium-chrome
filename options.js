// Saves options to localStorage.
function save_options() {
  var token = document.getElementById("token").value;
  localStorage["token"] = token;

  // Update status to let user know options were saved.
  var status = document.getElementById("status");
  status.innerHTML = "Options Saved.";
  setTimeout(function() {
    status.innerHTML = "";
  }, 750);
}

function restore_options() {
  var token = localStorage["token"];
  if (!token) {
    return;
  }
  var tokenfield = document.getElementById("token");
  tokenfield.value = token;
}
document.addEventListener('DOMContentLoaded', restore_options);
document.querySelector('#save').addEventListener('click', save_options);
