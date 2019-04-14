var plantCard
var plantCardDirections
var addToQuiz = [] //what the user is going to add. Basically, which boxes are checked

var inTheQuiz = [] //What the user has already added to the quiz

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

    $('body').mouseup( function() {
        $('#quizRepoRow').css("background-color", "yellowgreen");
        $('#quizRepoRow').css("color", "grey");

    })

    $('body').mousedown(function(evt){    //architecture to de-select plant widgets on clicks outside the plant list
        if($(evt.target).closest('#searchBar').length){
            return;
        }
        if($(evt.target).closest('#clearButton').length){
            return;
        }
        if($(evt.target).closest('#plantList').length){
            return;
        }
        // $('.plantWidget').each(function(){
        //     checkTheWidget($(this),"uncheck");
        // });
        $('.plantCheckbox').prop("checked", false);
        $('.plantWidget').removeClass("checked")
        $('.plantWidget').addClass("unchecked")
        addToQuiz = []                 
    });
    
    
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
        var checkBoxCol = val.children()[0]
        var checkBox = $(checkBoxCol.childNodes[0])
        console.log(checkBox.val())
        // checkBox.checked = true;
        
        $("input[value='" + checkBox.val() + "']").prop('checked', true);
        $("input[value='" + checkBox.val() + "']").parent().parent().addClass("checked")
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
    
    var plantCheckboxCol = $("<div></div>"); //add checkbox to select plant
    plantCheckboxCol.addClass("col-1 plantCheckboxCol");
    
    
    var checkBox = $("<input class= 'plantCheckbox' type='checkbox' name='plant' value='" + currentPlant["plant id"] + "'></input>")
    checkBox.change(function(){

        if($(this).is(':checked')){
            checkTheWidget(plantWidget, "check")
        }
        else{
            checkTheWidget(plantWidget, "uncheck")
        }    
    
    });
    $(checkBox).appendTo(plantCheckboxCol)
    // plantCheckboxCol.append('<input class= "plantCheckbox" type="checkbox" name="plant" value="' + currentPlant["plant id"] + '"></input>')
    plantWidget.append(plantCheckboxCol);

    var plantImageCol = $("<div></div>"); //Add plant image
    plantImageCol.addClass("col-4 widgetImage");
    plantImageCol.append('<img class="plantImage" src=' +currentPlant["Photo"] + ' alt="image not available" >' )
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

    add_hover_js(plantWidget,currentPlant)
   
    //console.log("Match on " + currentPlant["Scientific name"])
}


function getWords(str) {
    return str.split(/\s+/).slice(0,10).join(" ");
}

function add_hover_js(plantWidget,currentPlant){
    var tempCheck = false;
    var checkBox = plantWidget.children()[0].childNodes[0]

    plantWidget.hover( 
        function (){
            $(this).removeClass("unchecked");
            $(this).addClass("checked");
            plantCard.empty();

            buildPlantCard(currentPlant)

            
            

        },
        function (){
            if (plantWidget.children()[0].childNodes[0].checked){
                //do nothing if checkbock is checked
            }
            else{ //remove checked class
                $(this).removeClass("checked");
                $(this).addClass("unchecked");
            }    
            
            
            plantCard.empty();
            plantCard.append(plantCardDirections)
        } 
    );
    plantWidget.mousedown( function () {
        //generate the dragging cards for all checked plants 
          
        
        $('#quizRepoRow').css("background-color", "green");
        $('#quizRepoRow').css("color", "white");

        if(!checkBox.checked){
            checkBox.checked = true; //temporarily check the box
            checkTheWidget(plantWidget, "check") //add the widget to add to quiz array
            tempCheck = true; //indicate that this is a temporary assignment
            
        }

        if (addToQuiz.length == 1){
            //only drag single card
            console.log("single card")
            var dragDiv = $("<div></div");
            dragDiv.addClass("draggingDiv");
            $('#quizRepoCol').append(dragDiv)
            dragDiv.draggable({
                revert: "invalid"
            });
        }
        else{
            console.log("multiple cards")
            for(i = 0; i < addToQuiz.length; i++){
                temp_div = $("<div></div")
            }
        }
        
    });
    plantWidget.mouseup( function () {
        
        $('#quizRepoRow').css("background-color", "yellowgreen");
        $('#quizRepoRow').css("color", "grey");
        
        if(checkBox.checked && tempCheck){ //if the box is checked and it was a temporary assignment 
            checkBox.checked = false; //uncheck the box
            checkTheWidget(plantWidget, "uncheck") //remove the widget from the quiz array
            tempCheck = false;
         
        }

        
    });

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

function checkTheWidget(plantWidget, checkOrUncheck){
    var checkBox = plantWidget.children()[0].childNodes[0]
  

    if(checkOrUncheck == "check"){
        addToQuiz.push(plantWidget)
        plantWidget.removeClass("unchecked")
        plantWidget.addClass("checked")
    }
    else if(checkOrUncheck == "uncheck"){
        for(i = 0; i < addToQuiz.length; i++){
            if (addToQuiz[i].attr("id") == checkBox.value){
                addToQuiz.splice(i,1)
            }
        }
    }
    console.log(addToQuiz)
}