var plantCard
var plantCardDirections

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
    $(document).on("click", function (){
        console.log($(this).attr('class'));
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
    //jQuery.data(plantWidget, "plant_id", {id: currentPlant["plant id"]})
    
    
    var plantCheckboxCol = $("<div></div>"); //add checkbox to select plant
    plantCheckboxCol.addClass("col-1 plantCheckboxCol");
    plantCheckboxCol.append('<input class= "plantCheckbox" type="checkbox" name="plant" value="' + currentPlant["plant id"] + '"></input>')
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
    // $(".plantWidget").draggable( {
    //     revert: "invalid"
    // });

    plantWidget.hover( 
        function (){
            $(this).addClass("hoverOnDraggable");
            plantCard.empty();

            buildPlantCard(currentPlant)

            
            

        },
        function (){
            $(this).removeClass("hoverOnDraggable");
            plantCard.empty();
            plantCard.append(plantCardDirections)
        } 
    );
    plantWidget.mousedown( function () {
        


        
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