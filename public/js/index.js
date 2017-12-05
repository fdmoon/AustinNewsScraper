$(document).ready(function() {

    $("#scraping").on("click", function() {

        $.post("/api/scrape", function(data) {
            
            $("#modalText").text("Added " + data.length + " new articles!");
            $("#resultModal").modal({backdrop: "static"});  // {backdrop: true or false}

        })
        .catch(function(err) {
            console.log(err.responseJSON);
        });
    });

    $(".btn-saved").on("click", function() {
        var id = $(this).attr("data-id");
        $.ajax({
            url: "/api/articles/save/" + id,
            method: "PUT"
        })
        .done(function() {
            location.reload();
        })
    });

    $(".modalClose").on("click", function() {

        $("#resultModal").modal("hide");    // "toggle", "show", "hide"
        location.reload();

    });

});

