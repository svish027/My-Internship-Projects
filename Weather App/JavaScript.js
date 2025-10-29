const darklight = document.querySelector("#darkLight");
darklight.addEventListener("click", changeTheme);

const userTheme = localStorage.getItem("theme");
if (userTheme === "dark") {
  darklight.click();
}

function changeTheme() {
  document.querySelector("body").classList.toggle("dark");
  if (document.querySelector("body").classList.contains("dark")) {
    localStorage.setItem("theme", "dark");
  } else {
    localStorage.setItem("theme", "light");
  }
}

async function fetchData(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Network response was not ok");
    return await response.json();
  } catch (error) {
    alert("There was a problem fetching data: " + error.message);
  }
}

const apiKey = "bbec3f8e75c18ad1802638789bdef0d0";

const apiWeather = "https://api.openweathermap.org/data/2.5/weather";

let units = "imperial";

const locationHeading = document.querySelector("#location");

const allTemps = document.querySelectorAll("#temp-now, .temps");
const fahrenheit = document.querySelectorAll(".fahrenheit");
const celsius = document.querySelector(".celsius");
const windUnit = document.querySelector("#wind-unit");
const currentTemp = document.querySelector("#temp-now");
const highTemp = document.querySelector("#high-temp");
const lowTemp = document.querySelector("#low-temp");
const feelsLikeTemp = document.querySelector("#feels-like");
const tempDescription = document.querySelector("#description-temp");
const weatherTypeDesc = document.querySelector("#weather-type-desc");
const todaysDate = document.querySelector("#today");

const visibility = document.querySelector("#visibility");
const wind = document.querySelector("#wind");
const humidity = document.querySelector("#humidity");
const clouds = document.querySelector("#clouds");

const sunrise = document.querySelector("#sunrise-time");
const sunset = document.querySelector("#sunset-time");
const scenery = document.querySelector("#scenery");

const userLocation = localStorage.getItem("location");
if (userLocation) {
  updateWeatherByName(userLocation);
} else {
  updateWeatherByName("CHICAGO");  //Default
}

function updateWeatherByName(Location) {
  fetchData(`${apiWeather}?q=${Location}&appid=${apiKey}&units=${units}`)
    .then((data) => {
      displayCurrentTemperature(data);
      getFiveDayForecast(Location);
    })
    .catch(() => {
      alert(
        "There was a problem with your request! Try again or check back later."
      );
    });
}

function searchCity(event) {
  event.preventDefault();
  const searchInput = document.querySelector("#search-input").value;
  if (searchInput) {
    updateWeatherByName(searchInput);
  }
}

const searchBtn = document.querySelector(".search-bar");
searchBtn.addEventListener("submit", searchCity);

function toggleTemp(event) {
  event.preventDefault();
  if (celsius.innerHTML === "C") {
    celsius.innerHTML = "F";
    fahrenheit.forEach((el) => (el.innerHTML = "C"));
    allTemps.forEach(
      (el) => (el.textContent = Math.round((el.innerHTML - 32) * (5 / 9)))
    );
    windUnit.innerHTML = `km/h`;
    units = "metric";
  } else if (celsius.innerHTML === "F") {
    celsius.innerHTML = "C";
    fahrenheit.forEach((el) => (el.innerHTML = "F"));
    allTemps.forEach(
      (el) => (el.textContent = Math.round(el.innerHTML * (9 / 5) + 32))
    );
    windUnit.innerHTML = `mph`;
    units = "imperial";
  }

  updateWeatherByName(locationHeading.textContent);
}

celsius.addEventListener("click", toggleTemp);

function displayCurrentTemperature(data) {
  if (!data) return;
  const apiSunrise = data.sys.sunrise * 1000;
  const apiSunset = data.sys.sunset * 1000;

  const options = {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  };

  sunrise.innerHTML = localDate(apiSunrise).toLocaleString([], options);
  sunset.innerHTML = localDate(apiSunset).toLocaleString([], options);

  function localDate(unix) {
    const date = new Date();
    const offset = date.getTimezoneOffset() * 60000;
    const utc = unix + offset;
    return new Date(utc + 1000 * data.timezone);
  }

  const today = new Date();
  const localToday = today.getTime();
  const dateStatement = `${localDate(localToday).toLocaleDateString([], {
    weekday: "long",
    month: "long",
    day: "numeric",
  })} at ${localDate(localToday).toLocaleString([], options)}`;
  todaysDate.innerHTML = dateStatement;

  const sunriseHour = localDate(apiSunrise).getHours();
  const sunsetHour = localDate(apiSunset).getHours();

  scenery.src =
    localDate(localToday).getHours() < sunriseHour ||
    localDate(localToday).getHours() >= sunsetHour
      ? "https://www.shutterstock.com/image-photo/sunrise-over-south-pacific-260nw-280593590.jpg"
      : "https://oshiprint.in/image/cache/catalog/poster/new/mqp1193-1100x733.jpeg.webp";

  locationHeading.innerHTML = `${data.name}, ${data.sys.country}`;
  currentTemp.innerHTML = `${Math.round(data.main.temp)}`;
  highTemp.innerHTML = `${Math.round(data.main.temp_max)}`;
  lowTemp.innerHTML = `${Math.round(data.main.temp_min)}`;
  feelsLikeTemp.innerHTML = `${Math.round(data.main.feels_like)}`;
  tempDescription.innerHTML = `${data.weather[0].description}`;
  visibility.innerHTML = `${Math.round(data.visibility / 1000)}`;
  wind.innerHTML = `${Math.round(data.wind.speed)}`;
  humidity.innerHTML = `${Math.round(data.main.humidity)}`;
  clouds.innerHTML = `${Math.round(data.clouds.all)}`;

  updateIcon(data);

  const weatherType = data.weather[0].main;
  if (["Rain", "Drizzle", "Clouds"].includes(weatherType)) {
    weatherTypeDesc.innerHTML = `<i class="fa-solid fa-umbrella"></i>
        Raincoats/Umbrella needed`;
  } else if (["Thunderstorm", "Tornado"].includes(weatherType)) {
    weatherTypeDesc.innerHTML = `<i class="fa-solid fa-cloud-bolt"></i> 
        Stay @ home`;
  } else if (weatherType === "Snow") {
    weatherTypeDesc.innerHTML = `<i class="fa-solid fa-snowflake"></i>
      Wear Warm clothes`;
  } else if (weatherType === "Clear") {
    weatherTypeDesc.innerHTML = `<i class="fa-solid fa-cloud-sun"></i>
      Good Weather`;
  } else if (["Mist", "Fog", "Haze"].includes(weatherType)) {
    weatherTypeDesc.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i>
        Poor Visibility`;
  } else {
    weatherTypeDesc.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i>
        Poor Air Quality`;
  }

  localStorage.setItem("location", `${data.name}`);
}

