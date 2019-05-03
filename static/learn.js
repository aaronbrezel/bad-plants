$(document).ready(function () {

    
    var quizName = quiz.quiz_name
    $('#quizTitleCol').append("<span id='quizTitle'>" + quizName + "</span>")
    $("#takeQuizCol").append('<button type="button" class="btn btn-success btn-sm btn-block" id="takeQuiz">Take quiz</button>')
    $("#takeQuiz").click(function(){
            var url = "/quiz/"
            var id = quiz.quiz_id.toString()
            window.location.href = url.concat(id)
    })
    var quizPlants = quiz.quiz_plants
    
    

    buildPlantCards(quizPlants)

});

function buildPlantCards(plants){
    var plantCardBox = $('#plantCardBox') //a row to house all of the plant card columns
    console.log(plants)
    for(i=0;i<plants.length;i++){
        var plant = plants[i]
        var plantCard = $("<div class='col-4 plantCard'></div>")

        //HTML for plant name
        var plantCardNameRow = $("<div class='row plantCardNameRow'></div>")
        plantCard.append(plantCardNameRow)
        plantCardNameCol = $("<div class='col plantCardNameCol'></div>")
        plantCardNameRow.append(plantCardNameCol)
        plantCardNameCol.append("<span class='plantName'>" + plant["Scientific name"] + "</span>")

        //HTML for plant Image
        var plantCardImageRow = $("<div class='row plantCardImageRow'></div>")
        plantCard.append(plantCardImageRow)
        plantCardImageCol = $("<div class='col plantCardImageCol'></div>")
        plantCardImageRow.append(plantCardImageCol)
        plantCardImageCol.append('<img class="plantImage" src=' + plant["Photo"] + ' alt="image not available" >')

        //HTML for plant Description
        var plantCardDescriptionRow = $("<div class='row plantCardDescriptionRow'></div>")
        plantCard.append(plantCardDescriptionRow)
        plantCardDescriptionCol = $("<div class='col plantCardDescriptionCol'></div>")
        plantCardDescriptionRow.append(plantCardDescriptionCol)
        plantCardDescriptionCol.append("<span class='plantDescription'>" + plant["Notes"] + "</span>")


        plantCardBox.append(plantCard)

    }


}