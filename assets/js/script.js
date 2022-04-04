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
        $(".searchHistory").append(listItem);
    }
    // click listener for list item
    $(".searchHistory").on("click", "li", function () {
        weatherFunction($(this).text());
        weatherForecast($(this).text());
    });
    
    
});