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
    add_hover_js()
}



function buildList(currentPlant){
    //console.log(currentPlant["Photo"])
    var plantWidget = $("<div></div>");
    plantWidget.addClass("row plantWidget");
    // var plantWidget = $("<div></div>");
    // plantWidget.addClass("col plantWidget");
    // newRow.append(plantWidget);

    var plantImageCol = $("<div></div>"); //Add plant image
    plantImageCol.addClass("col-6");
    plantImageCol.append('<img class="plantImage" src=' +currentPlant["Photo"] + ' alt="image not available" >' )
    plantWidget.append(plantImageCol);

    var plantInfoCol = $("<div></div>"); //Add plant info
    plantInfoCol.addClass("col-6");
    plantWidget.append(plantInfoCol);

    plantInfoRowName = $("<div></div>"); //add row to plant info for name
    plantInfoRowName.addClass("row");
    plantInfoRowName.attr("id","sciName")
    plantInfoCol.append(plantInfoRowName);

    plantInfoCol.append($("<br>"));

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

    add_hover_js()
    //console.log("Match on " + currentPlant["Scientific name"])
}


function getWords(str) {
    return str.split(/\s+/).slice(0,30).join(" ");
}

function add_hover_js(){
    // $(".plantWidget").draggable( {
    //     revert: "invalid"
    // });

    $(".plantWidget").hover( 
        function (){
            $(this).addClass("hoverOnDraggable");
            plantCard.empty();
            //console.log($(".plantWidget").children())


        },
        function (){
            $(this).removeClass("hoverOnDraggable");
            plantCard.empty();
            plantCard.append(plantCardDirections)
        } 
    );
    $(".plantWidget").mousedown( function () {
        


        console.log("clicked")
    });
}


