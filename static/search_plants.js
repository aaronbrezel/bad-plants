var plantCard
var plantCardDirections
var addToQuiz = [] //what the user is going to add. Basically, which boxes are checked

var inTheQuiz = []


$(document).ready(function () {
    for(i=0; i < plants.length; i++){ //This adds an extra key to each plant object which will indicate whether they have been selected for the quiz
        plants[i].selected = false;
    }

    plantCard = $('#plantCard');//binds plant card element to a variable
    plantCardDirections = $('#plantCardDirections'); //binds plant card directions to a variable

    dumpList(plants) //build the initial list of plants

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
        additionButton = $('<button type="button" class="btn btn-info btn-circle"><i class="fa fa-plus-circle fa-lg" aria-hidden="true"></i></button>')
    }
    else if (currentPlant.selected == true){
        additionButton = $('<button type="button" class="btn btn-info btn-circle xButton"><i class="fa fa-times fa-lg" aria-hidden="true"></i></button>')
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
    plantInfoRowDescription.append(plantDescription)

        
 
      
    $('#plantList').append(plantWidget) //add widget to the page
    $('#plantList').append($("<hr>"))


    add_hover_js(plantWidget,currentPlant) //add hover functionality

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