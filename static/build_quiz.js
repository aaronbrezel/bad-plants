<h2>Drag the scientific name to the appropriate photo. Good Luck.</h2>
    <div class="row">
        <div class="col-3" id="namesBox">
            
        </div>
        <div class="col-1" id="fillerBox">

        </div>
        <div class="col-8" id="picturesBox">
            
        </div>
    </div>
    <div class="row quizResultsButtonRow">
        <div class= "col">
            <button type="button" class="btn btn-success btn-sm btn-block" id="viewQuizResults">View Results</button>
        </div>
    </div>



function buildTheQuiz(){
    
    var namesBox = $('#namesBox');
    var picturesBox = $('#picturesBox');

    namesBox.empty();
    picturesBox.empty();

    scrambled = shuffle(addToQuiz);
    

    for(i=0; i < addToQuiz.length; i++){
        
        

        var pictureRow = $("<div class='row pictureRow'></div>");
        picturesBox.append(pictureRow);

        var pictureNameCol = $("<div class='col-4 pictureNameCol'></div>");
        pictureRow.append(pictureNameCol)

        var pictureCol = $("<div class='col-8 pictureCol'></div>");
        pictureCol.append('<img class="plantImage quizImage notTaken" src=' +addToQuiz[i]["Photo"] + ' alt="image not available" >');
        pictureCol.attr("id", addToQuiz[i]["Scientific name"])
        pictureRow.append(pictureCol);


        var nameRow = $("<div class='row nameRow'></div>");
        nameRow.attr('id', scrambled[i]["Scientific name"])
        namesBox.append(nameRow);

        var nameCol = $("<div class='col nameCol'></div>");
        var name = $('<span class="quizSciName">' + scrambled[i]["Scientific name"] + '</span>')
        nameCol.append(name)
        nameRow.append(nameCol);
        addQuizHover_js(nameRow);
        
    }
    
    
}


function shuffle(addToQuiz) {
    var j, x, i;
    var a = addToQuiz.slice();
    
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
}

function addQuizHover_js(nameRow){
    nameRow.draggable( {
        revert: "invalid",
        //stack: ".nameRow",
        // drag: function(event, ui){
        //     $(this).addClass("hoverOnDraggable");
        // }
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
function inputClicked(inputRow){
    var pictureCol = $(inputRow.parent().parent().children()[1]) 
    var picture = $(pictureCol.children()[0])
    
    $('#namesBox').droppable({
        accept: ".inputNameRow",
        hoverClass: "returnNameHover",
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

function generateResults(){
    var answerRows = $('#picturesBox').children()
    for (var i = 0; i < answerRows.length; i++){
        var answerCol = $($(answerRows[i]).children()[0])
        var imageCol = $($(answerRows[i]).children()[1])
        if( $(answerCol[0]).children().length > 0){
            var guess = $(answerCol[0]).children()[0]
            var answer = $(imageCol[0]) 
            console.log(guess.id)
            console.log(answer[0].id)
            if (answer[0].id != guess.id){
                $(guess).addClass("wrongAnswer")
            }
            else {
                console.log("RIGHT")
            }
        }

    }
}
