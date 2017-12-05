$(document).ready(function() {

    $(".btn-notes").on("click", function() {
        var articleid = $(this).attr("data-id");

        $("#noteTarget").text(articleid);
        $("#newNote").text("");

        $.getJSON("/articles/" + articleid, function(data) {
            console.log(data);

            $("#noteView").empty();

            for (var i = 0; i < data.notes.length; i++) {
                var mainDiv = $("<div class='row'>");
                var subDiv;
                var delButton;

                subDiv = $("<div class='col-md-10 panel-body'>");
                subDiv.text(data.notes[i].body);
                mainDiv.append(subDiv);

                subDiv = $("<div class='col-md-2'>");
                delButton = $("<button type='button' class='delNote'>");
                delButton.attr("data-id", data.notes[i]._id);
                delButton.append("<i class='fa fa-trash-o'></i>");
                subDiv.append(delButton);
                mainDiv.append(subDiv);

                $("#noteView").append(mainDiv);
            }
        });        

        $("#noteModal").modal({backdrop: "static"});  // {backdrop: true or false}
    });

    $("#addNote").on("click", function() {
        var id = $("#noteTarget").text();
        
        $.post("/api/notes/" + id, { body: $("#newNote").val().trim() }, function(data) {
            console.log(data);
            $("#noteModal").modal("hide");
            location.reload();
        })
        .catch(function(err) {
            console.log(err.responseJSON);
        });
    });
    
    $(document).on("click", ".delNote", function() {
        var delObj = {
            articleId: $("#noteTarget").text(),
            noteId: $(this).attr("data-id")
        };

        $.ajax({
            url: "/api/notes",
            method: "DELETE",
            data: delObj
        })
        .done(function(data) {
            console.log(data);
            $("#noteModal").modal("hide");
            location.reload();
        })
        .catch(function(err) {
            console.log(err.responseJSON);
        });
    });
    
    $(".btn-unsaved").on("click", function() {
        var id = $(this).attr("data-id");
        $.ajax({
            url: "/api/articles/unsave/" + id,
            method: "PUT"
        })
        .done(function() {
            location.reload();
        })
    });

});