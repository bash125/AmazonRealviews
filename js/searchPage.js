/**
 * Adds an adjusted rating to an Amazon search page.
 */
function addAdjustedRating() {

    "use strict";

    //Find the average rating of Amazon users
    var reviews = $('.rvw');

    //Hack to deal with books
    if (reviews.length < 1) {
        reviews = $('.starsAndPrime');
    }

    $.each(reviews, function() {
        var reviewNode = $(this);
        var avgRatingText = $(this).find('.asinReviewsSummary').find('a').attr('alt');
        var avgRating = parseFloat(avgRatingText.substring(0, 3));

        var numReviewsText = $(this).find('.rvwCnt').find('a').text().trim();

        //Hack to deal with books
        if (numReviewsText === "") {
            numReviewsText = $(this).find('.reviewsCount').find('a').text().trim();
        }

        //Remove commas from numbers
        numReviewsText = numReviewsText.replace(/[^\d\.\-\ ]/g, '');

        var numReviewsWords = numReviewsText.split(" ");
        var numReviews = parseInt(numReviewsWords[0], 10);

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

    });

}

$(document).ready(function() {
    "use strict";

    // Add an observer to fire whenever the #click_withinLazyLoad_tower elements change
    var observer = new WebKitMutationObserver(function(mutations, observer) {

        // var map = {};

        // console.log(mutations);
        for (var i = 0; i < mutations.length; i++) {
            // map[mutations[i].target.tagName] = 1;
            // console.log(mutations[i].target.tagName + ": " + mutations[i].target.id);
            if (mutations[i].target.id === 'click_withinLazyLoad_tower') {
                addAdjustedRating();
                break;
            }
        }

        // console.log(map);

    });

    // Put an observer on the entire document and its children
    observer.observe(document, {
      childList: true,
      subtree: true
    });

});
