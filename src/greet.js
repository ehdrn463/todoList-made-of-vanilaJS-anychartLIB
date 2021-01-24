const userName = document.querySelector(".user-name");
const userNameForm = document.querySelector(".user-name-form");
const userNameInput = document.querySelector(".user-name-input");

const USER_NAME = "currentUser";
const DISPLAY_UN = "hiding";

const inputName = function (e) {
  e.preventDefault();
  const currUserName = userNameInput.value;
  localStorage.setItem(USER_NAME, currUserName);
  userNameInput.value = "";
  loadName();
};

const checkCurrUser = function () {
  let check = localStorage.getItem(USER_NAME);
  return check ? true : false;
};

const loadName = function () {
  const currUserName = localStorage.getItem(USER_NAME);

  if (currUserName) {
    userNameForm.classList.add(DISPLAY_UN);
    userName.innerHTML = currUserName + "의 오늘의 공부";
  } else {
    userNameForm.classList.remove(DISPLAY_UN);
  }
};

loadName();
userNameForm.addEventListener("submit", inputName);
