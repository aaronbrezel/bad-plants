$(document).ready(function () {

    
    var quizName = quiz.quiz_name
    $("#backtoQuizzesCol").append('<button type="button" class="btn btn-warning btn-sm btn-block" id="backButton">Back to quiz list</button>')
    $('#quizTitleCol').append("<span id='quizTitle'>" + quizName + "</span><br>")
    $('#quizTitleCol').append("<span id='learnDirections'>Mouse over the plant images to reveal their names</span>")
    $("#takeQuizCol").append('<a id="quizButton" data-fancybox data-src="#pickQuizType" href="javascript:;"><button type="button" class="btn btn-success btn-sm btn-block" id="takeQuiz">Take quiz</button></a>')
    
    $("#sciNames").click(function(){      
        var url = "/quiz/"
        var id = quiz.quiz_id.toString()
        var sciNames = "/scinames"
        fullURL = url.concat(id,sciNames)
        window.location.href = fullURL
        
    
    })
    $("#comNames").click(function(){
        var url = "/quiz/"
        var id = quiz.quiz_id.toString()
        var sciNames = "/comnames"
        fullURL = url.concat(id,sciNames)
        window.location.href = fullURL
    })
    
   
    $("#backButton").click(function(){
        var url = "/pre_fabs"
        window.location.href = url
    })
    var quizPlants = quiz.quiz_plants
    
    

    buildPlantCards(quizPlants)

});

function buildPlantCards(plants){
    var plantCardBox = $('#plantCardBox') //a row to house all of the plant card columns
    
    for(i=0;i<plants.length;i++){
        var plant = plants[i]
        
        //flip card js lifted with much thanks from https://www.w3schools.com/howto/howto_css_flip_card.asp
        var plantCard = $("<div class='col-5'></div>")
        var flipCard = $("<div class='flip-card'></div>")
        plantCard.append(flipCard)
        var flipCardInner = $("<div class='flip-card-inner'></div>")
        flipCard.append(flipCardInner)
        var flipCardFront = $("<div class='flip-card-front'></div>")
        flipCardFront.append('<img class="plantImage" src=' + plant["Photo"] + ' alt="image not available" >')
        flipCardInner.append(flipCardFront)
        var flipCardBack = $("<div class='flip-card-back'></div>")
        

        if (plant["Common Name"].length > 1) {
            var commonName = "Common Names:"
        }
        else {
            var commonName = "Common Name:"
        }
        
        var Names = plant["Common Name"].join(", ")

        console.log(Names)
        
        flipCardBack.append("<h2>Scientific name:</h2> <span class='sciName'>" + plant["Scientific name"] + "</span>")
        flipCardBack.append("<h2>" + commonName + "</h2> <span class='comName'>" + Names + "</span>")
        flipCardInner.append(flipCardBack)
        
        
        plantCardBox.append(plantCard)


    }


}




        // var plant = plants[i]
        // var plantCard = $("<div class='col-4 plantCard'></div>")

        // //HTML for plant name
        // var plantCardNameRow = $("<div class='row plantCardNameRow'></div>")
        // plantCard.append(plantCardNameRow)
        // plantCardNameCol = $("<div class='col plantCardNameCol'></div>")
        // plantCardNameRow.append(plantCardNameCol)
        // plantCardNameCol.append("<span class='plantName'>" + plant["Scientific name"] + "</span>")

        // //HTML for plant Image
        // var plantCardImageRow = $("<div class='row plantCardImageRow'></div>")
        // plantCard.append(plantCardImageRow)
        // plantCardImageCol = $("<div class='col plantCardImageCol'></div>")
        // plantCardImageRow.append(plantCardImageCol)
        // plantCardImageCol.append('<img class="plantImage" src=' + plant["Photo"] + ' alt="image not available" >')

        // //HTML for plant Description
        // var plantCardDescriptionRow = $("<div class='row plantCardDescriptionRow'></div>")
        // plantCard.append(plantCardDescriptionRow)
        // plantCardDescriptionCol = $("<div class='col plantCardDescriptionCol'></div>")
        // plantCardDescriptionRow.append(plantCardDescriptionCol)
        // plantCardDescriptionCol.append("<span class='plantDescription'>" + plant["Notes"] + "</span>")


        // plantCardBox.append(plantCard)