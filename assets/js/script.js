// add event listener for search button 
// add ability for users to see their search history and have that logged on screen
// have a weather function with third party api and variables that create their own elements representing todays weather
// have a forecast function that creates a 5-day forecast with the api

// start with a .ready function for loading the data on launch
$(document).ready(function () {
    // search button click listener
    $("#search-button").on("click", function () {
        // this grabs values inputted into the search bar
        var searchTerm = $("#search-bar").val();
        // just incase there is no value inputted 
        $("#search-bar").val("");
        weatherFunction(searchTerm);
        forecastFunction(searchTerm);
    });

    // grabs search history items from the local storage
    var searchHistory = JSON.parse(localStorage.getItem("search-history")) || [];

    // correctly sets the searchHistory array
    if (searchHistory.length > 0) {
        weatherFunction(searchHistory[searchHistory.length - 1]);
    }
    // row is then make for each element in the searchHistory array ie: all the searchTerms
    for (var i = 0; i < searchHistory.length; i++) {
        createRow(searchHistory[i]);
    } 

    function createRow(text) {
        var listItem = $("<li>").addClass("list-group-item").text(text);
        $(".search-history").append(listItem);
    }
    // click listener for list item
    $(".search-history").on("click", "li", function () {
        weatherFunction($(this).text());
        weatherForecast($(this).text());
    });
    
    // function responsible for grabbing data from api and creating elements to append that data to
    function weatherFunction(searchTerm) {

        $.ajax({
            type: "GET",
            url: "https://api.openweathermap.org/data/2.5/weather?q=" + searchTerm + "&appid=9bbe868aa95e2e05ff8a18fa3fab1fc7&units=imperial",

            // if searched name does exist the search bar is cleared, and not saved. But if searched name does exist it is searched saved in array and saved in local and search bar is also cleared.
        }).then(function (data) {
            if (searchHistory.indexOf(searchTerm) === -1) {
                searchHistory.push(searchTerm);
                localStorage.setItem("search-history", JSON.stringify(searchHistory));
                createRow(searchTerm);
            }
            $("#today").empty();

            var title = $("<h3>").addClass("card-title text-light").text(data.name + " (" + new Date().toLocaleDateString() + ")");
            var img = $("<img>").attr("src", "https://openweathermap.org/img/w/" + data.weather[0].icon + ".png");


            var card = $("<div>").addClass("card bg-dark");
            var cardBody = $("<div>").addClass("card-body text-light");
            var wind = $("<p>").addClass("card-text").text("Wind Speed: " + data.wind.speed + " MPH");
            var humid = $("<p>").addClass("card-text").text("Humidity: " + data.main.humidity + "%");
            var temp = $("<p>").addClass("card-text").text("Temperature: " + data.main.temp + " °F");

            var lon = data.coord.lon;
            var lat = data.coord.lat;

            $.ajax({
                type: "GET",
                url: "https://api.openweathermap.org/data/2.5/uvi?appid=9bbe868aa95e2e05ff8a18fa3fab1fc7&lat=" + lat + "&lon=" + lon,

            }).then(function (response) {
                console.log(response);
                var uvResponse = response.value;
                var uvIndex = $("<p>").addClass("card-text").text("UV Index: ");
                var btn = $("<span>").addClass("btn btn-sm").text(uvResponse);


                if (uvResponse < 3) {
                    btn.addClass("btn-success");
                } else if (uvResponse < 7) {
                    btn.addClass("btn-warning");
                } else {
                    btn.addClass("btn-danger");
                }

                cardBody.append(uvIndex);
                $("#today .card-body").append(uvIndex.append(btn));

            });

            // this adds all the data above to the page so the user can see 
            title.append(img);
            cardBody.append(title, temp, humid, wind);
            card.append(cardBody);
            $("#today").append(card);
            console.log(data);
        });
    }

    // function thats responsible for creating a simple 5 day forecast
    function weatherForecast(searchTerm) {
        $.ajax({
            type: "GET",
            url: "https://api.openweathermap.org/data/2.5/forecast?q=" + searchTerm + "&appid=9bbe868aa95e2e05ff8a18fa3fab1fc7&units=imperial",

        }).then(function (data) {
            console.log(data);
            $("#forecast").html("<h4 class=\"mt-3\">5-Day Forecast:</h4>").append("<div class=\"row\">");
            // this loop creates a new card for 5 days. 
            for (var i = 0; i < data.list.length; i++) {

                if (data.list[i].dt_txt.indexOf("15:00:00") !== -1) {

                    var titleFive = $("<h3>").addClass("card-title").text(new Date(data.list[i].dt_txt).toLocaleDateString());
                    var imgFive = $("<img>").attr("src", "https://openweathermap.org/img/w/" + data.list[i].weather[0].icon + ".png");

                    var colFive = $("<div>").addClass("col-md-2");
                    var cardFive = $("<div>").addClass("card bg-danger text-white");
                    var cardBodyFive = $("<div>").addClass("card-body p-2");
                    var humidFive = $("<p>").addClass("card-text").text("Humidity: " + data.list[i].main.humidity + "%");
                    var tempFive = $("<p>").addClass("card-text").text("Temperature: " + data.list[i].main.temp + " °F");

                    // puts all the data together and puts it on the page
                    colFive.append(cardFive.append(cardBodyFive.append(titleFive, imgFive, tempFive, humidFive)));
                    $("#forecast .row").append(colFive);
                }
            }
        });
    }


});