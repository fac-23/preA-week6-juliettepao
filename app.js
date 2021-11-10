/* TO DO:

* Decide what to do with the articles, and if we want them to load when the page loads
* giphy & unsplash : I want to always retrieve a random image, not always the same
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

/* Unsplash api */
const unsplashKey = 'ESaaep_nogLd-aU7_GUQL8Tn_aKGF-YxLkRMLfoDJdU';

/* Giphy API */
const cityPicSection = document.querySelector(".city-pic");
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
  APP FUNCTIONS TO DISPLAY FETCHED CONTENT
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
  const weatherGif = document.createElement('img');
  weatherGif.classList.add('weather__img');
  weatherGif.alt = `${data.data[0].title}`
  weatherGif.src = `${data.data[0].images.downsized.url}`;
  // update DOM
  weatherSection.firstElementChild.append(weatherGif);
}


/* Function to display a picture of the city from Unsplash */
const displayCityPic = data => {
  // Create html to update DOM
  const cityPic = `<img src="${data.results[0].urls.small}" alt="${data.results[0].alt_description}" class="city-pic__img">`;

  // update DOM
  cityPicSection.firstElementChild.innerHTML = cityPic;
}


/* Function to display articles from the world from newsapi */
const displayArticle = data => {
  // Create html to update DOM
  const html = `
  <h2>News</h2>
  <P>${data.articles[0].content}</P>`;
  // update DOM
  articleBody.innerHTML = html;
}


// Function to update ALL data on the page relative to the city, once the user clicks the button.
function updateCityData() {
  // Retrieve value entered by user in input field.
  const inputCity = document.querySelector("#user-input__input--city").value;
  // Call displayCityName() to display the city name.
  displayCityName(inputCity);

  // Use promiseAll to simultaneously retrieve both unsplash API and news API data.
  const unsplashPromise = fetch(`https://api.unsplash.com/search/photos/?client_id=${unsplashKey}&query?page=1&query=${inputCity}`);

  const newsApiPromise =  fetch(`https://newsapi.org/v2/everything?q=${inputCity}&from=2021-11-09&sortBy=popularity&apiKey=${newsKey}`);


  Promise.all([unsplashPromise, newsApiPromise])
    .then(apisResponsesArray => {
      // Return another promise as an array with the parsed content of the previous response.
      return Promise.all(apisResponsesArray.map(apiResponse => apiResponse.json()));
    })
    .then(parsedReponsesArray => {
      // Destructure the parsed reponses array into separate variables.
      const [unsplashResponse, newsApiResponse] = parsedReponsesArray; 

      // Call functions to display content of the separate responses of the APIs.
      displayCityPic(unsplashResponse);
      displayArticle(newsApiResponse)
    })
    .catch(error => console.log(error));


  /* Chain Goweather API and Giphy API requests */
  fetch(`https://goweather.herokuapp.com/weather/${inputCity}`) // Fetch weather data from Goweather.
    .then(response => response.json())
    .then(weather => {
      displayWeather(weather); // Display the temperature and the weather description
      return fetch(`https://api.giphy.com/v1/gifs/search?q=${weather.description}&api_key=${giphyKey}`) // return a promise to Query the giphy API for a gif using the weather description.
    })
    .then(response => response.json()) // Parse the data received from giphy to Json.
    .then(gifContent => displayGif(gifContent)) // Display the gif image.
    .catch(error => console.log(error));
}






/*----------------------------------------------------*\
  EVENT LISTENERS
\*----------------------------------------------------*/

// When user clicks button, update all data and render it on the page.
searchBtn.addEventListener("click", updateCityData);