function updateIcon(data) {
  if (!data || !data.weather || !data.weather[0]) return;

  const weatherIconCode = data.weather[0].icon;

  const mainWeatherIcon = document.querySelector(".default-main-icon");

  const iconUrl = `https://openweathermap.org/img/wn/${weatherIconCode}@2x.png`;

  mainWeatherIcon.setAttribute("src", iconUrl);
  mainWeatherIcon.setAttribute("alt", data.weather[0].description);
}

function getFiveDayForecast(Location) {
  const forecastApi = `https://api.openweathermap.org/data/2.5/forecast?q=$
    {Location}&appid=${apiKey}&units=${units}`;

  fetchData(forecastApi)
    .then((data) => displayFiveDayForecast(data))
    .catch(() => {
      alert("Unable to fetch 5-day forecast.");
    });
}

function displayFiveDayForecast(data) {
  const forecastGrid = document.querySelector(".forecast-grid");
  forecastGrid.innerHTML = "";

  const dailyForecasts = {};

  data.list.forEach((item) => {
    const date = new Date(item.dt_txt).toLocaleDateString("en-US", {
      weekday: "long",
    });

    if (!dailyForecasts[date]) {
      dailyForecasts[date] = item;
    }
  });

  Object.values(dailyForecasts).forEach((forecast) => {
    const day = new Date(forecast.dt_txt).toLocaleDateString("en-US", {
      weekday: "long",
    });

    const temp = Math.round(forecast.main.temp);
    const description = forecast.weather[0].description;
    const iconUrl = `https://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png`;

    const forecastCard = document.createElement("div");
    forecastCard.classList.add("forecast-card");

    forecastCard.innerHTML = `
       <div class="forecast-day">${day}</div>
       <img src="${iconUrl}" alt="${description}">
       <br>
       <span class="forecast-temp temps">${temp}</span> &deg;
       <div class="forecast-desc">${description}>/div>`;

    forecastGrid.appendChild(forecastCard);
  });
}

const cityTemps = document.querySelectorAll(".global-temps");
const cityWeatherDesc = document.querySelectorAll(".global-description");
const cityNames = document.querySelectorAll(".global-name");
const countryNames = document.querySelectorAll(".country-name");

const cities = ["Kitchener"];

const favCitiesContainer = document.querySelector(".global-overview .d-flex");
const addToFavBtn = document.getElementById("add-to-fav-btn");
const searchInput = document.getElementById("search-input");

function displayGlobalTemperature(city, index) {
  fetchData(`${apiWeather}?q=${city}&appid=${apiKey}&units${units}`)
    .then((data) => {
      if (!data) return;

      const cityCard = document.createElement("div");
      cityCard.className = "container global-item align-items-center mb-2";

      cityCard.innerHTML = `
            <div class="row align-items-center flex-nowrap justify-content-center p-3">
               <p class="col" style="margin-left:0 !important; padding-left: 0 !important">
                 <span class="global-name">${data.name}</span>,
                 <span class="country-name">${data.sys.country}</span>
               </p>

               <img src="https://openweathermap.org/img/wn/${
                 data.weather[0].icon
               }@2x.png"
               height= "50px" class="col-3 weather-icon global-icon" alt=${
                 data.weather[0].description
               }>

               <p class="text-end col">
                 <strong><span class="temps global-temps">${Math.round(
                   data.main.temp
                 )}
                 </span>&deg; <span class="fahrenheit">F</span></strong> <br>
               
                <small class="global-description">${
                  data.weather[0].description
                }</small>   
              </p>
              <button class="btn btn-outline-danger remove-btn col-auto"><i
              class="fa-solid fa-remove"></i> </button>
            </div>
        `;

      favCitiesContainer.appendChild(cityCard);

      cityCard.addEventListener("click", () => {
        updateWeatherByName(city);
      });

      const removeBtn = cityCard.querySelector(".remove-btn");
      removeBtn.addEventListener("click", () => {
        removeCity(city, cityCard);
      });
    })
    .catch(() => {
      alert(`Unable to fetch weather data for ${city}.`);
    });
}

function addCityToFavourites() {
  const city = searchInput.value.trim();
  if (!city || cities.includes(city)) {
    alert("City is invalid or already in the favorites list");
    return;
  }

  cities.push(city);
  displayGlobalTemperature(city, cities.length - 1);
  searchInput.value = "";
}

function removeCity(city, cityCard) {
  const index = cities.indexOf(city);
  if (index !== -1) {
    cities.splice(index, 1);
    cityCard.remove();
  }
}

addToFavBtn.addEventListener("click", addCityToFavourites);

cities.forEach((city, index) => {
  displayGlobalTemperature(city, index);
});
