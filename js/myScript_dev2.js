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
var isTimerRunning = false;
var timerExperiment; //to take a snapshot of the timer when the game ends.
var starKeeper; // Controls when the stars dissapear from the scoreboard.
var starNumKeeper = 3; //Keeps a running count of the stars.
var span = $('.close'); //The 'X' button to close the modal.


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
	//Upkeep phase, turning cards back over, resetting numCardsOpen to zero.
	numCardsOpen = 0;
	$('.open').removeClass('open');
	$('.show').removeClass("show");
	console.log("moves: "+moves);
}

function scoreboardUpdate() {
	//Update the scoreboard with the most recent move totals, and periodically remove "stars".
	moves = moves + 1;
	scoreboardMoves.text(moves);
	//At intervals of 16, 20, and 25 moves, a star is removed from the player's scoreboard.
	if (moves === 16){
		starKeeper = $('#star1');
		starKeeper.remove();
		starNumKeeper = starNumKeeper -1;
	} else if (moves === 20){
		starKeeper = $('#star2');
		starKeeper.remove();
		starNumKeeper = starNumKeeper -1;
	} else if (moves === 25){
		starKeeper = $('#star3');
		starKeeper.remove();
		starNumKeeper = starNumKeeper -1;
	} else {
		//carry on
	}
}

function updateCongratsMessage() {
	//When the game is over, update the #gratsText element with a customized message
	var tempMessage1 = $('#gratsText1');
	var tempMessage2 = $('#gratsText2');
	tempMessage1.text("Your only took " + moves +" moves and " + timerExperiment + " seconds to complete it!");
	tempMessage2.text("Your star rating for this round is " + starNumKeeper + '!');
}

function checkGameStatus() {
	//Whenever a match is found, check to see if you are at 8 matches (all complete).
	//If matches === 8, unhide the modal.
	//If not, keep playing as normal.
	if (matches === 8){
		updateCongratsMessage()
		modal.css("display", "block");
	} else {
		//console.log("not finished yet");
	}
}

function checkPairStatus() {
	//After you have two cards selected, check to see if they are a pair.
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
			} else {
			//If the two cards are not a match, update the scoreboard.
			//Give the user a brief chance to see the mismatched pair.
			//reset the cards with the nextRound() function.
			console.log("It's not a match!");
			scoreboardUpdate();
			setTimeout(function(){
				nextRound();
			},700);
			}
	} else {
		//If the user clicked the same card twice, it is not a pair, even though both 'choices' have the same class name.
		//If the second card has the same ID, it is not cointed, the number of selections remains at 1.
		//The game continues as if you had not yet selected your second card. 
		console.log("You can't pick the same card!");
		numCardsOpen = 1;
		};
}

function startTheTimer() {
	//If the timer is not running, start it.
	//If the timer is running leave it be.
	if (isTimerRunning === false){
		isTimerRunning = true;
		timerMechanism();
	} else {
		//All is well.
	};
}


function timerMechanism() {
	//timerMechanism code as per Udacity Project Reviewers suggested method
	const game_start_time = new Date().getTime(); // get the current time when user clicked the first card
	timer = setInterval(function(){
		let current_time = new Date().getTime();
		let current_time_played = current_time - game_start_time;
		let hrs = Math.floor((current_time_played % (1000 * 60 * 60 * 24))/ (1000 * 60 * 60));
		let mins = Math.floor((current_time_played % (1000 * 60 * 60))/ (1000 * 60));
		let secs = Math.floor((current_time_played % (1000 * 60))/ 1000);
		time_value = hrs + ' hours ' + mins + ' mins ' + secs + ' secs ';
		if (secs <10) {
			secs = '0' + secs;
		}
		current_time_played = hrs + ':' + mins + ':' + secs;
		$(".time-played").text(current_time_played);
		timerExperiment = current_time_played;
	}, 500);
};

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
	startTheTimer(); //Start the timer, the first time a card is clicked.
	var starsCompilation = $('.stars').find('li');
	console.log(starsCompilation);
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
			console.log("test to make sure you can't have more than 2 cards open.");
		}
	}
});

$(".close").on('click', function() {
	//Closing (or rather hiding) the modal when you click the 'X' button)
	console.log("modal close button was pressed");
	modal.css("display", "none");
});

$(".restart").on('click', function(){
	//Clicking anything with class 'restart' (above the game board, or inside the modal)
	//Causes the page to reload (resetting all variables and timers).
	location.reload();
});
