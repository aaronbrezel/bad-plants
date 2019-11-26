var quizName
var answersBox
var picturesBox

$(document).ready(function () {
    
    quizName = quiz.quiz_name
    $("#backToLearnCol").append('<button type="button" class="btn btn-primary btn-sm btn-block" id="learnButton">I need to study</button>')
    $('#quizTitleCol').append('<span id="quizTitle">' + quizName + '</span><br>')
    $("#quizTitleCol").append("<span id='quizDirections'>Drag the name to the appropriate photo.</span>")
    $("#quizResultsCol").append('<button type="button" class="btn btn-success btn-sm btn-block" id="viewQuizResults">View Results</button>')
    

    answersBox = $("#namesBox")
    picturesBox = $("#picturesBox")

    buildTheQuiz()

    $("#learnButton").click(function(){
        var url = "/learn/"
        var id = quiz.quiz_id.toString()
        window.location.href = url.concat(id)
    })

    $('#viewQuizResults').click(function(){
        generateResults();
    })


});


function buildTheQuiz(){
    var answers = shuffle(quiz.quiz_plants)
    var plants = quiz.quiz_plants
    for(i=0; i < plants.length; i++){
 
        if(quizType == "scinames"){
            var answer = answers[i]["Scientific name"]
        }
        else if(quizType == "comnames"){
            var answer =  answers[i]["Common Name"][Math.floor(Math.random() * answers[i]["Common Name"].length)]
        }
       
        
        var plant = plants[i]
        var pictureRow = $("<div class='row pictureRow'></div>");
        picturesBox.append(pictureRow);

        var pictureNameCol = $("<div class='col-4 pictureNameCol'></div>");
        pictureRow.append(pictureNameCol)

        var pictureCol = $("<div class='col-8 pictureCol flip-card'></div>");
        //section for picture and description
        var flipCardInner = $('<div class="flip-card-inner"></div>')
        var picture = $('<img class="plantImage quizImage notTaken flip-card-front" src=' + plant["Photo"] + ' alt="image not available" >')
        //var picture = $('<img class="plantImage quizImage notTaken flip-card-front" src=' + plant["Photo"] + ' alt="image not available" >')
        var description = $('<span class="flip-card-back">HELLO</span>')
        flipCardInner.append(picture)
        flipCardInner.append(description)
        
        // pictureCol.append(flipCardInner);
        pictureCol.append(picture)
        if(quizType == "scinames"){
            pictureCol.attr("id", plant["Scientific name"])
        }
        else if(quizType == "comnames"){
            var coms = plant["Common Name"].join(",")
            pictureCol.attr("id", coms)
        }
        
        pictureRow.append(pictureCol);

        var nameRow = $("<div class='row nameRow'></div>");
        nameRow.attr('id', answer)
        answersBox.append(nameRow);

        var nameCol = $("<div class='col nameCol'></div>");
        var name = $('<span class="quizSciName">' + answer + '</span>')
        nameCol.append(name)
        nameRow.append(nameCol);
        
        addQuizHover_js(nameRow)

    }
}

function addQuizHover_js(nameRow){
    nameRow.draggable( {
        revert: "invalid"
    });

    nameRow.hover( 
        function (){
            $(this).addClass("hoverOnDraggable");
        },
        function (){
            $(this).removeClass("hoverOnDraggable");
        } 
    );

    nameRow.mousedown(function(){
        if(nameRow.hasClass("nameRow")){
            nameClicked($(this))
        }
        if(nameRow.hasClass("inputNameRow")){
            inputClicked($(this))
        }
        
    })

}

function nameClicked(sciName){
    $('.notTaken').droppable({
        accept: ".nameRow",
        hoverClass: "darken",
        drop: function (){
            dropSciName(sciName, $(this))
            $(this).removeClass("notTaken")
            sciName.remove();
        }

    });
}

function dropSciName(sciName, quizImage){
    var name = sciName[0].id
    

    var inputNameRow = $("<div class='row inputNameRow'></div>");
    inputNameRow.attr('id', name)
    quizImage.parent().parent().children()[0].append(inputNameRow[0])

  
    var inputNameCol = $("<div class='col'></div>");
    var inputName = $('<span class="quizSciName">' + name + '</span>')
    inputName.addClass(name)
    inputNameCol.append(inputName)
    inputNameRow.append(inputNameCol)

    addQuizHover_js(inputNameRow);
    quizImage.droppable("option", "disabled", true) // removes droppable functionality for this picture. Must add back if answer is changed
    
}

function inputClicked(inputRow){
    var pictureCol = $(inputRow.parent().parent().children()[1]) 
    var picture = $(pictureCol.children()[0])
    
    $('#namesBox').addClass("returnNameHover")
    inputRow.mousedown(function(){
        $('#namesBox').addClass("returnNameHover")
    })
    inputRow.mouseup(function(){
        $('#namesBox').removeClass("returnNameHover")
    })
    

    $('#namesBox').droppable({
        accept: ".inputNameRow",
        hoverClass: "returnNameHoverEvenDarker",
        drop: function(){
            dropInputRow(inputRow,picture)
            inputRow.remove();
        }
    });
    $('.notTaken').droppable({
        accept: ".inputNameRow",
        hoverClass: "darken",
        drop: function(){
            dropSciName(inputRow,$(this))
            picture.addClass("notTaken");
            picture.droppable("option", "disabled", false);
            inputRow.remove();
        }
    });

}

function dropInputRow(inputRow,picture){
    var namesBox = $('#namesBox');
    var nameRow = $("<div class='row nameRow'></div>");
    nameRow.attr('id', inputRow[0].id)
    namesBox.append(nameRow);

    var nameCol = $("<div class='col nameCol'></div>");
    var name = $('<span class="quizSciName">' + inputRow[0].id + '</span>')
    nameCol.append(name)
    nameRow.append(nameCol);
    addQuizHover_js(nameRow);
    
    
    picture.droppable("option", "disabled", false)
    picture.addClass("notTaken")
}

function shuffle(plants) {
    var j, x, i;
    var a = plants.slice();
    
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
}










function generateResults(){
    var answerRows = $('#picturesBox').children()
    var allRight = false;
    var rightCount = 0
    for (var i = 0; i < answerRows.length; i++){
        var answerCol = $($(answerRows[i]).children()[0])
        var imageCol = $($(answerRows[i]).children()[1])
        if( $(answerCol[0]).children().length > 0){
            var guess = $(answerCol[0]).children()[0]
            var answer = $(imageCol[0]) 
            answer = answer[0].id
            var answers = answer.split(",")
            for(var j = 0; j < answers.length; j++){
                if (answers[j] == guess.id){
                    allRight = true;
                    $(guess).removeClass("wrongAnswer")  
                    rightCount++
                }
                else if (!allRight) {
                    $(guess).addClass("wrongAnswer")
                }
            }
            
        }

    }
    if (allRight){
        alert("Congrats, you got " + rightCount + " of the plants right!");
    }
} 
