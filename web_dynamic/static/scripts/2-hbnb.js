/* Script that listens for changes on each INPUT checkbox tag */
$(document).ready(function () {
    const url = 'http://' + window.location.hostname + ':5001/api/v1/status/';
    $.get(url, function (data, textStatus) {
        if (textStatus === 'success') {
            $('#api_status').addClass('available');
        } else {
            $('#api_status').removeClass('available');
        }
    });

    const amenitiesId = {};
    $('input[type="checkbox"]').click(function () {
        if ($(this).is(':checked')) {
            amenitiesId[$(this).data('id')] = $(this).data('name');
        } else {
            delete amenitiesId[$(this).data('id')];
        }
        $('.amenities h4').text(Object.values(amenitiesId).join(', '));
    });
});
