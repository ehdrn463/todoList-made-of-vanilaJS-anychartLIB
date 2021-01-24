const COORDS = "coords";
const API_KEY = "799332eb009439cba690945ca3b26276";

const weatherEl = document.querySelector(".weather");
const placeEl = document.querySelector(".place");

const getWeather = function (lat, lng) {
  fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${API_KEY}`
  )
    .then((res) => {
      return res.json();
    })
    .then((json) => {
      const weather = json.weather[0].main;
      const place = json.name;
      placeEl.textContent = `In ${place}` + ",";
      weatherEl.innerText = "\xa0" + `${weather}`;
    });
};

const handleGeoSuccess = function (position) {
  const { latitude, longitude } = position.coords;
  const coordsObj = {
    latitude,
    longitude,
  };
  saveCoords(coordsObj);
};

const handleGeoError = function () {
  console.log("Can't access geo location");
};

const askForCoords = function () {
  navigator.geolocation.getCurrentPosition(handleGeoSuccess, handleGeoError);
};

const saveCoords = function (coordsObj) {
  localStorage.setItem(COORDS, JSON.stringify(coordsObj));
};

const loadCoords = function () {
  const loadedCoords = localStorage.getItem(COORDS);

  if (loadedCoords === null) {
    askForCoords();
  } else {
    let { latitude, longitude } = JSON.parse(loadedCoords);
    getWeather(latitude, longitude);
  }
};

const init = function () {
  loadCoords();
};

init();
