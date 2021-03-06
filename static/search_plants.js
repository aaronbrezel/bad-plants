var plantCard
var plantCardDirections
var addToQuiz = [] //what the user is going to add. Basically, which boxes are checked




$(document).ready(function () {
    
    $('[data-fancybox]').fancybox({
    touch : false, //prevents dragging of fancybox
    toolbar: false, // removes toolbar from top of the screen
    


    });

    $("#keepBuilding").click(function(){
        $.fancybox.close()
        uploadNewQuiz($('#quizNameInput').val(),"NO");
    })

    $("#viewQuizzes").click(function(){
        uploadNewQuiz($('#quizNameInput').val(),"preFab");
    })

    $("#takeQuiz").click(function(){
        uploadNewQuiz($('#quizNameInput').val(),"takeQuiz");
        
    })

    
    
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

    $("#selectAllButton").click(function(){
    
        $('#quizRepoColDirections').remove();

        for(i=0; i < plants.length; i++){
            if(plants[i].selected == false){
                plants[i].selected = true;
                addToQuiz.push(plants[i])
            }
        }

        assembleQuizList(addToQuiz)
        
        
        $(".plantWidget").addClass("checked");
        $(".selection-btn").addClass("btn-danger");
        $(".icon").addClass("fa-times");
        $(".icon").removeClass("fa-plus"); 

        disableQuiz();  
        
    })

    $('#quizNameInput').keydown(function(){
        if ($('#quizNameInput').val().length > 0){
            $(".lightBoxButtons").attr("disabled", false);
        }
        else {   
            $(".lightBoxButtons").attr("disabled", true);
        }
    })

    $('#quizNameInput').keyup(function(){
        if ($('#quizNameInput').val().length > 0){
            $(".lightBoxButtons").attr("disabled", false);
        }
        else {
            $(".lightBoxButtons").attr("disabled", true);
        }
    })



});


function uploadNewQuiz(quizName,redirect){
    var thePlants = addToQuiz
    var theQuiz = {
        quizName: quizName,
        thePlants: thePlants
    }
    $.ajax({
        type: "POST",
        url: "add_quiz",                
        dataType : "json",
        contentType: "application/json; charset=utf-8",
        data : JSON.stringify(theQuiz),
        success: function(result){
            var quizData = result["data"]
            console.log("success")
            if(redirect == "preFab"){
                window.location.href = "/pre_fabs"
            }
            else if (redirect == "takeQuiz"){
                var quiz_id = quizData.toString()
                var url = "/learn/"
                window.location.href = url.concat(quiz_id)
            }
        },
        error: function(request, status, error){
            console.log("Error");
            console.log(request)
            console.log(status)
            console.log(error)
        }
    });

}


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
        additionButton = $('<button type="button" class="selection-btn btn btn-info btn-circle"><i class="icon fa fa-plus fa-3x" aria-hidden="true"></i></button>')
    }
    else if (currentPlant.selected == true){
        additionButton = $('<button type="button" class="selection-btn btn btn-danger btn-info btn-circle"><i class="icon fa fa-times fa-3x" aria-hidden="true"></i></button>')
        plantWidget.addClass("checked");
    }
    plantAdditionCol.append(additionButton)

    var plantImageCol = $("<div></div>"); //Add plant image
    plantImageCol.addClass("col-3 widgetImage");
    plantImageCol.append('<img class="plantImage" src=' +currentPlant["Photo"] + ' alt="image not available" >' )
    makeUnselectable($('.plantImage'))
    plantWidget.append(plantImageCol);

    var plantCommonNameCol = $("<div></div"); //Add Common Name Column
    plantCommonNameCol.addClass("col-4");
    plantCommonNameCol.append("<span class='commonName'>" + currentPlant["Common Name"][0] +"</span>")
    plantWidget.append(plantCommonNameCol)

    var plantSciNameCol = $("<div></div"); //Add Scientific Name Column
    plantSciNameCol.addClass("col-3");
    plantSciNameCol.append("<span class='sciName'>" + currentPlant["Scientific name"] +"</span>")
    plantWidget.append(plantSciNameCol)

    // var plantInfoCol = $("<div></div>"); //Add plant info
    // plantInfoCol.addClass("col-4");
    // plantWidget.append(plantInfoCol);

    // plantInfoRowName = $("<div></div>"); //add row to plant info for name
    // plantInfoRowName.addClass("row");
    // plantInfoRowName.attr("id","sciName")
    // plantInfoCol.append(plantInfoRowName);

    // plantInfoRowDescription = $("<div></div>"); //add row to plant info for description
    // plantInfoRowDescription.addClass("row");
    // plantInfoCol.append(plantInfoRowDescription);

    // plantName = $("<div></div>"); //add scientific plant name
    // plantName.addClass("col");
    // plantName.append(currentPlant["Scientific name"]);
    // plantInfoRowName.append(plantName)

    // var description = currentPlant["Notes"] //section to truncate the description for the widget
    // trunk_description = getWords(description)
    // if (trunk_description.split(" ").length != description.split(" ").length){
    //     var ellipses = " ..."
    //     trunk_description = trunk_description.concat(ellipses)
    // }

    // plantDescription = $("<div></div>"); //Add truncated description to the widget
    // plantDescription.addClass("col notes");
    // plantDescription.append(trunk_description);
    // plantInfoRowDescription.append(plantDescription);

        
 
      
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

            // buildPlantCard(currentPlant)

        },
        function (){
            
            $(this).removeClass("hovered");
            $(this).addClass("unHovered");
            
            
            plantCard.empty();
            plantCard.append(plantCardDirections)
        } 
    );
}

