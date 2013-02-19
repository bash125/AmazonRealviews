var textOptions = ["minReviews", "siteAvgRating", "decimalPlaces"];

/**
 * Saves options to localStorage.
 * @return Nothing.
 */
function save_options() {
  "use strict";

  //Store the new options in localStorage
  for (var i = 0; i < textOptions.length; i++) {
    localStorage[textOptions[i]] = $('#' + textOptions[i]).val();
  }

  //Add a status message to show that the options saved successfully 
  var alert = $('<h3>');
  alert.addClass("alert alert-success");
  alert.text("Options Saved!");

  $("#status").append(alert);
  alert.fadeOut(750);
}

/**
 * Restores form input boxes to saved values from localStorage.
 * @return Nothing
 */
function restore_options() {
  "use strict";
  for (var i = 0; i < textOptions.length; i++) {
    $('#' + textOptions[i]).val(localStorage[textOptions[i]]);
  }
}

/**
 * Changes the customized formula on the options page. 
 * @return Nothing
 */
function change_formula() {
  $(".meanRating").text(localStorage["siteAvgRating"]);
  $(".minRatings").text(localStorage["minReviews"]);
}

/**
 * Initialize default values if they have not been initialized.
 * @return Nothing.
 */
function initialize_default_values() {

  //Initialize to default values
  localStorage.siteAvgRating = localStorage.siteAvgRating || 3;
  localStorage.minReviews = localStorage.minReviews || 10;
  localStorage.decimalPlaces = localStorage.decimalPlaces || 3;

}

//Initialize the form values and add an event listener to the form
$(document).ready(function() {
  "use strict";
  initialize_default_values();
  restore_options();
  change_formula();
  $('#optionsForm').submit(function() {
    save_options();
    change_formula();
    return false;
  });
});
