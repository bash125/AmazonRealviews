/**
 * Adds an adjusted rating to an Amazon search page.
 */
function addAdjustedRating() {

    "use strict";

    //Find the average rating of Amazon users
    var reviews = $('.a-icon-star').parent().parent().parent().parent();
    var numberRegex = /[\d\.]+/;

    $.each(reviews, function() {
        var reviewNode = $(this);

        if (!reviewNode.has('.reviewBox').length) {
            var avgRatingText = reviewNode.find('.a-icon-alt').text().trim();
            var avgRating = numberRegex.exec(avgRatingText)[0];
            avgRating = parseFloat(avgRating);

            var numReviewsText = reviewNode.find('.a-link-normal').text().trim();
            numReviewsText = numReviewsText.replace(/[^\d\.\-\ ]/g, '');

            var numReviews = parseInt(numReviewsText, 10);

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
    });

}

$(document).ready(function() {
    "use strict";

    addAdjustedRating();

    // Add an observer to fire whenever the user goes to the next page
    var observer = new WebKitMutationObserver(function(mutations, observer) {
        for (var i = 0; i < mutations.length; i++) {
            if (mutations[i].target.id === 'rightResultsATF') {
                addAdjustedRating();
                break;
            }
        }
    });

    // Put an observer on the entire document and its children
    observer.observe(document, {
      childList: true,
      subtree: true
    });

});
