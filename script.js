const infosMeteo = document.querySelector(".infosMeteo");
let changerVilleInput = document.querySelector("input");
changerVilleInput.addEventListener("change", getVille);

function degConvert(degres) {
  const directions = ["N", "N-E", "E", "S-E", "S", "S-O", "O", "N-O"];
  const index = Math.round((degres % 360) / 45);
  return directions[index % 8];
}

navigator.geolocation.getCurrentPosition(success, error);

function success(e) {
  const geolocationLatitude = e.coords.latitude;
  const geolocationLongitude = e.coords.longitude;
  fetch(
    `https://api-adresse.data.gouv.fr/reverse/?lon=${geolocationLongitude}&lat=${geolocationLatitude}`
  )
    .then((reponse4) => reponse4.json())
    .then((data4) => {
      fetch(
        `https://api.open-meteo.com/v1/meteofrance?latitude=${geolocationLatitude}&longitude=${geolocationLongitude}&current=temperature_2m,rain,precipitation,weather_code,wind_speed_10m,wind_direction_10m&daily=temperature_2m_min,temperature_2m_max`
      )
        .then((reponse3) => reponse3.json())
        .then((data3) => {
          console.log(data3);
          const degresVent = data3.current.wind_direction_10m;
          const directionVent = degConvert(degresVent);

          console.log(data3.current.weather_code);
          infosMeteo.innerHTML = `
            <h2>${data4.features[0].properties.city}</h2>
            <h3 class="temperature">${data3.current.temperature_2m}${
            data3.current_units.temperature_2m
          }  <span>${Math.min(...data3.daily.temperature_2m_min)}${
            data3.current_units.temperature_2m
          } / ${Math.max(...data3.daily.temperature_2m_max)}${
            data3.current_units.temperature_2m
          }</span> </h3>
            <div class="picto"></div>
            <p class="vent">💨 ${data3.current.wind_speed_10m} ${
            data3.current_units.wind_speed_10m
          } 🧭 ${directionVent}</p>
            <p class="precipitations">💧 ${data3.current.precipitation} ${
            data3.current_units.precipitation
          }</p>
            `;

          const picto = document.querySelector(".picto");
          switch (data3.current.weather_code) {
            case 0:
              picto.innerHTML = `<img src="./img/sun.png" alt="" />`;
              break;
            case 1:
            case 2:
              picto.innerHTML = `<img src="./img/cloud-sun.png" alt="" />`;
              break;
            case 3:
              picto.innerHTML = `<img src="./img/clouds.png" alt="" />`;
              break;
            case 45:
            case 48:
              picto.innerHTML = `<img src="./img/fog.png" alt="" />`;
              break;
            case 51:
            case 53:
            case 55:
            case 56:
            case 57:
            case 61:
            case 63:
            case 65:
            case 66:
            case 67:
            case 80:
            case 81:
            case 82:
              picto.innerHTML = `<img src="./img/rain.png" alt="" />`;
              break;
            case 71:
            case 73:
            case 75:
            case 77:
            case 85:
            case 86:
              picto.innerHTML = `<img src="./img/snow.png" alt="" />`;
              break;
            case 95:
            case 96:
            case 99:
              picto.innerHTML = `<img src="./img/thunder.png" alt="" />`;
              break;
          }
        });
    });
}
function error(e) {
  const modal = document.querySelector(".errorVille");
  const container = document.querySelector(".container");
  modal.classList.add("active");
  container.classList.add("filterBlur");
  setTimeout(() => {
    modal.classList.remove("active");
    container.classList.remove("filterBlur");
  }, 2000);
}

function getVille(e) {
  e.preventDefault();
  if (e.target.value != "") {
    const ville = e.target.value;
    fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${ville}`)
      .then((reponse) => reponse.json())
      .then((data) => {
        if (!data.results) {
          error();
        } else {
          latitude = data.results[0].latitude;
          longitude = data.results[0].longitude;

          fetch(
            `https://api.open-meteo.com/v1/meteofrance?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,rain,precipitation,weather_code,wind_speed_10m,wind_direction_10m&daily=temperature_2m_min,temperature_2m_max`
          )
            .then((reponse2) => reponse2.json())
            .then((data2) => {
              const degresVent = data2.current.wind_direction_10m;
              const directionVent = degConvert(degresVent);
    
              console.log(data2.current.wind_direction_10m);
              const tMax = Math.max(...data2.daily.temperature_2m_max);
              infosMeteo.innerHTML = `
                  <h2>${data.results[0].name}, <span>${
                data.results[0].country
              }</span></h2>
                  <h3 class="temperature">${data2.current.temperature_2m}${
                data2.current_units.temperature_2m
              }  <span>${Math.min(...data2.daily.temperature_2m_min)}${
                data2.current_units.temperature_2m
              } / ${Math.max(...data2.daily.temperature_2m_max)}${
                data2.current_units.temperature_2m
              }</span> </h3>
              <div class="picto"></div>
  
                  <p class="vent">💨 ${data2.current.wind_speed_10m} ${
                data2.current_units.wind_speed_10m
              } 🧭 ${directionVent}</p>
                  <p class="precipitations">💧 ${data2.current.precipitation} ${
                data2.current_units.precipitation
              }</p>
                  `;
              const picto = document.querySelector(".picto");
              switch (data2.current.weather_code) {
                case 0:
                  picto.innerHTML = `<img src="./img/sun.png" alt="" />`;
                  break;
                case 1:
                case 2:
                  picto.innerHTML = `<img src="./img/cloud-sun.png" alt="" />`;
                  break;
                case 3:
                  picto.innerHTML = `<img src="./img/clouds.png" alt="" />`;
                  break;
                case 45:
                case 48:
                  picto.innerHTML = `<img src="./img/fog.png" alt="" />`;
                  break;
                case 51:
                case 53:
                case 55:
                case 56:
                case 57:
                case 61:
                case 63:
                case 65:
                case 66:
                case 67:
                case 80:
                case 81:
                case 82:
                  picto.innerHTML = `<img src="./img/rain.png" alt="" />`;
                  break;
                case 71:
                case 73:
                case 75:
                case 77:
                case 85:
                case 86:
                  picto.innerHTML = `<img src="./img/snow.png" alt="" />`;
                  break;
                case 95:
                case 96:
                case 99:
                  picto.innerHTML = `<img src="./img/thunder.png" alt="" />`;
                  break;
              }
            });
        }
      });
  }
  changerVilleInput.value = "";
}