// function buildPlantCard(currentPlant) {
//     var plantCard_photoRow = $("<div></div>");
//     plantCard_photoRow.addClass("row plantCard_photoRow");
//     plantCard.append(plantCard_photoRow)

//     var plantCard_photoCol = $("<div></div>");
//     plantCard_photoCol.addClass("col plantCard_photoCol")
//     plantCard_photoCol.append('<img class="plantImage" src=' +currentPlant["Photo"] + ' alt="image not available" >' )
//     plantCard_photoRow.append(plantCard_photoCol)
         

//     var plantCard_infoRow = $("<div></div>");
//     plantCard_infoRow.addClass("row plantCard_infoRow");
//     plantCard.append(plantCard_infoRow)
            
//     var plantCard_infoCol = $("<div></div>");
//     plantCard_infoCol.addClass("col plantCard_infoCol")

//     var plantCard_infoCol_sciName = $("<div></div>");
//     plantCard_infoCol_sciName.addClass("row");
//     var plantCard_infoCol_sciName_col = $("<div></div>");
//     plantCard_infoCol_sciName_col.addClass("col");
//     plantCard_infoCol_sciName_col.append('<span class="plantCard_sciName">' + currentPlant["Scientific name"] + '</span>')
//     plantCard_infoCol_sciName.append(plantCard_infoCol_sciName_col)
//     plantCard_infoCol.append(plantCard_infoCol_sciName)

//     var plantCard_infoCol_plantDescription = $("<div></div>");
//     plantCard_infoCol_plantDescription.addClass("row");
//     var plantCard_infoCol_plantDescription_col = $("<div></div>");
//     plantCard_infoCol_plantDescription_col.addClass("col");
//     plantCard_infoCol_plantDescription_col.append('<span class="plantCard_plantDescription">' + currentPlant["Notes"] + '</span>')
//     plantCard_infoCol_plantDescription.append(plantCard_infoCol_plantDescription_col)
//     plantCard_infoCol.append(plantCard_infoCol_plantDescription)
           
//     plantCard_infoRow.append(plantCard_infoCol)


// }

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
        $('#saveQuiz').attr("disabled", true).addClass("noPointer");
        $("#clearButton").attr("disabled", true).addClass("noPointer");

    }
    else{
        $('#saveQuiz').attr("disabled", false).removeClass("noPointer");
        $("#clearButton").attr("disabled", false).removeClass("noPointer");
    }
}
