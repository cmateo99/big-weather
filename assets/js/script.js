let key = '22d9c31970b959cae1d2d30df42cf098';
let today = dayjs().format('MM/DD/YYYY');


let searchBtn = document.querySelector('#searchBtn');
let selectedCity = document.querySelector('#selectedCity');
let pastSearch = document.querySelector('#pastSearch');
let pastList = JSON.parse(localStorage.getItem('pastList')) || [];
let clearHistory = document.querySelector('#clearHistory');
clearHistory.addEventListener('click', function(){
    console.log('Clear History');
    pastList = [];
    localStorage.removeItem('pastList');
})
onLoad();
clearHistory.addEventListener('click', function(){
    console.log('Clear History');
    pastList = [];
    localStorage.removeItem(pastList);
    onLoad();
})
function onLoad(){
    for (let i = 0; i < pastList.length; i++) {
    let pastBtn = document.createElement('button');
    pastBtn.classList.add('button', 'is-info', 'is-fullwidth');
    pastBtn.textContent = pastList[i];
    pastBtn.addEventListener('click', function() {
      getWeather(pastList[i]);
      getForecast(pastList[i]);
    });
    pastSearch.appendChild(pastBtn);
      }
    }
searchBtn.addEventListener('click', function() {
  const input = document.querySelector('.input').value;
  selectedCity.textContent = input;
  getWeather(input);

});
function getWeather(input) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${input}&appid=${key}&units=imperial`)
    .then(response => {
        return response.json();
    })
    .then(data => {
        let { name, main, wind,coord } = data;
        let city = document.querySelector('#selectedCity');
        let temp = document.querySelector('#tempF');
        
        let humidity = document.querySelector('#humidity');
        let windCond = document.querySelector('#wind');
        let lat = coord.lat.toString();
        let lon = coord.lon.toString();
        city.textContent = name;
        temp.textContent = `Temperature:${main.temp.toFixed(1)} °F`;
        
        humidity.textContent = `Humidity:${main.humidity}%`;
        windCond.textContent = `Wind:${wind.speed.toFixed(1)} mph`;
        getForecast(lat,lon);
        console.log(data)
        
        if (!checkHistory(name)) {
            createBtn(name)
        }
    })
    .catch(error => {
        console.error(error);
    });
    console.log(input);
}
function createBtn(name) {
    let pastBtn = document.createElement('button');
    pastBtn.classList.add('button', 'is-info', 'is-fullwidth');
    pastBtn.textContent = name;
    pastBtn.addEventListener('click', function() {
      getWeather(name);
      getForecast(name);
    });
    pastSearch.appendChild(pastBtn);
    pastList.push(name);
    localStorage.setItem('pastList', JSON.stringify(pastList));
  }
  
function getForecast(lat,lon) {
    console.log(lat,lon);
    let newLat= lat;
    let newLon= lon;
    fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${newLat}&lon=${newLon}&appid=${key}&units=imperial`)
    .then(response => {
        return response.json();
    })
    .then(data => {
    console.log(data)
    let forecastBox = document.querySelector('#forecastBox');
        forecastBox.innerHTML = '';
        for (let i = 0; i <= 32 ;i+=8) {
            let forecast = data.list[i];
            let date = dayjs.unix(data.list[i].dt).format('MM/DD/YYYY');
            let temp = forecast.main.temp + 'F'
            let wind = forecast.wind.speed.toFixed(1) +' mph';
            let humidity = forecast.main.humidity + '%';
            let box = document.createElement('div');
            box.classList.add('column');
            let content = `
            <div class="box has-background-info">
                <p class="is-size-4 has-text-white">${date}</p>
                <p class="is-size-4 has-text-white">Temperature: ${temp}</p>
                <p class="is-size-4 has-text-white">Wind: ${wind}</p>
                <p class="is-size-4 has-text-white">Humidity: ${humidity}</p>
            </div>`;
            box.innerHTML = content;
            forecastBox.appendChild(box);
      }
    })
}
function checkHistory(name){
    return pastList.includes(name);
}