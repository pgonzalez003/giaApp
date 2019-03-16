            // Scope Issue - Ask Class - Remove for Production
            var countryCode_WorldBank = "";
            var countryName_CIAFactBook = "";
            var countryName_TravelAdvisory = "";
            var countryCode_CountryFlag = "";
            var countryCode_NewsData = "";
            var countryRecordCount = -1;
            var travelAdvisoryData = "";
            var countryData = "";
            function processCountryNameCodeData(country_code_or_name) {
                // AJAX - call to 'countries.json' file stored locally (on our github server)
                $.getJSON("./jpAssets/data/countries.json", function(json) {
                    console.log("All Countries:");
                    console.log(json);
            
                    countryRecordCount = json;
            
                    for (var index = 0; index < countryRecordCount.length; ++index) {
                        if ((json[index].name === country_code_or_name) || (json[index].code === country_code_or_name)) {
                            console.log("Found: Name: " + json[index].name + "   ID: " + json[index].code);
                            countryName = (json[index].name).toLowerCase();
                            console.log("Lower Case: " + countryName);
                            countryName = countryName.replace(" ", "_");
                            console.log("With Underscores: " + countryName);
                    
                            // Normalize Country Name - Code Search Criteria
                            countryCode_WorldBank = json[index].code;
                            countryName_CIAFactBook = countryName;         
                            countryName_TravelAdvisory = json[index].name;
                            countryCode_CountryFlag = json[index].code;
                            countryCode_NewsData = json[index].code;
                        }
                    }
            
                    console.log("Ind Country1 Code (WB): " + countryCode_WorldBank);
                    console.log("Ind Country1 Name: (CIA): " + countryName_CIAFactBook);
                    console.log("Ind Country1 Name: (Travel Advisory): " + countryName_TravelAdvisory);
                })
                .done(function () {
                    console.log("Ind Country2 Code (WB): " + countryCode_WorldBank);
                    console.log("Ind Country2 Name: (CIA): " + countryName_CIAFactBook);
                    console.log("Ind Country2 Name: (Travel Advisory): " + countryName_TravelAdvisory);
                    processWorldBankData(countryCode_WorldBank);
                    processWorldFactBook(countryName_CIAFactBook);
                    processTravelAdvisory(countryName_TravelAdvisory);
                    processCountryFlagData(countryCode_CountryFlag);
                    processNewsData(countryCode_NewsData);
                });
                // Loss of Global Scope ???
                console.log("Ind Country3 Code (WB): " + countryCode_WorldBank);
                console.log("Ind Country3 Name: (CIA): " + countryName_CIAFactBook);
                console.log("Ind Country3 Name: (TA): " + countryName_TravelAdvisory);
            }
            // World Bank Web API
            function processWorldBankData(countryCode_WB) {
               var queryURL_WorldBank = "http://api.worldbank.org/v2/country/" + countryCode_WB + "?format=json";
                console.log("CCWB: " + countryCode_WB);
                $.ajax({
                    url: queryURL_WorldBank,
                    method: "GET"
                }).then(function (response) {
                    var country_data = JSON.parse(JSON.stringify(response));
                    console.log("Begin country_data: " + Object.keys(country_data[1][0]));
                
                    // GUI: All Country Data from World Bank
                    console.log("Country ID: " + country_data[1][0].id + "\n" +
                                "Iso2Code: " + country_data[1][0].iso2Code + "\n" +
                                "Name: " + country_data[1][0].name + "\n" +
                                "Region: " + country_data[1][0].region.value + "\n" +
                                "Income: " + country_data[1][0].incomeLevel.value + "\n" +
                                "Capital City: " + country_data[1][0].capitalCity + "\n" +
                                "Latitude: " + country_data[1][0].latitude + "\n" +
                                "Longitude: " + country_data[1][0].longitude);
                               
                    $("#country-data-view").text(JSON.stringify(response));
                });
            }
            // CIA World Fact Book Web API Data (factbook.json - updated weekly by Ian)
            function processWorldFactBook(countryName_CIA) {
                console.log("CountryNameCIA: " + countryName_CIA);
                // AJAX - call to 'factbook.json' file stored locally
                $.getJSON("jpAssets/data/factbook.json", function(json_data_object) {
                    console.log("Data for Target Country:");
                    console.log(json_data_object.countries[countryName_CIA]);
 
                    // GUI: Country Name
                    console.log("Country Name: " + json_data_object.countries[countryName_CIA].data.government.country_name.conventional_short_form);
                    $('#country').text(json_data_object.countries[countryName_CIA].data.government.country_name.conventional_short_form);
                    // GUI: Country Languages - All
                    var languageCount = json_data_object.countries[countryName_CIA].data.people.languages.language.length;
                    console.log("Language Count: " + languageCount);
                    // $('#language').text(json_data_object.countries[countryName_CIA].data.people.languages.language.length);
                    for (var index = 0; index < languageCount; ++index) {
                        console.log("Country Languages: " + json_data_object.countries[countryName_CIA].data.people.languages.language[index].name + ", ");
                    }
                    $('#language').text(json_data_object.countries[countryName_CIA].data.people.languages.language[0].name);
                    // GUI: Country Government Type - (Head of State)
                    $('#headOfState').text(json_data_object.countries[countryName_CIA].data.government.government_type);
                    console.log("Country Government Type: " + json_data_object.countries[countryName_CIA].data.government.government_type); 
                    // GUI: Country Religions - All
                    $('#religion').text(json_data_object.countries[countryName_CIA].data.people.religions.religion[0].name);
                    var religionCount = json_data_object.countries[countryName_CIA].data.people.religions.religion.length;
                    console.log("Religion Count: " + religionCount);                                  
                    for (var index = 0; index < religionCount; ++index) {
                        console.log("Country Religions: " + json_data_object.countries[countryName_CIA].data.people.religions.religion[index].name + ", ");
                    }
                    // GUI - Country Currency - Needs Work - Always 'USD'
                    console.log("Country Currency: " + json_data_object.countries[countryName_CIA].data.economy.gdp.purchasing_power_parity.annual_values[0].units);
                    // GUI - Country Timezone
                    if (parseInt(json_data_object.countries[countryName_CIA].data.government.capital.time_difference.timezone) >= 0 ) {
                        console.log("Country Capital TimeZone: UTC/GMT+" + json_data_object.countries[countryName_CIA].data.government.capital.time_difference.timezone);
                        $('#timeZone').text("UTC/GMT+"+json_data_object.countries[countryName_CIA].data.government.capital.time_difference.timezone)
                    }
                    else {
                        console.log("Country Capital TimeZone: UTC/GMT" + json_data_object.countries[countryName_CIA].data.government.capital.time_difference.timezone);
                        $('#timeZone').text("UTC/GMT"+json_data_object.countries[countryName_CIA].data.government.capital.time_difference.timezone)
                    }
                });
            }
            // Begin Travel Advisory Code
            function xmlDataFileLoad_TravelAdvisory(filename)
            {
                var xmlHTTP = new XMLHttpRequest();
                try
                {
                    //xmlHTTP.setRequestHeader("Access-Control-Allow-Origin", "https://travel.state.gov");
                    xmlHTTP.open("GET", filename, false);
                    xmlHTTP.send(null);
                }
                catch (e) {
                    window.alert("Unable to load the requested file.");
                    return;
                }
                travelAdvisoryData = xmlHTTP.responseText;
            }
            function processTravelAdvisory(countryName_TA) {
                console.log("inside processTravelAdvisory() . . . ");

                // Load Travel Advisory XML data from local github file
                // file needs to reside on 'our' github server (CORS issue work around)
                xmlDataFileLoad_TravelAdvisory("jpAssets/data/TAsTWs.xml");
                // user input
                //var country_code = $("#country-code-input").val();
                // parse xml file and return target data
                var parser = new DOMParser();
                var xmlDoc = parser.parseFromString(travelAdvisoryData, "text/xml");
                var totalCountryCount = xmlDoc.getElementsByTagName("title");
                var countryData = "";
                console.log("Country Count: " + totalCountryCount.length);
                for (var index = 0; index < totalCountryCount.length; ++index) {
                    countryData = xmlDoc.getElementsByTagName("title")[index].childNodes[0].nodeValue;
                    if (countryData.includes(countryName_TA)) {
                        console.log(countryData.includes(countryName_TA));
                        console.log(countryData);
                        break; 
                    }
                    if (index === totalCountryCount.length - 1) {
                        countryData = "";
                        console.log("Please enter a valid country name . . .");
                    }
                }
                //var first = xmlDoc.getElementsByTagName("title")[1].childNodes[0].nodeValue;
                console.log(countryData);
                $('#travelAdvisories').text("Country Data: " + countryData);
            }
            function processCountryFlagData(countryCode_Flag) {
                var flag_url = "https://www.countryflags.io/" + countryCode_Flag + "/flat/64.png";
                var flagImage= $("<img>").attr("src", flag_url);
                console.log("Flag URL: " + flag_url);
                $('#flag').html(flagImage);
            }
            function processNewsData(countryCode_News) {
                console.log("inside processNewsData() . . .");
                var queryURL_NewsApi = "https://newsapi.org/v2/top-headlines?country=" 
                                     + countryCode_News + "&apiKey=10166a5bf81947efa494005bf4868699";
                console.log("New API Query: " + queryURL_NewsApi);
                $.ajax({
                    url: queryURL_NewsApi,
                    method: "GET"
                }).then(function (response) {
                    var country_data = JSON.parse(JSON.stringify(response));
                    console.log(Object.keys(country_data));
                
                    console.log("News Data: " + country_data.totalResults);
                    console.log("Article Data: " + country_data.articles[0]);
                    // GUI: All Country Data from World Bank
                    /*
                    console.log("Country ID: " + country_data[1][0].id + "\n" +
                                "Iso2Code: " + country_data[1][0].iso2Code + "\n" +
                                "Name: " + country_data[1][0].name + "\n" +
                                "Region: " + country_data[1][0].region.value + "\n" +
                                "Income: " + country_data[1][0].incomeLevel.value + "\n" +
                                "Capital City: " + country_data[1][0].capitalCity + "\n" +
                                "Latitude: " + country_data[1][0].latitude + "\n" +
                                "Longitude: " + country_data[1][0].longitude);
                    */           
                    $("#news").text(JSON.stringify(response));
                });
            }
            // Front-End - Search Button - Event Handler - first to execute after 'search button' pressed
            function performCountryDataSearch() {
                console.log("inside performCountryDataSearch() . . . ");
                // event.preventDefault() can be used to prevent an event's default behavior.
                // event.preventDefault();
                // Here we grab the text from the input box
                var country_code = $("#query").val();
                console.log("User Input: " + country_code);
                // Normalize Data for multiple Web API Use
                processCountryNameCodeData(country_code);
                console.log("The WB: " + countryCode_WorldBank);
                console.log("The CIA: " + countryName_CIAFactBook);
                console.log("The TA: " + countryName_TravelAdvisory);
                console.log("The Flag: " + countryCode_CountryFlag);
                console.log("The News: " + countryCode_NewsData);
            }
            // This .on("click") function will trigger the AJAX Call
            $(".btnQuery").on("click", performCountryDataSearch);


