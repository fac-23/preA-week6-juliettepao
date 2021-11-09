/* TO DO:

* Decide what to do with the articles, andif we want them to load when the page loads
* giphy : Can we retrieve the alt attribute? I want to always retrieve a random image, not always the same
* Figure out if RoadGoat can be used with fetch

/*-------------------------------------------*\
  VARIABLES
\*-------------------------------------------*/

/* User Input section */
const userInputForm = document.querySelector(".user-input__form");
const userInputDisplay = document.querySelector(".user-input__display");
const searchBtn = document.querySelector(".user-input__btn");
const cityNameDisplay = document.querySelector(".city-name-display");
const cityInfoDisplay = document.querySelector(".user-input__city-info");

/* Giphy API */
const gifSection = document.querySelector(".gif");
const giphyKey = "RXsaSeN2Q8Sm1V12ZBhek7ZesgLCWrFY";

/* goweather API */
const weatherSection = document.querySelector(".weather");
const currentTemperature = document.querySelector(".weather__current-temp");
const weatherDescription = document.querySelector(".weather__current-temp");

/* news */
const articleBody = document.querySelector('.article__body');
const currentNews = document.querySelector(".news");
const newsKey = "070c988ee1c2436c95535e3a38969fc5";





/*----------------------------------------------------*\
  APP FUNCTIONS
\*----------------------------------------------------*/

/* Function to render the user city selection on the page */
const displayCityName = inputCity => {
  // Create a paragraph to display the city name
  inputCityName = `<P>${inputCity}</P>`.toUpperCase();
  // Display the city name
  userInputDisplay.innerHTML = inputCityName; 
}


/* Function to display temperature and weather description from goweather API */
const displayWeather = data => {
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


/* Function to display gif from Giphy API */
const displayGif = data => {
  // Create html to update DOM
  const html = `<img src="${data.data[0].images.downsized.url}" alt="" class='gif__img'>`;
  // update DOM
  gifSection.firstElementChild.innerHTML = html;
}


/* Function to display articles from the world from newsapi */
const displayArticle = data => {
  const html = `<P>${data.articles[0].content}</P>`;
  // update DOM
  articleBody.innerHTML = html;
}


// Function to update ALL data on the page relative to the city
function updateCityData() {
  // Retrieve value entered by user in input field
  const inputCity = document.querySelector("#user-input__input--city").value;
  // Call displayCityName() to display the city name
  displayCityName(inputCity);

  
/* News */
  fetch(`https://newsapi.org/v2/everything?q=tesla&from=2021-11-09&sortBy=popularity&apiKey=${newsKey}`)
    .then(response => response.json())
    // .then(data => console.log(data.articles[0].content))
    .then(data => displayArticle(data));


  /* API requests */
  fetch(`https://goweather.herokuapp.com/weather/${inputCity}`) // Fetch weather data from goweather
    .then(response => response.json())
    .then(data => {
      displayWeather(data); // Display the temperature and the weather description
      return fetch(`https://api.giphy.com/v1/gifs/search?q=${data.description}&api_key=${giphyKey}`) // Query the giphy API for a gif using the weather description
    })
    .then(response => response.json()) // Parse the data received from giphy to Json
    // .then(data => console.log(data.data[0].images.downsized.url))
    .then(data => displayGif(data)) // Display the image
    .catch(error => console.log(error));
}






/*----------------------------------------------------*\
  EVENT LISTENERS
\*----------------------------------------------------*/

// When user clicks button, update all data and render it on the page.
searchBtn.addEventListener("click", updateCityData);
