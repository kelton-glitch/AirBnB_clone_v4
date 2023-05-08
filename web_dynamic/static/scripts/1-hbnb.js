/* Script that listens for changes on each INPUT checkbox tag */
$(document).ready(function () {
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