//! Global Variables
const serchInput = document.getElementById("inputSerch");
const day1 = document.getElementsByClassName("card")[0];
const day2 = document.getElementsByClassName("card")[1];
const day3 = document.getElementsByClassName("card")[2];

async function getLocation() {
  try {
    await navigator.geolocation.getCurrentPosition(
      async (response) => {
        const lat = response.coords.latitude;
        const lng = response.coords.longitude;
        const data = await fetch(
          `https://us1.locationiq.com/v1/reverse.php?key=pk.1b8798a6da62ec19f141fd591e4a48c2&lat=${lat}&lon=${lng}&format=json`
        );
        if (!data) throw new Error("Something went wrong fetching the city.");
        const jsonData = await data.json();
        if (!jsonData.address) console.error(jsonData.error);
        getDataFromApi(jsonData.address.city);
      },
      (response) => {
        console.error(response);
      }
    );
  } catch (error) {
    console.error(error.message ?? "Something went wrong");
  }
}

getLocation();

serchInput.addEventListener("input", (e) => {
  getDataFromApi(e.target.value);
});


serchInput.addEventListener("input", function (e) {
  getDataFromApi(e.target.value);
});
async function getDataFromApi(value) {
  const response = await fetch(
    `https://api.weatherapi.com/v1/forecast.json?key=bfd3f9d3308b4b178fa45610231608&q=${value}&days=3&aqi=no&alerts=no`
  );
  if (response.ok) {
    const data = await response.json();
    getDay1(data.location, data.current);
    getDay2(data.forecast.forecastday[1]);
    getDay3(data.forecast.forecastday[2]);
  } 
}

function getDay1(location, current) {
  const date = new Date(location.localtime);
  day1.innerHTML = `<div class="card-header bg-darkGray d-flex justify-content-between align-items-center">
  <p class="m-0 text-white"> ${date.toLocaleDateString("en-us", {
    weekday: "long",
  })}</p>
  <p class="m-0 text-white">${date
    .toString()
    .slice(8, 10)} ${date.toLocaleDateString("en-us", {
    month: "long",
  })}</p>
</div>
<div class="card-body d-flex flex-column justify-content-center align-items-center ">
  <div> <h3>${location.name} </h3> </div>
  <div class=""> <h2>${current.temp_c}<sup>o</sup>C</h2> <img src=${
    current.condition.icon
  }> </div>
  <p class="text-blue m-0">${current.condition.text}</p>
</div>
<div class="card-footer  d-flex gap-2 justify-content-center align-items-center">
  <i class="fa-solid fa-umbrella"></i> ${current.precip_mm}%
  <i class="fa-solid fa-wind"></i> ${current.wind_kph} km/h
  <i class="fa-regular fa-compass"></i>  ${current.wind_dir}
</div>`;
}

function getDay2(dayTwoDate) {
  const date = new Date(dayTwoDate.date);
  day2.innerHTML = `<div class="card-header bg-mainBlack d-flex justify-content-center align-items-center">
<p class="m-0 text-white">${date.toLocaleDateString("en-us", {
    weekday: "long",
  })}</p>
</div>
<div class="card-body d-flex flex-column align-items-center justify-content-center ">
<div><img src=${dayTwoDate.day.condition.icon}></div>
<div class="d-flex flex-column "><span>${
    dayTwoDate.day.maxtemp_c
  }<sup>o</sup>C</span>
<span>${dayTwoDate.day.mintemp_c}<sup>o</sup>C</span></div>
<p class="text-blue m-0">${dayTwoDate.day.condition.text}</p>
</div>
`;
}

function getDay3(dayThreeDate) {
  const date = new Date(dayThreeDate.date);
  day3.innerHTML = `<div class="card-header bg-darkGray d-flex justify-content-center align-items-center">
<p class="m-0 text-white">${date.toLocaleDateString("en-us", {
    weekday: "long",
  })}</p>
</div>
<div class="card-body d-flex flex-column align-items-center justify-content-center">
<div><img src=${dayThreeDate.day.condition.icon}></div>
<span>${dayThreeDate.day.maxtemp_c}<sup>o</sup>C</span>
<span>${dayThreeDate.day.mintemp_c}<sup>o</sup>C</span>
<p class="text-blue">${dayThreeDate.day.condition.text}</p>
</div>
`;
}
