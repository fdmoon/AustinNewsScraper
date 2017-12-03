$(document).ready(function() {

    $("#scraping").on("click", function() {
        $.post("/api/scrape", function(data) {

            // Modal ???
            alert(data.length);

            location.reload();
        })
        .catch(function(err) {
            console.log(err.responseJSON);
        });
    });

    $(".btn-saved").on("click", function() {
        var id = $(this).attr("data-id");
        $.ajax({
            url: "/api/articles/" + id,
            method: "PUT",
            data: { saved: true }
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