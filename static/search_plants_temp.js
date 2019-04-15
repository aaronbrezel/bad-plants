var plantCard
var plantCardDirections
var addToQuiz = [] //what the user is going to add. Basically, which boxes are checked

var inTheQuiz = [] //What the user has already added to the quiz
var isDragging = false;

$(document).ready(function () {
   
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

    plantCard = $('#plantCard');
    plantCardDirections = $('#plantCardDirections');

    dumpList(plants) //set initial list

    $('#clearButton').click(function(){
        $('#quizRepoCol').empty();
        $('#quizRepoCol').append('<span id="quizRepoColDirections">Drag plants here to build your quiz</span>')
        addToQuiz = []
        $(".plantWidget").removeClass("checked");
        $(".plantWidget").addClass("unchecked");
        // $('.plantWidget').attr("addable", false).trigger("dataChange");
    })

    // $('.plantWidget').on('dataChange', function(){
    //     console.log("adjust the buttons!")
    // });

    // $('body').mousedown(function(evt){    //architecture to de-select plant widgets on clicks outside the plant list
    //     if($(evt.target).closest('#searchBar').length){
    //         return;
    //     }
    //     if($(evt.target).closest('#clearButton').length){
    //         return;
    //     }
    //     if($(evt.target).closest('#plantList').length){
    //         return;
    //     }
    //     // $('.plantWidget').each(function(){
    //     //     checkTheWidget($(this),"uncheck");
    //     // });
    //     $('.plantCheckbox').prop("checked", false);
    //     $('.plantWidget').removeClass("checked")
    //     $('.plantWidget').addClass("unchecked")
    //     addToQuiz = []                 
    // });
    // $('body').mouseup(function(){
    //     isDragging = false;
    // })
    
    
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
    $.each(addToQuiz, function(i, val){
    //     var checkBoxCol = val.children()[0]
    //     var checkBox = $(checkBoxCol.childNodes[0])
        var divID = "#" + val["plant id"] + ".plantWidget"
        //$(divID).attr("addable", false).trigger("dataChange");
        $(divID).addClass("checked");
        $(divID).removeClass("unchecked");
    //     $("input[value='" + checkBox.val() + "']").prop('checked', true);
    //     $("input[value='" + checkBox.val() + "']").parent().parent().addClass("checked")
    });    

}

function dumpList(plants){
    var plantList = $("<div></div>");
    plantList.addClass("row");
    var plantListCol = $("<div></div>");
    plantListCol.addClass("col");
    plantListCol.attr("id","plantList")
    plantList.append(plantListCol);
    $('#searchResults').append(plantList)
    for (i = 0; i < plants.length; i++){
        //console.log(plants[i])
        buildList(plants[i])
    }
   
}



function buildList(currentPlant){
    //console.log(currentPlant["Photo"])
    var plantWidget = $("<div></div>");
    plantWidget.addClass("row plantWidget");
    
    plantWidget.attr("id", currentPlant["plant id"])
    
    // var plantCheckboxCol = $("<div></div>"); //add checkbox to select plant
    // plantCheckboxCol.addClass("col-1 plantCheckboxCol");
    
    
    // var checkBox = $("<input class= 'plantCheckbox' type='checkbox' name='plant' value='" + currentPlant["plant id"] + "'></input>")
    // checkBox.change(function(){

    //     if($(this).is(':checked')){
    //         checkTheWidget(plantWidget, "check")
           
    //     }
    //     else{
    //         checkTheWidget(plantWidget, "uncheck")
        
    //     }    
    
    // });

    var plantAdditionCol = $("<div></div>");
    plantAdditionCol.addClass("col-2 plantAdditionCol");
    plantWidget.append(plantAdditionCol)
    //plantWidget.attr("addable", true);


    var additionButton = $('<button type="button" class="btn btn-info btn-circle"><i class="fa fa-plus-circle fa-lg" aria-hidden="true"></i></button>')
    plantAdditionCol.append(additionButton)


    //$(checkBox).appendTo(plantCheckboxCol)
    // plantCheckboxCol.append('<input class= "plantCheckbox" type="checkbox" name="plant" value="' + currentPlant["plant id"] + '"></input>')
    //plantWidget.append(plantCheckboxCol);

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

    plantName = $("<div></div>");
    plantName.addClass("col");
    plantName.append(currentPlant["Scientific name"]);
    plantInfoRowName.append(plantName)

    var description = currentPlant["Notes"]
    trunk_description = getWords(description)
    if (trunk_description.split(" ").length != description.split(" ").length){
        var ellipses = " ..."
        trunk_description = trunk_description.concat(ellipses)
    }
    
    

    plantDescription = $("<div></div>");
    plantDescription.addClass("col");
    plantDescription.attr('id', 'notes')
    plantDescription.append(trunk_description);
    plantInfoRowDescription.append(plantDescription)

        
 
      
    $('#plantList').append(plantWidget)
    $('#plantList').append($("<hr>"))

    add_hover_js(plantWidget,currentPlant) //add hover functionality
    add_button_js(plantWidget,currentPlant,additionButton)

    //console.log("Match on " + currentPlant["Scientific name"])
}

function add_button_js(plantWidget,currentPlant,additionButton){
    additionButton.click(function(){
        var divID = "#" + currentPlant["plant id"]
        //console.log($(divID))
        $(divID).addClass("checked")
        $(divID).attr("addable", false).trigger("dataChange");
        $('#quizRepoColDirections').empty();
        generateQuizCard(plantWidget,currentPlant)
        addToQuiz.push(currentPlant)
       
        //clickOrUnclick();
    })


}


function getWords(str) {
    return str.split(/\s+/).slice(0,10).join(" ");
}

function add_hover_js(plantWidget,currentPlant){
    var checkBox = plantWidget.children()[0].childNodes[0]

    plantWidget.hover( 
        function (){
            $(this).removeClass("unHovered");
            $(this).addClass("hovered");
            plantCard.empty();

            buildPlantCard(currentPlant)

        },
        function (){ //THIS NEEDS TO CHANGE WHEN BUTTON FUNCTIONALITY IS ADDED *****************************************************************************************************************
            // if (plantWidget.children()[0].childNodes[0].checked){
            //     //do nothing if checkbock is checked
            // }
            // else{ //remove checked class
            //     $(this).removeClass("checked");
            //     $(this).addClass("unchecked");
            // }
            
            $(this).removeClass("hovered");
            $(this).addClass("unHovered");
            
            
            plantCard.empty();
            plantCard.append(plantCardDirections)
        } 
    );

    // var count
    // plantWidget.mousedown( function () {
        // //generate the dragging cards for all checked plants 
          
        // if(!checkBox.checked){ //temporarility add plant widget to addToQuiz list
        //     addToQuiz.push(plantWidget)
        // }
        // isDragging = true;
        // count = 0;
    // });
    // plantWidget.mouseup( function () {
      
        // if(!checkBox.checked){ //remove temporary plant widget from addToQuiz list
        //     addToQuiz.splice(addToQuiz.length-1,1);
        // }    
        // isDragging = true;
        
    // });

    // plantWidget.mousemove(function(){
        
    //     if (isDragging && count == 0){
    //         console.log("addToQuiz");
    //         //create dragging div
    //         createDraggingIcon(addToQuiz);

            
    //     }
    //     count++;
    // })

}

// function createDraggingIcon(addToQuiz){
//     var dragDiv = $("<div></div>");
//     dragDiv.addClass("dragDiv");

//     //$('.').append(dragDiv);
//     dragDiv.draggable({
//         revert: "invalid"
//     });

    
// }



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

// function checkTheWidget(plantWidget, checkOrUncheck){
//     var checkBox = plantWidget.children()[0].childNodes[0]
  

//     if(checkOrUncheck == "check"){
//         addToQuiz.push(plantWidget)
//         //console.log(plants[checkBox.value-1])
//         plantWidget.removeClass("unchecked")
//         plantWidget.addClass("checked")
//     }
//     else if(checkOrUncheck == "uncheck"){
//         for(i = 0; i < addToQuiz.length; i++){
//             if (addToQuiz[i].attr("id") == checkBox.value){
//                 addToQuiz.splice(i,1)
//             }
//         }
//     }
//     //console.log(addToQuiz)
// }

// function draggables(plantWidget, currentPlant){

//     if (addToQuiz.length == 1){
//         //only drag single card
//         //console.log("single card")
//         //$('#quizRepoCol').append(dragDiv)
//         //plantWidget.append(dragDiv)
        
//         var dragDiv = $("<div></div");
//         dragDiv.addClass("row dragDiv")
//         var dragDiv_photo = $("<div></div");
//         dragDiv_photo.addClass("col");
//         dragDiv_photo.append('<img class="plantImage dragDivImage" src=' +currentPlant["Photo"] + ' alt="image not available" >')
//         dragDiv.append(dragDiv_photo)
//         //plantWidget.append(dragDiv)

//         dragDiv.draggable({
//             revert: "invalid"
//         });

//         $('#quizRepoCol').droppable({
//             accept: $('.dragDiv'),
//             hoverClass: "quizRepoRowOnHover",
//             drop: function (){
//                 generateQuizCard(plantWidget,currentPlant);
//                 $('#quizRepoColDirections').remove();
//                 $('.dragDiv').remove();
//             }

//         });

//     }
//     else{
//         //console.log("multiple cards")
//         for(i = 0; i < addToQuiz.length; i++){
//             temp_div = $("<div></div")
//         }
//     }


//     return dragDiv;
// }

function generateQuizCard(plantWidget,currentPlant){
    var quizDiv = $("<div></div");
        quizDiv.addClass("row quizDiv")
        quizDiv.attr("id", currentPlant["plant id"])
        
        var quizDiv_photo = $("<div></div");
        quizDiv_photo.addClass("col-5")
        quizDiv_photo.append('<img class="plantImage quizDivImage" src=' +currentPlant["Photo"] + ' alt="image not available" >')
        quizDiv.append(quizDiv_photo)

        var quizDiv_name = $("<div></div");
        quizDiv_name.addClass("col-7 quizDivSciName");
        quizDiv_name.append('<span class="quizDivSciName">' + currentPlant["Scientific name"] + '</span>' );
        quizDiv.append(quizDiv_name)


        $('#quizRepoCol').append(quizDiv)
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