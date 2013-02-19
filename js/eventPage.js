chrome.extension.onMessage.addListener(
    function(request, sender, sendResponse) {
        "use strict";

        //Initialize to default values
        localStorage.siteAvgRating = localStorage.siteAvgRating || 3;
        localStorage.minReviews = localStorage.minReviews || 10;
        localStorage.decimalPlaces = localStorage.decimalPlaces || 3;

        //Pull user-defined options from local storage
        var siteAvgRating = parseFloat(localStorage.siteAvgRating);
        var siteAvgNumReviews = parseInt(localStorage.minReviews, 10);
        var decimalPlaces = parseInt(localStorage.decimalPlaces, 10);

        var avgRating = parseFloat(request.avgRating);
        var totalReviews = parseInt(request.numReviews, 10);

        // var formulaString = "(" + siteAvgNumReviews + "*" + siteAvgRating +
        // " + " + avgRating + "*" + totalReviews + ") / (" + siteAvgNumReviews  + " + " + totalReviews + ")";
        // console.log(formulaString);

        //Calculate the Bayesian average
        var bayesianAverage = (siteAvgNumReviews*siteAvgRating + avgRating*totalReviews) / (siteAvgNumReviews + totalReviews);

        sendResponse({bayesianAverage: bayesianAverage, decimalPlaces: decimalPlaces });
    });
