var covid19Repository = (function() {
  var covid19CountriesList = [];
  var globalData;
  var apiUrl = 'https://api.covid19api.com/summary';
  var $modalContainer = $('#modal-container');

  // function to add a country object to country list
  function add(country) {
    covid19CountriesList.push(country);
  }

  // function to return country list
  function getAll() {
    return covid19CountriesList;
  }

  function addGlobalData() {
    // global details division
    //create a table to display global details
    var virusImage = $('<img src="./img/virus.png" class="virusImage" alt="image of corona virus">');

    var $table = $('<table>');
    $table.append('<caption></caption>')
      // thead
      .append('<thead>').children('thead')
      .append('<tr />').children('tr').append('<th>Global Quick Facts:</th>');

    //tbody
    var $tbody = $table.append('<tbody />').children('tbody');

    $.each(globalData, function(key, value) {
      // add row
      $tbody.append('<tr />').children('tr:last')
        .append("<td>" + key + ' : ' + value + "</td>")

    });

    // add table to dom
    $('.work1').append($table);
    $('.work1').append(virusImage);
  }

  function createCountryTableStructure() {
    // Country wise details division
    // create a table to display country details
    var $table2 = $('<table class="countryTable">');
    // caption
    $table2.append('<caption></caption>')
      // thead
      .append('<thead>').children('thead')
      .append('<tr />').children('tr').append('<th>Country Name</th><th>Total Cases</th><th>More Details</th>');

    //tbody
    var $tbody2 = $table2.append('<tbody />').children('tbody');

    // add table to dom
    $('.work2').append($table2);
  }

  // funtion to create list of button to each country in frontend
  function addListItem(index, country) {
    var markup = "<tr><td>" + country.Country + "</td><td>" + country.TotalConfirmed + "</td><td><button class=\"moreDetailsButton" + index +"\">Click</button></td></tr>";
    $(".countryTable tbody").append(markup);
    clickShowDetailsButton(index, country);
  }

  // function to handle country button click to show country details
  function clickShowDetailsButton(index, country) {
    $('.moreDetailsButton'+index).on('click', function(event) {
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
    $modalContainer.empty();

    var $modal = $('<div class="modal"/>');

    // Add the new modal content
    var closeButtonElement = $('<button class="modal-close">Close</button>');
    closeButtonElement.on('click', hideModal);

    // add title element
    var titleElement = $('<h1>'+ title+ '</h1>');

    // add country name element
    var countryElement = $('<p>Country: ' + country.Country+ '</p>');

    // add total confirmed cases element
    var totalConfirmedElement = $('<p>Total confirmed: ' + country.TotalConfirmed+ '</p>');

    // add new confirmed cases element
    var newConfirmedElement = $('<p>New confirmed: ' + country.NewConfirmed+ '</p>');

    // add total deaths element
    var totalDeathsElement = $('<p>Total Deaths: ' + country.TotalDeaths+ '</p>');

    // add new deaths element
    var newDeathsElement = $('<p>New Deaths: ' + country.NewDeaths+ '</p>');

    // add total recovered element
    var totalRecoveredElement = $('<p>Total Recovered: ' + country.TotalRecovered+ '</p>');

    // add new recovered element
    var newRecoveredElement = $('<p>New Recovered: ' + country.NewRecovered+ '</p>');

    // add country image element
    var imageElement = $('<img src=\"https://www.countryflags.io/'+ country.CountryCode + '/flat/64.png\"' +'width=\"200\" height=\"200\" alt=' +country.Country + '>');

    // add last updated element
    var dateElement = $('<p>Last updated:'  + country.Date + '</p>');

    $modal.append(closeButtonElement);
    $modal.append(titleElement);
    $modal.append(countryElement);
    $modal.append(totalConfirmedElement);
    $modal.append(newConfirmedElement);
    $modal.append(totalDeathsElement);
    $modal.append(newDeathsElement);
    $modal.append(totalRecoveredElement);
    $modal.append(newRecoveredElement);
    $modal.append(imageElement);
    $modal.append(dateElement);
    $modalContainer.append($modal);

    $modalContainer.addClass('is-visible');
  }

  var dialogPromiseReject; // This can be set later, by showDialog

  // function to hide model
  function hideModal() {
    var modalContainer = $('#modal-container');
    modalContainer.removeClass('is-visible');

    if (dialogPromiseReject) {
      dialogPromiseReject();
      dialogPromiseReject = null;
    }
  }

  // add escape event to close the model
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && $modalContainer[0].classList.contains('is-visible')) {
      hideModal();
    }
  });

  $modalContainer.on('click', function(event) {
    // Since this is also triggered when clicking INSIDE the modal container,
    // We only want to close if the user clicks directly on the overlay
    var target = event.target;
    if (target.id === $modalContainer[0].id) {
      hideModal();
    }
  });

  // function to show all country details in console
  function showDetails(item) {
    console.log(item);
    showModal('COVID-19', item);
  }

  // function to fetch country list from backend api and add to country list
  function loadList() {
    showLoadingMessage();
    return $.ajax(apiUrl, { dataType: 'json' }).then(function(response) {
      hideLoadingMessage();
      globalData = response.Global
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
    }).catch(function(e) {
      hideLoadingMessage();
      console.error(e);
    })
  }

  function loadDetails(item) {
    showLoadingMessage();
    var url = item.detailsUrl;
    return fetch(url).then(function(response) {
      hideLoadingMessage();
      return response.json();
    }).then(function(details) {
      // Now we add the details to the item
      item.imageUrl = details.sprites.front_default;
      item.height = details.height;
      item.types = details.types;
    }).catch(function(e) {
      hideLoadingMessage();
      console.error(e);
    });
  }

  return {
    add: add,
    getAll: getAll,
    addListItem: addListItem,
    loadList: loadList,
    loadDetails: loadDetails,
    addGlobalData: addGlobalData,
    createCountryTableStructure: createCountryTableStructure
  };
})();

// to add country to buttons
covid19Repository.loadList().then(function() {
  covid19Repository.addGlobalData()
  covid19Repository.createCountryTableStructure()
  // Now the data is loaded!
  covid19Repository.getAll().forEach(function(country, index) {
    covid19Repository.addListItem(index, country);
  });
});



// Header part

// Header part
var headerTitle = $('<h1 class="headerTitle">COVID-19 Tracker</h1>');
$('.header').append(headerTitle);
