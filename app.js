/* TO DO:

* Decide what to do with the articles, and if we want them to load when the page loads
* giphy & unsplash : I want to always retrieve a random image, not always the same
* Figure out if RoadGoat can be used with fetch

/*-------------------------------------------*\
  VARIABLES
\*-------------------------------------------*/

/* User Input section */
const userInputForm = document.querySelector("form");
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
const weatherDescriptionDiv = document.querySelector(".weather__description");
const weatherImageDiv = document.querySelector(".weather__gif");
// const currentTemperature = document.querySelector(".weather__current-temp");
const weatherDescription = document.querySelector(".weather__description");

/* news */
const articleBody = document.querySelector('.article__body');
const currentNews = document.querySelector(".news");
const newsKey = "ffb6c45e-9bcc-4828-b865-e4f13ac02107";





/*----------------------------------------------------*\
  APP FUNCTIONS TO DISPLAY FETCHED CONTENT
\*----------------------------------------------------*/

/* Function to generate random number for different APIs */
const randomNumber = (number) => Math.floor(Math.random() * (number - 1));

const displayGiphyError = () => {
  return fetch (`https://api.giphy.com/v1/gifs/search?q=error&api_key=${giphyKey}`)
    .then(response => response.json())
    .then(data => {
      const html = `<img src="${data.data[randomNumber(data.data.length)].images.downsized.url}" alt="${data.data[randomNumber(data.data.length)].title}" class="weather__img">`;
      weatherImageDiv.innerHTML = html;
    })
  }


/* Function to render the user city selection on the page */
const displayCityName = data => {
  // Create a paragraph to display the city name
  html = `<P>${data}</P>`.toUpperCase();
  // Display the city name
  userInputDisplay.innerHTML = html; 
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
  weatherDescriptionDiv.innerHTML = html;
}


/* Function to display gif from Giphy API */
const displayGif = data => {
  // Create html to update DOM
  const html = `<img src="${data.data[randomNumber(data.data.length)].images.downsized.url}" alt="${data.data[randomNumber(data.data.length)].title}" class="weather__img">`;

  // update DOM
  weatherImageDiv.innerHTML = html;
}


/* Function to display a picture of the city from Unsplash */
const displayCityPic = data => {
  // Create html to update DOM
  const html = `<img src="${data.results[0].urls.small}" alt="${data.results[0].alt_description}" class="city-pic__img">`;

  // update DOM
  cityPicSection.firstElementChild.innerHTML = html;
}


/* Function to display random articles from the city from newsapi */
const displayArticle = data => {
  // Create html to update DOM

  const html = `
  <h2>News</h2>
  <P>${data.response.results[randomNumber(data.response.results.length)].webTitle}</P>
  <a href="${data.response.results[randomNumber(data.response.results.length)].webUrl}" target="_blank">Read the full article</a>
  `;
  // update DOM
  articleBody.innerHTML = html;
}

//  fetch(`https://api.giphy.com/v1/gifs/search?q=sunny&api_key=${giphyKey}`)
//   .then(response => response.json())
//   .then(data => console.log(data.data[randomNumber(data.data.length)].images.downsized.url))




// Function to update ALL data on the page relative to the city, once the user clicks the button.
function updateCityData(cityName) {
  // Call displayCityName() to display the city name.
  displayCityName(cityName);

  // Use promiseAll to simultaneously retrieve both unsplash API and news API data.
  const unsplashPromise = fetch(`https://api.unsplash.com/search/photos/?client_id=${unsplashKey}&query?page=1&query=${cityName}`);

  // const newsApiPromise =  fetch(`https://content.guardianapis.com/search?q=${cityName}&api-key=${newsKey}`);
  const newsApiPromise =  fetch(`https://content.guardianapis.com/search?q=London%20AND%20travel&api-key=${newsKey}`);


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
  fetch(`https://goweather.herokuapp.com/weather/${cityName}`) // Fetch weather data from Goweather.
    .then(response =>  {
      if(!response.ok) {
        const error = new Error(response.status);
        throw error;
      }
      return response.json()})
    .then(weather => {
      displayWeather(weather); // Display the temperature and the weather description
      return fetch(`https://api.giphy.com/v1/gifs/search?q=${weather.description}&api_key=${giphyKey}`) // return a promise to Query the giphy API for a gif using the weather description.
    })
    .then(response => response.json()) // Parse the data received from giphy to Json.
    .then(gifContent => displayGif(gifContent)) // Display the gif image.
    .catch(error => {
      console.log(error);
      if(error.message === '404') {
        weatherDescription.innerHTML = `<p>Couldn't retrieve weather for the requested city.</p>`;
        displayGiphyError();
      } else {
        weatherDescription.innerHTML = `<p>Something DEFINITELY went wrong HERE</p>`;
        displayGiphyError();
      }
    });
}


console.log(weatherDescription);



/*----------------------------------------------------*\
  EVENT LISTENERS
\*----------------------------------------------------*/


// When user presses enter on keyboard, get the submitted data from the form, call updateCityData() passing the city name as argument to update all data and render it on the page.
window.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    const formData = new FormData(userInputForm);
    // Retrieve value entered by user in input field.
    const cityName = formData.get("user-input__input--city");
    // Update data on page.
    updateCityData(cityName);
  }
});


// When user clicks button, get the submitted data from the form, call updateCityData() passing the city name as argument to update all data and render it on the page.
userInputForm.addEventListener('submit', e => {
  e.preventDefault(); // prevents the form from submitting automatically
  // FormData interface mirrors a form's native behaviour
  const formData = new FormData(userInputForm);
  // Retrieve value entered by user in input field.
  const cityName = formData.get("user-input__input--city");
  // Update data on page.
  updateCityData(cityName);
});