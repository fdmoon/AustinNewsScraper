$(document).ready(function() {

    $(".btn-unsaved").on("click", function() {
        var id = $(this).attr("data-id");
        $.ajax({
            url: "/api/articles/" + id,
            method: "PUT",
            data: { saved: false }
        })
        .done(function() {
            location.reload();
        })
    });

    // $("#scraping").on("click", function() {
    //     $.getJSON("/scrape", function(data) {

    //         // Modal ???
    //         alert(data.length);

    //         location.reload();
    //     });
    // });

});