//=======================Abby====================================

//Local Storage
var myPlaces = JSON.parse(localStorage.getItem("myPlaces"));
if(!myPlaces) {
 myPlaces = [];
}


// Local storage click function
$(".btnQuery").on("click", function(event) {
 event.preventDefault();
 var location = $("#query").val().trim();
 myPlaces.push(location);
 localStorage.setItem("myPlaces", JSON.stringify(myPlaces));

 myPlaces = JSON.parse(localStorage.getItem("myPlaces"));

 //get JSON from countries.json
 var country;
 $.getJSON('jpAssets/data/countries.json', function(countries) {
   country = searchObj(location.toUpperCase(), countries).name;
   $(".dropdown-menu").append(`<a class="dropdown-item" href="#">` + country + `</a>`);
 });
});

function searchObj(code, myArray){
 for (var i=0; i < myArray.length; i++) {
     if (myArray[i].code === code) {
         return myArray[i];
     }
 }
}


//======================================firebase========================================
var config = {
    apiKey: "AIzaSyARrHb0nP7XvLyaxVpm7MTrJ79C_SuyFHk",
    authDomain: "global-intelligence-agency.firebaseapp.com",
    databaseURL: "https://global-intelligence-agency.firebaseio.com",
    projectId: "global-intelligence-agency",
    storageBucket: "",
    messagingSenderId: "817483264211"
  };
  firebase.initializeApp(config);

  var database = firebase.database();

  var clickCounter = 0;

  $("#checkInBtn").on("click", function() {
    clickCounter ++;
    $('#checkIns').text(clickCounter + 'people have visited this location!');
    database.ref().set({
    clickCount: clickCounter
    
    });
  });