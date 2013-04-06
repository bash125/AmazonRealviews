/**
 * Adds an adjusted rating to an Amazon product page.
 */
function addAdjustedReview() {

    "use strict";

    var reviewNode = $(this);
    var avgRating = 0;
    var numReviews = 0;

    $.each(reviewNode.children(), function() {
        if($(this).hasClass("asinReviewsSummary")) {
            var avgRatingText = $(this).text().trim();
            if (!avgRatingText) {
                avgRatingText = $(this).find("img").attr("alt").trim();
            }
            avgRating = parseFloat(avgRatingText.substring(0, 3));
        } else if ($(this).is("a")) {
            var numReviewsText = $(this).text().replace(/[^\d\.\-\ ]/g, '');
            numReviews = parseInt(numReviewsText, 10);
        }

    });

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

$(document).ready(function() {
    "use strict";
    // Add an observer to fire whenever a user scrolls left or right on the Recommended Items slider
        var observer = new WebKitMutationObserver(function(mutations, observer) {
        for (var i = 0; i < mutations.length; i++) {
            //Only fire if new Recommened Items appear
            if (mutations[i].target.className === "shoveler-cell") {
                //Cast to a jQuery object
                var newItem = $(mutations[i].addedNodes[0]);
                var reviews = newItem.find('.crAvgStars');
                $.each(reviews,addAdjustedReview);
            }
        }
    });

    // Put an observer on the entire document and its children
    observer.observe(document, {
      childList: true,
      subtree: true
    });

    //Find the average rating of Amazon users
    var reviews = $('.crAvgStars');

    $.each(reviews,addAdjustedReview);
});
