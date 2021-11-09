/* TO DO:

* Write function to randomize gif pictures selection from the retrieved array.


*/

/*-------------------------------------------*\
  VARIABLES
\*-------------------------------------------*/

/* User Input section */
const userInputForm = document.querySelector(".user-input__form");
const userInputDisplay = document.querySelector(".user-input__display");
const searchBtn = document.querySelector(".user-input__btn");
const cityNameDisplay = document.querySelector(".city-name-display");

/* Giphy API */
const gifSection = document.querySelector(".gif");
const giphyKey = "RXsaSeN2Q8Sm1V12ZBhek7ZesgLCWrFY";

/* goweather API */
const weatherSection = document.querySelector(".weather");
const currentTemperature = document.querySelector(".weather__current-temp");
const weatherDescription = document.querySelector(".weather__current-temp");

/* news */
const currentNews = document.querySelector(".news");
const newsKey = "070c988ee1c2436c95535e3a38969fc5";
/*-------------------------------------------*\
  Giphy API - retrieves images
\*-------------------------------------------*/

// Can we retrieve the alt attribute?
// I want to always retrieve a random image, not always the same.

/* Function to display data */

const displayImage = data => {
  // Create html to update DOM
  const html = `

  <img src="${data.data[0].images.downsized.url}" alt="" class='gif__img'>

  `;

  // update DOM

  gifSection.firstElementChild.innerHTML = html;

}


// /* API request */

// fetch(`https://api.giphy.com/v1/gifs/search?q=${imgSearchKeyword}&api_key=${giphyKey}`)
//   .then(response => response.json())
// // .then(data => console.log(data.data[0].images.downsized.url))
//   .then(data => displayImage(data))

/*-------------------------------------------*\
  goweather API - retrieves weather forecast
\*-------------------------------------------*/

/* Function to display data */
function displayWeather(data) {
  // Create html to update DOM
  const html = `
  <div class="weather-section__description">
    <p>${data.description}</p>
  </div>

  <div class="weather-section__current-temp">
    <p>${data.temperature}</p>
  </div>

  `;

  // update DOM

  weatherSection.firstElementChild.innerHTML = html;

}

// /* API request */
// fetch('https://goweather.herokuapp.com/weather/spain')
//   .then(response => response.json())
//   .then(data => displayWeather(data));

/*----------------------------------------------------*\
  Road Goat - retrieves interesting info about cities
\*----------------------------------------------------*/

/*----------------------------------------------------*\
  APP FUNCTIONS
\*----------------------------------------------------*/

// Function to render the user city selection on the page
function displayCityName(inputCity) {

  // Create a paragraph to display the city name
  inputCityName = `<P>${inputCity}</P>`.toUpperCase();
  
  // Display the city name
  userInputDisplay.innerHTML = inputCityName; 

}

// Function to update ALL data on the page relative to the city
function updateCityData() {
  // Retrieve value entered by user in input field
  const inputCity = document.querySelector("#user-input__input--city").value;

  // Call displayCityName() to display the city name
  displayCityName(inputCity);

  /* Giphy */

  fetch(
    `https://api.giphy.com/v1/gifs/search?q=${inputCity}&api_key=${giphyKey}`
  )
    .then(response => response.json())
    // .then(data => console.log(data.data[0].images.downsized.url))
    .then(data => displayImage(data));

  /* Weather */

  /* API request */
  fetch(`https://goweather.herokuapp.com/weather/${inputCity}`)
    .then(response => response.json())
    .then(data => displayWeather(data));

  /* News */

  fetch(
    `https://newsapi.org/v2/everything?q=tesla&from=2021-11-09&sortBy=publishedAt&apiKey=${newsKey}`
  )
    .then(response => response.json())
    .then(data => console.log(data));
}

/*----------------------------------------------------*\
  EVENT LISTENERS
\*----------------------------------------------------*/

// WE NEE TO CHAIN ALL APIs requests and make them dynamic depending on the user input

// When user clicks button, update all data and render it on the page.
searchBtn.addEventListener("click", updateCityData);
