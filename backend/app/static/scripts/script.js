(function($, window, document) {
    $("img").error(function() {
        $(this).attr("src", "/static/images/no_image.png");
    });

})(jQuery, window, document);
