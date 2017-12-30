//JavaScript file for Concentration game
//For IPND Capstone Project
//by Evan Nordquist 
//Dec 29, 2017

//*********************//
//List of all the cards//
//*********************//
var cards = [
	"fa-diamond",
	"fa-diamond",
	"fa-paper-plane-o",
	"fa-paper-plane-o",
	"fa-anchor",
	"fa-anchor",
	"fa-bolt",
	"fa-bolt",
	"fa-cube",
	"fa-cube",
	"fa-leaf",
	"fa-leaf",
	"fa-bicycle",
	"fa-bicycle",
	"fa-bomb",
	"fa-bomb"
];

//*********************//
//Non-Card Variables   //
//*********************//

var numCardsOpen = 0; //Counts cards chosen so limit the player to two choices at a time.
var cardItem;	//The card chosen.
var cardClass;	//The cards class i.e. fa fa-paper-plane-o.
var cardID;		//The chosen card's location on the 4x4 grid.
var cardChoice1;//Card1 class
var cardChoice2;//Card2 class
var cardChoice1ID;//Card1 location in the grid
var cardChoice2ID;//Card2 location in the grid
var moves = 0;//How many moves (of two selections) have been made in the game.
var matches = 0;//How many successful pairs were found.
var scoreboardMoves = $('.movesTaken'); //To easily substitute in the current moves taken.
var modal = $('#myModal');//Selecting the Modal element (the "congrats message" at the end).


//****************//
//Helper Functions//
//****************//

function shuffle(array) {
	//Display the cards on the page
	//Shuffle function from http://stackoverflow.com/a/2450976
    var currentIndex = array.length, temporaryValue, randomIndex;
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}

function nextRound() {
	//Upkeep phase, turning cards back over, resetting numCardsOpen to zero
	numCardsOpen = 0;
	$('.open').removeClass('open');
	$('.show').removeClass("show");
	console.log("moves: "+moves);
}

function scoreboardUpdate() {
	//Update the scoreboard with the most recent move totals
	moves = moves + 1;
	scoreboardMoves.text(moves);
}

function updateCongratsMessage() {
	//When the game is over, update the #gratsText element with a customized message
	var tempMessage = $('#gratsText');
	tempMessage.text("Congrats! You won! Your only took " + moves +" moves!");
}

function checkGameStatus() {
	//Whenever a match is found, check to see if you are at 8 matches (all complete).
	//If matches === 8, unhide the modal.
	//if not, keep playing as normal.
	if (matches === 8){
		updateCongratsMessage()
		modal.css("display", "block");
	} else {
		//console.log("not finished yet");
	}
}


function checkPairStatus() {
	//After you have two cards selected check to see if they are a pair
	//First, make sure they didn't just pick the same exact card twice (id's have to be different)
	//If you have a match, increment the matches variable, update the scoreboard, check to see if the game is over.
	if (cardChoice1ID != cardChoice2ID){
		console.log("Since there are now 2 choices, they are:")
		console.log(cardChoice1);
		console.log(cardChoice2);
			if (cardChoice1 === cardChoice2) {
			console.log("ITS A MATCH!");
			scoreboardUpdate();
			$('.open').addClass('match');
			matches = matches + 1;
			console.log("matches: " +matches);
			nextRound();
			checkGameStatus();
			}
		else {
			//If the two cards are not a match, update the scoreboard.
			//Give the user a brief chance to see the mismatched pair.
			//reset the cards with the nextRound() function.
			console.log("It's not a match!");
			scoreboardUpdate();
			setTimeout(function(){
				nextRound();},700);
			};
		}
	else {
		//If the user clicked the same card twice, it is not a pair, even though both 'choices' have the same class name.
		//If the second card has the same ID, it is not cointed, the number of selections remains at 1.
		//The game continues as if you had not yet selected your second card. 
		console.log("You can't pick the same card!");
		numCardsOpen = 1;
	};
}


//****************//
//Main Game Logic*//
//****************//

//Shuffle the list of cards using the provided "shuffle" method above
shuffle(cards);

//Loop through each card and create its HTML
//Add each card's HTML to the page
for (var i = cards.length - 1; i >= 0; i--) {
	$('.deck').append('<li class = "card"><i id = '+i+' class="fa '+cards[i]+'"></i></li>');
};

// set up the event listener for a card. 
$('.deck').on('click', '.card', function(evt){
	if (numCardsOpen >=2){
		console.log("You can't select more than 2 cards");
	}
	else {
		//while the cards chosen is 2 or less
		$(evt.target).addClass("show open");//adds classes show and open
		cardsItem = $(this).children();
		cardClass = cardsItem.prop("class");//so we can later check the class name of the card
		cardsItem = $(this).children();
		cardID = cardsItem.prop("id");//because we need to distinguish between the two cards of each class name
		//different actions depending on how many cards are already flipped open.
		if (numCardsOpen ===0) {
			//if there weren't any cards already flipped
			cardChoice1 = cardClass; //note the class 
			cardChoice1ID = cardID; //note the position in the grid (so that you can't click the same card twice!)
			//console.log("CardChoice1 is: "+ cardClass);
			//console.log("CardChoice1ID is: "+ cardChoice1ID);
			numCardsOpen = numCardsOpen +1;
			//console.log("The number of cards chosen is: "+ numCardsOpen);
			//checkPairStatus();
		}
		else if (numCardsOpen === 1) {
			cardChoice2 = cardClass;
			cardChoice2ID = cardID;
			//console.log("CardChoice2 is: "+ cardClass);
			//console.log("CardChoice2ID is: "+ cardChoice2ID);
			numCardsOpen = numCardsOpen +1;
			//console.log("The number of cards chosen is: "+ numCardsOpen);
			checkPairStatus();
		}
		else {
			console.log("test to make sure you can't have more than2 cards open.");
		}
	}
});

$(".restart").on('click', function(){
	location.reload();
});

//var modal = $('#myModal');
//var btn = $('#myBtn')
var span = $('.close');
/*btn.on('click', function() {
	console.log("button was pressed");
	location.reload();
	//modal.css("display", "block");
});
*/

//Closing (or rather hiding, the modal when you click the 'X' button)
span.on('click', function() {
	console.log("modal close button was pressed");
	modal.css("display", "none");
});