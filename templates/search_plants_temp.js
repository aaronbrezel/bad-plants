var plantCard
var plantCardDirections
var addToQuiz = [] //what the user is going to add. Basically, which boxes are checked




$(document).ready(function () {
    
  $('[data-fancybox]').fancybox({
	touch : false
    });

    
    
    for(i=0; i < plants.length; i++){ //This adds an extra key to each plant object which will indicate whether they have been selected for the quiz
        plants[i].selected = false;
    }

    plantCard = $('#plantCard');//binds plant card element to a variable
    plantCardDirections = $('#plantCardDirections'); //binds plant card directions to a variable

    dumpList(plants) //build the initial list of plants


    //JS for dealing with searches
    $('#searchBar').keyup(function(){
        $('#plantList').empty()
        var searchText = $('#searchBar').val()
        matchPlants(searchText)
    })
    $('#searchBar').keydown(function(){
        $('#plantList').empty()
        var searchText = $('#searchBar').val()
        matchPlants(searchText)
    })

    $('#clearButton').click(function(){
        $('#quizRepoCol').empty();
        $('#quizRepoCol').append('<span id="quizRepoColDirections">Press the blue plus-sign to add plants to your quiz</span>')
        
        addToQuiz = []
        
        for(i=0; i < plants.length; i++){
            if(plants[i].selected == true){
                plants[i].selected = false;          
            }
        }

        $(".plantWidget").removeClass("checked");
        $(".selection-btn").removeClass("btn-danger");
        $(".icon").removeClass("fa-times");
        $(".icon").addClass("fa-plus");

        disableQuiz();
        

    })

    $('#takeQuiz').click(function(){
        buildTheQuiz();
    })

    $('#viewQuizResults').click(function(){
        generateResults();
    })


    



});

function matchPlants(searchText){
    for (i = 0; i < plants.length; i++){
        currentPlant = plants[i] //Now we focus on just a single player
        if(currentPlant["Notes"].search(searchText) != -1){ //Check if search string matches plant bio         
            buildList(currentPlant)
        }
        else if(currentPlant["Scientific name"].search(searchText) != -1){ //Check if search string matches scientific name         
            buildList(currentPlant)
        }
    }
}


function dumpList(plants){
    for (i = 0; i < plants.length; i++){
        //console.log(plants[i])
        buildList(plants[i])
    } 
}


function buildList(currentPlant){
    
    
    var plantWidget = $("<div></div>"); //Create a widget for each plant to add
    plantWidget.addClass("row plantWidget");
    plantWidget.attr("id", currentPlant["plant id"]) //give that widget the same ID as the plant that it is attached to

    var plantAdditionCol = $("<div></div>");
    plantAdditionCol.addClass("col-2 plantAdditionCol");
    plantWidget.append(plantAdditionCol)


    var additionButton //button for each widget
    if(currentPlant.selected == false){
        additionButton = $('<button type="button" class="selection-btn btn btn-info btn-circle"><i class="icon fa fa-plus fa-lg" aria-hidden="true"></i></button>')
    }
    else if (currentPlant.selected == true){
        additionButton = $('<button type="button" class="selection-btn btn btn-danger btn-info btn-circle"><i class="icon fa fa-times fa-lg" aria-hidden="true"></i></button>')
        plantWidget.addClass("checked");
    }
    plantAdditionCol.append(additionButton)

    var plantImageCol = $("<div></div>"); //Add plant image
    plantImageCol.addClass("col-4 widgetImage");
    plantImageCol.append('<img class="plantImage" src=' +currentPlant["Photo"] + ' alt="image not available" >' )
    makeUnselectable($('.plantImage'))
    plantWidget.append(plantImageCol);

    var plantInfoCol = $("<div></div>"); //Add plant info
    plantInfoCol.addClass("col-6");
    plantWidget.append(plantInfoCol);

    plantInfoRowName = $("<div></div>"); //add row to plant info for name
    plantInfoRowName.addClass("row");
    plantInfoRowName.attr("id","sciName")
    plantInfoCol.append(plantInfoRowName);

    plantInfoRowDescription = $("<div></div>"); //add row to plant info for description
    plantInfoRowDescription.addClass("row");
    plantInfoCol.append(plantInfoRowDescription);

    plantName = $("<div></div>"); //add scientific plant name
    plantName.addClass("col");
    plantName.append(currentPlant["Scientific name"]);
    plantInfoRowName.append(plantName)

    var description = currentPlant["Notes"] //section to truncate the description for the widget
    trunk_description = getWords(description)
    if (trunk_description.split(" ").length != description.split(" ").length){
        var ellipses = " ..."
        trunk_description = trunk_description.concat(ellipses)
    }

    plantDescription = $("<div></div>"); //Add truncated description to the widget
    plantDescription.addClass("col notes");
    plantDescription.append(trunk_description);
    plantInfoRowDescription.append(plantDescription);

        
 
      
    $('#plantList').append(plantWidget); //add widget to the page
    $('#plantList').append($("<hr>"));


    add_hover_js(plantWidget,currentPlant); //add hover functionality
    add_button_js(plantWidget, additionButton);
}

