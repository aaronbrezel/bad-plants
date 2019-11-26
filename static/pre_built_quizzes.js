var deleteID
var quizID

$(document).ready(function () {
    
   console.log(quizzes)

    var quizzesBox = $('#quizzesBox')

    if (quizzes.length == 0){
        console.log("empty")
        var quiz_widget = $("<div class='row quizWidget'></div>");
        quizzesBox.append(quiz_widget);

        var quiz_empty_col = $("<div class='col'></div>");
        quiz_empty_col.append('<span class="emptyList">You have no quizzes</span>')

        quiz_widget.append(quiz_empty_col)

    }
    else {
        buildQuizList(quizzesBox,quizzes)
    }    

    $(".deleteButton").click(function(){
        deleteID = $(this).attr("id")
        $('#quizDeleteName').text(quizzes[deleteID].quiz_name)
    });


    $("#dontDelete").click(function(){
        $.fancybox.close()
    });

    $("#deleteQuiz").click(function(){

        $.ajax({
            type: "POST",
            url: "delete_quiz",                
            dataType : "json",
            contentType: "application/json; charset=utf-8",
            data : JSON.stringify(quizzes[deleteID]),
            success: function(result){
                var newQuizzes = result["data"]
                quizzesBox.empty()
                console.log(newQuizzes)
                buildQuizList(quizzesBox,newQuizzes)
                $.fancybox.close()
            },
            error: function(request, status, error){
                console.log("Error");
                console.log(request)
                console.log(status)
                console.log(error)
            }
        }) 
    });
 

    $("#sciNames").click(function(){      
        var url = "/quiz/"
        var id = quizID
        var sciNames = "/scinames"
        fullURL = url.concat(id,sciNames)
        window.location.href = fullURL
        
    
    })
    $("#comNames").click(function(){
        var url = "/quiz/"
        var id = quizID
        var sciNames = "/comnames"
        fullURL = url.concat(id,sciNames)
        window.location.href = fullURL
    })
       



});


function buildQuizList(quizzesBox,quizzes){
    for (var key in quizzes){
        console.log("rebuild")
        var quiz = quizzes[key]
        console.log(quiz)
        var quiz_name = quiz.quiz_name
        var quiz_plants_length = quiz.quiz_plants.length
        var quiz_image = quiz.quiz_plants[quiz_plants_length-1].Photo
        var quiz_id = quiz.quiz_id

        
        
        var quiz_widget = $("<div class='row quizWidget'></div>")

        var widgetDelete =  $("<div class='col-1 widgetDelete'></div>")
        widgetDelete.append('<a id="quizLink" data-fancybox data-src="#delete" href="javascript:;"><button id="' + quiz_id + '" class="btn btn-lg btn-danger btn-circle deleteButton"><i class="icon fa fa-times fa-3x" aria-hidden="true"></i></button></a>')
        
        
        quiz_widget.append(widgetDelete)


        var widget_image = $("<div class='col-2 widgetImage'></div>")
        widget_image.append('<img class="plantImage" src=' + quiz_image + ' alt="image not available" >' )
        quiz_widget.append(widget_image)

        var widgetInfo = $("<div class='col-5 widgetInfo'></div>")

        //adding html for quiz name
        var widget_info_name_row = $("<div class='row'></div>")
        widgetInfo.append(widget_info_name_row)

        var widget_info_name_col = $("<div class='col'></div>")
        widget_info_name_col.append('<span class="quizName">' + quiz_name + '</span>')
        widget_info_name_row.append(widget_info_name_col)

        //adding html fo number of plants
        var widget_info_plants_row = $("<div class='row'></div>")
        widgetInfo.append(widget_info_plants_row)

        var widget_info_plants_col = $("<div class='col'></div>")
        widget_info_plants_col.append('<span class="quizLength">You have ' + quiz_plants_length + ' plants in this quiz</span>')
        widget_info_plants_row.append(widget_info_plants_col)

        //append html of quiz name and number of plants
        quiz_widget.append(widgetInfo)


        //HTML work on number of buttons
        var widgetButtons = $("<div class='col-4 widgetButtons'></div>")
      
        var editButton = $('<button type="button" class="btn btn-warning btn-sm btn-block editQuiz" id="' + quiz_id + '">Edit quiz</button>')
        var learnButton = $('<button type="button" class="btn btn-primary btn-sm btn-block learnQuiz" id="' + quiz_id + '">Study</button>')
        var quizButton = $('<a id="quizButton" data-fancybox data-src="#pickQuizType" href="javascript:;"><button type="button" class="btn btn-success btn-sm btn-block takeQuiz" id="' + quiz_id + '">Take quiz</button></a>')
        widgetButtons.append(editButton)
        widgetButtons.append(learnButton)
        widgetButtons.append(quizButton)

        quizButton.click(function(){
            var button = $(this).children()[0]
            quizID = $(button).attr("id")
        })
        // assignRedirect(quizButton,"quiz")
        assignRedirect(learnButton,"learn")
        assignRedirect(editButton, "edit")

        quiz_widget.append(widgetButtons)

        quizzesBox.append(quiz_widget)
        quizzesBox.append($("<hr>"))

        $('[data-fancybox]').fancybox({
            touch : false, //prevents dragging of fancybox
            toolbar: false, // removes toolbar from top of the screen
        });

    }
}

function assignRedirect(button,direction){
    if (direction=="learn"){
        button.click(function(){
            var url = "/learn/"
            var id = button.attr("id")
            window.location.href = url.concat(id)
        })
    }
    else if (direction=="edit"){
        button.click(function(){
            var url = "/edit/"
            var id = button.attr("id")
            window.location.href = url.concat(id)
        })
    }
}