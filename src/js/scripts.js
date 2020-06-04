var covid19Repository = (function() {
  var covid19CountriesList = [];
  var globalData;
  var apiUrl = 'https://api.covid19api.com/summary';
  var $modalBodyContainer = $('.modal-body');

  // function to add a country object to country list
  function add(country) {
    covid19CountriesList.push(country);
  }

  // function to return country list
  function getAll() {
    return covid19CountriesList;
  }

  function addGlobalDataTableStructure() {
    var $globalFactsListGroup = $('.globalFactsListGroup');
    var $globalFactsHeading = $('.globalFactsHeading');
    $globalFactsHeading
      .append('<tr><th>Global Quick Facts:</th></tr>')
    $.each(globalData, function(key, value) {
      // add row
      $globalFactsListGroup
        .append('<li class=\'list-group-item\'>' + key + ' : ' + value + '</li>')
    });
  }

  function addCountryTableHeadline() {
    var $countryTableHeadline = $('.countryTableHeadline');
    $countryTableHeadline
      .append('<tr><th>Country Name</th><th>Total Cases</th><th>More Details</th></tr>')
  }

  // funtion to create list of button to each country in frontend
  function addListItem(index, country) {
    var $globalFactsListGroup = $('.countryTableBody');
    var markup = '<tr><td>' + country.Country + '</td><td>' + country.TotalConfirmed + '</td><td><button type=\'button\' class=\'btn bg-transparent btn-md moreDetailsButton' + index + '\' data-toggle=\'modal\' data-target=\'#moreDetailsModal\'>Click</button></td></tr>';
    $globalFactsListGroup.append(markup);
    clickShowDetailsButton(index, country);
  }

  // function to handle country button click to show country details
  function clickShowDetailsButton(index, country) {
    $('.moreDetailsButton' + index).on('click', function() {
      showDetails(country);
    });
  }

  // function to show loading message
  function showLoadingMessage() {
    var loading = $('.loading');
    var para = $('<p>Loading Data...</p>');
    loading.append(para);
  }

  // funtion to hide loading message
  function hideLoadingMessage() {
    var loading = $('.loading');
    loading.empty();
  }

  // function to open a modal to show country details
  function showModal(title, country) {
    // Clear all existing modal content
    $modalBodyContainer.empty();

    // add country name element
    var countryElement = $('<p>Country: ' + country.Country + '</p>');

    // add total confirmed cases element
    var totalConfirmedElement = $('<p>Total confirmed: ' + country.TotalConfirmed + '</p>');

    // add new confirmed cases element
    var newConfirmedElement = $('<p>New confirmed: ' + country.NewConfirmed + '</p>');

    // add total deaths element
    var totalDeathsElement = $('<p>Total Deaths: ' + country.TotalDeaths + '</p>');

    // add new deaths element
    var newDeathsElement = $('<p>New Deaths: ' + country.NewDeaths + '</p>');

    // add total recovered element
    var totalRecoveredElement = $('<p>Total Recovered: ' + country.TotalRecovered + '</p>');

    // add new recovered element
    var newRecoveredElement = $('<p>New Recovered: ' + country.NewRecovered + '</p>');

    // add country image element
    var imageElement = $('<img src=\'https://www.countryflags.io/' + country.CountryCode + '/flat/64.png\'' + 'width=\'200\' height=\'200\' alt=' + country.Country + '>');

    // add last updated element
    var dateElement = $('<p>Last updated:' + country.Date + '</p>');
    $modalBodyContainer.append(countryElement);
    $modalBodyContainer.append(totalConfirmedElement);
    $modalBodyContainer.append(newConfirmedElement);
    $modalBodyContainer.append(totalDeathsElement);
    $modalBodyContainer.append(newDeathsElement);
    $modalBodyContainer.append(totalRecoveredElement);
    $modalBodyContainer.append(newRecoveredElement);
    $modalBodyContainer.append(imageElement);
    $modalBodyContainer.append(dateElement);
  }

  // function to show all country details in console
  function showDetails(item) {
    showModal('COVID-19', item);
  }

  function addErrorMessage() {
    var error = $('.error');
    var para = $('<p>Data not available at the moment! Please try again...</p>');
    error.append(para);
  }

  // function to fetch country list from backend api and add to country list
  function loadList() {
    showLoadingMessage();
    return $.ajax(apiUrl, {
      dataType: 'json'
    }).then(function(response) {
      hideLoadingMessage();
      globalData = response.Global;
      response.Countries.forEach(function(item) {
        var country = {
          Country: item.Country,
          CountryCode: item.CountryCode,
          TotalConfirmed: item.TotalConfirmed,
          NewConfirmed: item.NewConfirmed,
          TotalDeaths: item.TotalDeaths,
          NewDeaths: item.NewDeaths,
          TotalRecovered: item.TotalRecovered,
          NewRecovered: item.NewRecovered,
          Date: item.Date
        };
        add(country);
      });
      addGlobalDataTableStructure();
      addCountryTableHeadline();
    }).catch(function() {
      hideLoadingMessage();
      addErrorMessage();
    })
  }

  function loadDetails(item) {
    showLoadingMessage();
    var url = item.detailsUrl;
    return fetch(url).then(function(response) {
      hideLoadingMessage();
      return response.json();
    }).catch(function() {
      hideLoadingMessage();
    });
  }

  return {
    add: add,
    getAll: getAll,
    addListItem: addListItem,
    loadList: loadList,
    loadDetails: loadDetails,
  };
})();

// to add country to buttons
covid19Repository.loadList().then(function() {
  // Now the data is loaded!
  covid19Repository.getAll().forEach(function(country, index) {
    covid19Repository.addListItem(index, country);
  });
});

// Header part
var headerTitle = $('<h1 class=\'headerTitle\'>COVID-19 Tracker</h1>');
$('.header').prepend(headerTitle);

var virusImage = $('<img src=\'./img/virus.png\' class=\'virusImage\' alt=\'image of corona virus\'>');
$('.work1').append(virusImage);
