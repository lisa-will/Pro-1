$(document).ready(function(){

function displayLocationInfo(){
//Variables
    var APIKey = "d2f980af471c135357b7e99b64254c2e";
    var city = $("#location-input").val();

    var lat = -40.5383;
    var lon = 40.3792;
    console.log(city)
//Search Query
    // var queryURL = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=" + APIKey;

    var geoURL = "http://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lon + "&appid=" + APIKey;
//Find places than the query
    //var hotter = "http://api.openweathermap.org/data/2.5/group?id=524901,703448,2643743&units=metric&appid=" + 

// Here we run our AJAX call to the OpenWeatherMap API
    $.ajax({url: geoURL, method: 'GET'})
    // We store all of the retrieved data inside of an object called "response"
    .done(function(response) {
      // Log the queryURL
      console.log(geoURL);
      // Log the resulting object
      console.log(response);
// Transfer content to HTML
      $('.name').html("<h1>Somewhere Warm</h1>");
      $(".wind").html("Wind Speed: " + response.wind.speed);
      $(".humidity").html("Humidity: " + response.main.humidity);
      $(".temp").html("Temperature (F) " + response.main.temp);
// Log the data in the console as well
      console.log("Wind Speed: " + response.wind.speed);
      console.log("Humidity: " + response.main.humidity);
      console.log("Temperature (F): " + response.main.temp);
   
    }); 
    return false;
  };
    $(document).on('click', '#searchButton', displayLocationInfo);
  });
