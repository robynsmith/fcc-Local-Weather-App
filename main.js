/* this is the format JSON is returned from:

{"quoteText":"A house divided against itself cannot stand.", "quoteAuthor":"Abraham Lincoln", "senderName":"", "senderLink":"", "quoteLink":"http://forismatic.com/en/25d6485021/"}

*/

$(document).ready(function() {
    currentTemperature = 20; //Starts in celcius
    currentUnit = "Celsius"; //Alternative: Fahrenheit
    latitude = 0;
    longitude = 0;
    currentWeather = "";
    currentIcon = "";
    currentCity = "";
  
    apiResponse = {"coord":{"lon":138.93,"lat":34.97},"weather":[{"id":500,"main":"Rain","description":"light rain","icon":"10d"}],"base":"cmc stations","main":{"temp":284.595,"pressure":1013.83,"humidity":100,"temp_min":284.595,"temp_max":284.595,"sea_level":1023.31,"grnd_level":1013.83},"wind":{"speed":2.46,"deg":217.003},"rain":{"3h":0.875},"clouds":{"all":68},"dt":1456712810,"sys":{"message":0.0048,"country":"JP","sunrise":1456694095,"sunset":1456735147},"id":1851632,"name":"Default-dummy-data","cod":200}; // Dummy data for use in dev
  
    navigator.geolocation.getCurrentPosition(
        function(position) {
            //do succes handling
            latitude = position.coords.latitude;
            longitude = position.coords.longitude;
            
            $.ajax({
	    	      //jsonp: "jsonp",
              async: false,
              global: false,
          		dataType: "jsonp",
          		url: "http://api.openweathermap.org/data/2.5/weather?lat=" + latitude + "&lon=" + longitude + "&appid=ed1b466b0d05d07c60cc203e5197b600",
              
	    	      success:function(json){
	    	        apiResponse = json;
                console.log("API call Success!");
                console.log(apiResponse.name);
                
                currentWeather = apiResponse.weather[0].main;
                weatherDescription = apiResponse.weather[0].description;
                currentTemperature = apiResponse.main.temp - 273.15; //NOTE API response is in Kelvin, need to convert to C
                currentIcon = apiResponse.weather[0].icon;
                currentCity = apiResponse.name;

                $(".message").html(currentCity + ": " + Math.round(currentTemperature) + " °" + currentUnit[0] + " and " + currentWeather);
                $('#img_weather').attr("src","http://openweathermap.org/img/w/"+ currentIcon + ".png");
                  },
	    
              error:function(){
                $(".message").html("Error. Unable to connect to weather API. Try again later:");
                console.log("API call failure");
              }      

		        });

        },
        function errorCallback(error) {
            //do error handling
          console.log("Location ERROR!");
        },
        {
            maximumAge:Infinity,
            timeout:5000
        }
    );

    });

  $("#toggleUnits").on("click", function () {
    console.log("Toggling Units");
    if (currentUnit === "Celsius") {
      currentTemperature = (currentTemperature * (9/5) ) + 32;
      currentUnit = "Fahrenheit";
    }
    else if (currentUnit === "Fahrenheit") {
      currentTemperature = (currentTemperature - 32) / (9/5) ;
      currentUnit = "Celsius";
    }
    else {
      currentTemperature = "Failure. Likely a bug";
    }
    
    $(".message").html(currentCity + ": " + Math.round(currentTemperature) + " °" + currentUnit[0] + " and " + currentWeather);  
}); 