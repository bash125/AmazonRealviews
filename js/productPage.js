function addAdjustedReview() {
    "use strict";

    var numberRegex = /[\d\.]+/;

    var numReviewsText = $(this).find(".a-link-normal").text().trim();
    var avgRatingText = $(this).find('[title]').attr("title");

    if (numReviewsText && avgRatingText) {
        var numReviews = numberRegex.exec(numReviewsText)[0];
        var avgRating = numberRegex.exec(avgRatingText)[0];
        avgRating = parseFloat(avgRating);
        numReviews = parseInt(numReviews, 10);

        var reviewNode = $(this);

        //Send a message to the event page to calculate the Bayesian average
        chrome.extension.sendMessage({
            numReviews: numReviews,
            avgRating: avgRating
        }, function(response) {
            var decimalPlaces = parseInt(response.decimalPlaces, 10);
            var bayesianAverage = parseFloat(response.bayesianAverage);

            //Add the Bayesian Average to the page
            var bayesianAverageText = $('<p>');
            bayesianAverageText.attr('class', "reviewBox");
            bayesianAverageText.append("<span class=\"adjustedRating\">" + bayesianAverage.toFixed(decimalPlaces) + "</span> (<span class=\"unadjustedRating\">" + avgRating.toFixed(1) + "</span> unadjusted) out of 5 stars");
            reviewNode.append(bayesianAverageText);
        });
    }

}

$(document).ready(function() {
    "use strict";

    var avgReviewElements = [
        $('#averageCustomerReviews'),
        $('#summaryStars')
    ];

    $.each(avgReviewElements, addAdjustedReview);

});
