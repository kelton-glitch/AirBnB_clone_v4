/*Dynamic Functionality */
$(document).ready(function () {
    /*Listens for changes on each INPUT checkbox tag */
    const amenitiesId = {};
    $('input[type="checkbox"]').click(function () {
        if ($(this).is(':checked')) {
            amenitiesId[$(this).data('id')] = $(this).data('name');
        } else {
            delete amenitiesId[$(this).data('id')];
        }
        $('.amenities h4').text(Object.values(amenitiesId).join(', '));
    });
    /*Listens for changes on each states INPUT checkbox tag */
    const statesId = {};
    const citiesId = {};
    const citiesStates = {};
    $('.locations h2 input[type="checkbox"]').click(function () {
        if ($(this).is(':checked')) {
            statesId[$(this).data('id')] = $(this).data('name');
            citiesStates[$(this).data('id')] = $(this).data('name');
        } else {
            delete statesId[$(this).data('id')];
            delete citiesStates[$(this).data('id')];
        }
        $('.locations h4').text(Object.values(statesId).join(', '));
    });
    /*Listens for changes on each cities input checkbox tag */
    $('.locations ul ul input[type="checkbox"]').click(function () {
        if ($(this).is(':checked')) {
            citiesId[$(this).data('id')] = $(this).data('name');
            citiesStates[$(this).data('id')] = $(this).data('name');
        } else {
            delete citiesId[$(this).data('id')];
            delete citiesStates[$(this).data('id')];
        }
        $('.locations h4').text(Object.values(citiesStates).join(', '));
    });
    /*Status API every 10 seconds*/
    /*Manual re-loading page: */
    /*$.get(`http://${window.location.hostname}:5001/api/v1/status/`,
    function(status){
        if (status.status === 'OK'){
            $('#api_status').addClass('available');
        } else {
            $('#api_status').removeClass('available');
        }
    });*/
    /*Automatic re-loading page: */
    const callout = function () {
        $.ajax({
            type: 'GET',
            url: `http://${window.location.hostname}:5001/api/v1/status/`,
            timeout: 5000,
            success: function (status) {
                if (status.status === 'OK') {
                    $('DIV#api_status').addClass('available');
                } else {
                    $('DIV#api_status').removeClass('available');
                }
            },
            error: function () {
                $('DIV#api_status').removeClass('available');
            },
            complete: function () {
                setTimeout(callout, 10000);
            }
        });
    };
    callout();

    /*Request for Places*/
    const getPlaces = function () {
        $.ajax({
            type: 'POST',
            url: `http://localhost:5001/api/v1/places_search/`,
            contentType: 'application/json',
            data: '{}',
            dataType: 'json',
            success: function (data) {
                for (const place of data) {
                    const article = ['<article>',
                        '<div class="title_box">',
                        `<h2>${place.name}</h2>`,
                        `<div class="price_by_night">$${place.price_by_night}</div>`,
                        '</div>',
                        '<div class="information">',
                        `<div class="max_guest">${place.max_guest} Guest(s)</div>`,
                        `<div class="number_rooms">${place.number_rooms} Bedroom(s)</div>`,
                        `<div class="number_bathrooms">${place.number_bathrooms} Bathroom(s)</div>`,
                        '</div>',
                        '<div class="description">',
                        `${place.description}`,
                        '</div>',
                        '</article>'];
                    $('section.places').append(article.join(''));
                }
            }
        });
    };
    getPlaces();

    /*Get review list from a place when display class is clicked */
    $('section.places').on('click', 'article', function () {
        const reviewId = $(this).attr('data-id');
        if($(this).text() === 'Show'){
            $(this).text('Hide');
            $.ajax({
                type: 'GET',
                url: `http://localhost:5001/api/v1/places/${reviewId}/reviews`,
                contentType: 'application/json',
                dataType: 'json',
                success: function (reviews) {
                    const reviewsNumbers = Object.keys(reviews).length;
                    $(reviewId + ' h2').prepend(`${reviewsNumbers} Reviews`);
                    for (const review of reviews) {
                        const date = review.created_at.split('T')[0];
                        $.ajax({
                            type: 'GET',
                            url: `http://localhost:5001/api/v1/users/${review.user_id}`,
                            success: function (user) {
                                $(reviewId).append(
                                    '<ul>' +
                                    '<li>' +
                                    '<h3>From ' + user.first_name + ' ' + user.last_name + ' the ' + date + '</h3>' +
                                    '<p>' + review.text + '</p>' +
                                    '</li>' +
                                    '</ul>'
                                );
                            }
                        });
                    }
                }
            });
        } else {
            $('.reviews h2').text('Reviews');
            $('span').text('Show');
            $(reviewId + ' ul').css('display', 'none');
        }
    });
                    

    /*Request for Places with amenities*/
    $('button').click(function () {
        $.ajax({
            type: 'POST',
            url: `http://localhost:5001/api/v1/places_search/`,
            contentType: 'application/json',
            data: JSON.stringify({ amenities: Object.keys(amenitiesId),
                states: Object.keys(statesId),
                cities: Object.keys(citiesId) }),
            dataType: 'json',
            success: function (data) {
                $('section.places').empty();
                for (const place of data) {
                    const article = ['<article>',
                        '<div class="title_box">',
                        `<h2>${place.name}</h2>`,
                        `<div class="price_by_night">$${place.price_by_night}</div>`,
                        '</div>',
                        '<div class="information">',
                        `<div class="max_guest">${place.max_guest} Guest(s)</div>`,
                        `<div class="number_rooms">${place.number_rooms} Bedroom(s)</div>`,
                        `<div class="number_bathrooms">${place.number_bathrooms} Bathroom(s)</div>`,
                        '</div>',
                        '<div class="description">',
                        `${place.description}`,
                        '</div>',
                        '</article>'];
                    $('section.places').append(article.join(''));
                }
            }
        });
    })
});