function add_button_js(plantWidget, additionButton){
    additionButton.click(function(){
        var thePlant
        for(i=0; i < plants.length; i++){ //Connecting the widget with the right plant
            if(parseInt(plantWidget.attr("id")) == plants[i]["plant id"]){
                
                thePlant = plants[i]
            } 
        }
        var icon = $(additionButton.children()[0])
        
        if (thePlant.selected == false){
            //add plant 
            thePlant.selected = true;
            addToQuiz.push(thePlant);
            additionButton.addClass("btn-danger");
            
            icon.removeClass("fa-plus")
            icon.addClass("fa-times")

            plantWidget.addClass("checked")

        }
        else if (thePlant.selected == true){
            thePlant.selected = false
            additionButton.removeClass("btn-danger");
            icon.removeClass("fa-times")
            icon.addClass("fa-plus")

            
            plantWidget.removeClass("checked")

            for(i = 0; i < addToQuiz.length; i++){
                if (addToQuiz[i]["plant id"] == thePlant["plant id"]){
                    addToQuiz.splice(i,1)
                }
            }

            
            
        }

        disableQuiz();
        assembleQuizList(addToQuiz);
        
    })

}

function add_hover_js(plantWidget,currentPlant){
    plantWidget.hover( 
        function (){
            $(this).removeClass("unHovered");
            $(this).addClass("hovered");
            plantCard.empty();

            buildPlantCard(currentPlant)

        },
        function (){
            
            $(this).removeClass("hovered");
            $(this).addClass("unHovered");
            
            
            plantCard.empty();
            plantCard.append(plantCardDirections)
        } 
    );
}

function buildPlantCard(currentPlant) {
    var plantCard_photoRow = $("<div></div>");
    plantCard_photoRow.addClass("row plantCard_photoRow");
    plantCard.append(plantCard_photoRow)

    var plantCard_photoCol = $("<div></div>");
    plantCard_photoCol.addClass("col plantCard_photoCol")
    plantCard_photoCol.append('<img class="plantImage" src=' +currentPlant["Photo"] + ' alt="image not available" >' )
    plantCard_photoRow.append(plantCard_photoCol)
         

    var plantCard_infoRow = $("<div></div>");
    plantCard_infoRow.addClass("row plantCard_infoRow");
    plantCard.append(plantCard_infoRow)
            
    var plantCard_infoCol = $("<div></div>");
    plantCard_infoCol.addClass("col plantCard_infoCol")

    var plantCard_infoCol_sciName = $("<div></div>");
    plantCard_infoCol_sciName.addClass("row");
    var plantCard_infoCol_sciName_col = $("<div></div>");
    plantCard_infoCol_sciName_col.addClass("col");
    plantCard_infoCol_sciName_col.append('<span class="plantCard_sciName">' + currentPlant["Scientific name"] + '</span>')
    plantCard_infoCol_sciName.append(plantCard_infoCol_sciName_col)
    plantCard_infoCol.append(plantCard_infoCol_sciName)

    var plantCard_infoCol_plantDescription = $("<div></div>");
    plantCard_infoCol_plantDescription.addClass("row");
    var plantCard_infoCol_plantDescription_col = $("<div></div>");
    plantCard_infoCol_plantDescription_col.addClass("col");
    plantCard_infoCol_plantDescription_col.append('<span class="plantCard_plantDescription">' + currentPlant["Notes"] + '</span>')
    plantCard_infoCol_plantDescription.append(plantCard_infoCol_plantDescription_col)
    plantCard_infoCol.append(plantCard_infoCol_plantDescription)
           
    plantCard_infoRow.append(plantCard_infoCol)


}

function assembleQuizList(addToQuiz){
    $('#quizRepoCol').empty();
    for(i=0; i < addToQuiz.length; i++){
        var quizDiv = $("<div></div");
        quizDiv.addClass("row quizDiv")

        var quizDiv_photo = $("<div></div");
        quizDiv_photo.addClass("col-5")
        quizDiv_photo.append('<img class="plantImage quizDivImage" src=' + addToQuiz[i]["Photo"] + ' alt="image not available" >')
        quizDiv.append(quizDiv_photo)

        var quizDiv_name = $("<div></div");
        quizDiv_name.addClass("col-7 quizDivSciName");
        quizDiv_name.append('<span class="quizDivSciName">' + addToQuiz[i]["Scientific name"] + '</span>' );
        quizDiv.append(quizDiv_name)


        $('#quizRepoCol').append(quizDiv)

    }
    if(addToQuiz.length == 0){
        $('#quizRepoCol').append('<span id="quizRepoColDirections">Press the blue plus-sign to add plants to your quiz</span>')
    }


}





function getWords(str) {
    return str.split(/\s+/).slice(0,10).join(" ");
}

function makeUnselectable (image){ // Courtesy of https://stackoverflow.com/questions/12906789/preventing-an-image-from-being-draggable-or-selectable-without-using-js
    image
        .addClass( 'unselectable' ) // All these attributes are inheritable
        .attr( 'unselectable', 'on' ) // For IE9 - This property is not inherited, needs to be placed onto everything
        .attr( 'draggable', 'false' ) // For moz and webkit, although Firefox 16 ignores this when -moz-user-select: none; is set, it's like these properties are mutually exclusive, seems to be a bug.
        .on( 'dragstart', function() { return false; } );  // Needed since Firefox 16 seems to ingore the 'draggable' attribute we just applied above when '-moz-user-select: none' is applied to the CSS 

    image // Apply non-inheritable properties to the child elements
        .find( '*' )
        .attr( 'draggable', 'false' )
        .attr( 'unselectable', 'on' ); 
}

function disableQuiz() {
    if(addToQuiz.length == 0){
        $('#takeQuiz').attr("disabled", true);
    }
    else{
        $('#takeQuiz').attr("disabled", false);
    }
}



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


