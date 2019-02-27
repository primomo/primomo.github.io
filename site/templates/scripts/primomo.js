
angular.module('primomoApp', ['mm.foundation','directive.equalizer','gajus.swing','ngTouch','ngFitText']);

primomoController.$inject = ['$scope', '$element', '$attrs', '$http', '$window'];

angular.module('primomoApp')
	.controller('primomoController', primomoController);

function primomoController($scope, $element, $attrs, $http, $window) {
	    
//    $scope.check_credentials = function () {         
//        var datavalue = $scope.deckArray;
//        var pageIdValue = $scope.pageId;
//        var request = $http({
//            method: "post",
//            url: "/site/templates/stats-update.php/",
//            data: {stats:datavalue,pageid:pageIdValue},
//            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
//        });
//        /* Check whether the HTTP Request is Successfull or not. */
//        // request.success(function (data) {
//        //     $scope.message = "From PHP file : "+data;
//        // });
//    }
  
	    if (typeof $scope.deckArray !== 'undefined') { // check deckArray is defined 
		    // INITIAL VARIABLES 
	        $scope.handEnd = 0;
	        deckArray = $scope.deckArray;

		    $scope.deckArrayTable = angular.copy(deckArray);
	        
	        $scope.totalCards = deckArray.length;
			var handRange = $scope.totalCards;
			$scope.graphCardWidth = 100 / deckArray.length;
			// SHUFFLE AND APPLY ID NUMBER 
			deckArray = shuffle(deckArray,handRange);
			deckArray = numberCards(deckArray,handRange);
			//$scope.deckArrayTable = deckArray;
			// MAKE 1ST HAND
			makeHand();
		}

		
		// MAKE HAND FUNCTION 
		function makeHand(cardWon) {
			// reset
			$scope.handEnd = 0;
			deckArray[0].active = false;
			deckArray[1].active = false;
			deckArray[0].cardAnimation = '';
			deckArray[1].cardAnimation = '';
			$scope.cards = [];
			
			if (handRange == $scope.totalCards) {$scope.roundDisplay = 'firstround';};
												
			if (handRange == 2) {$scope.roundDisplay = 'finalround';};
			
			if (handRange >= 2) {
			deckArray = shuffle(deckArray,handRange);
			var currentHand = [];
			currentHand.push(deckArray[0]);
			currentHand.push(deckArray[1]);
			deckArray[0].active = true; deckArray[0].gamePlays += 1;
			deckArray[1].active = true; deckArray[1].gamePlays += 1;
			currentHand[0].cardSide = 'left';
			currentHand[0].cardAnimation = 'animated bounceInUp';
			currentHand[1].cardSide = 'right';
			currentHand[1].cardAnimation = 'animated bounceInUp';
			$scope.cards = currentHand;
			$scope.deckArray = deckArray;
			handRange--;
			} else if (handRange == 1) {				
				
			//WINNER
			$scope.message = deckArray[0].name;
			$scope.messageAnimation = 'animated bounceInLeft';

			//TABLE UPDATE
			deckArray = updateTable(deckArray);
			if (cardWon == 'left') {
				deckArray[0].winner = 'winner'; 
			}
			if (cardWon == 'right') {
				deckArray[0].winner = 'winner'; 
			}
			
			
			//AJAX SEND STATS
			var datavalue = $scope.deckArray;
	        var pageIdValue = $scope.pageId;
	        var request = $http({
	            method: "post",
	            url: "/site/templates/stats-update.php/",
	            data: {stats:datavalue,pageid:pageIdValue},
	            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
	        });
	        
	        
			// GOOGLE ANALYTICS EVENT
			$scope.trackGamePlayed = function() {
			  if (!$window.ga) {
				  return;
				  }
			  $window.ga('send', {
				hitType: 'event',
				eventCategory: 'Game',
				eventAction: 'played',
				eventLabel: $scope.gameArray[0].title
				});
			}
			$scope.trackGamePlayed();
			

			$scope.roundDisplay = 'game-over';
			$scope.handEnd = 1;

			var currentHand = [];
			currentHand.push(deckArray[0]);
			currentHand.push(deckArray[1]);
			//deckArray[0].active = true;
			currentHand[1] = {};
			currentHand[0].cardSide = 'right';
			currentHand[0].cardAnimation = 'animated bounceInRight';
			currentHand[1].cardSide = 'left hidden';
			$scope.cards = currentHand;
			$scope.deckArray = deckArray;
			$scope.deckArrayTable = deckArray;
			
			handRange--;
			
			}
		}
		
		
		//MOVE LOSING CARD TO END OF ARRAY 
		function moveLoser(cardWon) {
			if (cardWon == 'left') {
				deckArray[0].gameWins += 1;
				deckArray[1].discarded = true;
				arraymove(deckArray,1,$scope.totalCards-1);
				//console.log('moveLoser left');
			}
			if (cardWon == 'right') {
				deckArray[1].gameWins += 1;
				deckArray[0].discarded = true;
				arraymove(deckArray,0,$scope.totalCards-1);
				//console.log('moveLoser right');
			}
		}
        
        
		function nextHand(cardWon) {
			if (cardWon == 'left') {
				//console.log('left wins');
				$scope.deckArray[1].discarded = true;
			} else {
				//console.log('right wins');
				$scope.deckArray[0].discarded = true;
			};
			$scope.deckArray[0].active = false;
			$scope.deckArray[1].active = false;
			
			if (handRange < $scope.totalCards && handRange > 2) {$scope.roundDisplay = 'midround';};
			if (handRange == 1) {$scope.roundDisplay = 'finalroundover';};

			setTimeout(function(){
			$scope.cards = [];
	        $scope.$digest();
			moveLoser(cardWon);
			makeHand(cardWon);
	        $scope.$digest();
			}, 750);
        }
        
        


		// INPUT - CARD DISCARDED
        $scope.throwoutleft = function (eventName, eventObject, card) {
	    if ($scope.handEnd == 1) return;
	    $scope.handEnd = 1;
		if (card.cardSide == 'left') 
	    	{var cardPicked = 'LEFT';
			var cardWon = 'right';
		    $scope.cards[1].cardAnimation = "animated bounceOutDown";} 
	    else 
	    	{var cardPicked = 'RIGHT';
			var cardWon = 'left';
			$scope.cards[0].cardAnimation = "animated bounceOutDown";};
        //console.log(cardPicked + ' CARD DISCARDED');
		nextHand(cardWon);
        };
        
		// INPUT - CARD KEPT
        $scope.throwoutright = function (eventName, eventObject, card) {
	    if ($scope.handEnd == 1) return;
	    $scope.handEnd = 1;
    	if (card.cardSide == 'left') 
	    	{var cardPicked = 'left';
		    $scope.cards[1].cardAnimation = "animated bounceOutUp";} 
	    else 
	    	{var cardPicked = 'right';
			$scope.cards[0].cardAnimation = "animated bounceOutUp";};
        //console.log(cardPicked + ' CARD KEPT');
        var cardWon = cardPicked;
        nextHand(cardWon);
        };
		
		// INPUT - CARD CLICKED         
        $scope.cardclick = function (eventObject, card) {
		    ////console.log('CLICK', eventObject);
		    if (eventObject.type == "click") { 
			    if ($scope.clickProtect == 0) return;
			}
			if ($scope.cards[0].flipped === true || $scope.cards[1].flipped === true) {
			$scope.cards[0].flipped = false;
			$scope.cards[1].flipped = false;
			return;
			}
			
			if ($scope.handEnd == 1) return;
			$scope.handEnd = 1;
	    	if (card.cardSide == 'left') 
		    	{var cardPicked = 'left';
			    $scope.cards[1].cardAnimation = "animated bounceOutUp";} 
		    else 
		    	{var cardPicked = 'right';
				$scope.cards[0].cardAnimation = "animated bounceOutUp";};
            //console.log(cardPicked + ' CARD KEPT - CLICKED');
            card.cardAnimation = "animated bounceOutDown";
            var cardWon = cardPicked;
            nextHand(cardWon);
        };
        
		// INPUT - DRAG START 
        $scope.dragstart = function (eventName, eventObject, card) {
            ////console.log('dragstart', eventObject);
            //card.cardAnimation = "";       
            $scope.clickProtect = 1;
    	};
    	
		// INPUT - DRAGGED 
        $scope.dragmove = function (eventName, eventObject, card) {
	        ////console.log('dragmove', eventObject)
			$scope.cards[0].flipped = false;
			$scope.cards[1].flipped = false;
	        //$scope.message = 'dragged';
	        card.cardAnimation = "";       
            $scope.clickProtect = 0;

            throwOutConfidenceElements = {};
            throwOutConfidenceElements.yes = eventObject.target.querySelector('.yes').style;
	        throwOutConfidenceElements.no = eventObject.target.querySelector('.no').style;
	        throwOutConfidenceElements[eventObject.throwDirection == gajus.Swing.Card.DIRECTION_DOWN ? 'yes' : 'no'].opacity = eventObject.throwOutConfidence;
	        throwOutConfidenceElements[eventObject.throwDirection == gajus.Swing.Card.DIRECTION_DOWN ? 'no' : 'yes'].opacity = 0;
	        //eventObject.target.querySelector('.cardinfo').style.opacity = 1 - eventObject.throwOutConfidence;
	        
	        if (card.cardSide == 'left') { otherCardObject = eventObject.target.nextElementSibling };
	        if (card.cardSide == 'right') { otherCardObject = eventObject.target.previousElementSibling };	        
			throwOutConfidenceElementsOther = {};
            throwOutConfidenceElementsOther.no = otherCardObject.querySelector('.yes').style;
	        throwOutConfidenceElementsOther.yes = otherCardObject.querySelector('.no').style;
	        //throwOutConfidenceElementsOther[eventObject.throwDirection == gajus.Swing.Card.DIRECTION_DOWN ? 'yes' : 'no'].opacity = eventObject.throwOutConfidence;
	        //throwOutConfidenceElementsOther[eventObject.throwDirection == gajus.Swing.Card.DIRECTION_DOWN ? 'no' : 'yes'].opacity = 0;
	        
	        //otherCardObject.querySelector('.cardinfo').style.opacity = 1 - eventObject.throwOutConfidence;
	        
            eventObject.target.style.zIndex = 99999;
            otherCardObject.style.zIndex = 77777;
            otherCardObject.style.pointerEvents = "none";
            
	        $scope.$digest();
        };

		// INPUT DRAG END 
        $scope.dragend = function (eventName, eventObject, card) {
            ////console.log('dragend', eventObject)
			//$scope.message = 'XXXX';
            $scope.clickProtect = 0;
            throwOutConfidenceElements = {};
	        if (eventObject.throwOutConfidence != 1) {
			    throwOutConfidenceElements.yes = eventObject.target.querySelector('.yes').style;
		        throwOutConfidenceElements.no = eventObject.target.querySelector('.no').style;
	            throwOutConfidenceElements.yes.opacity = 0;
	            throwOutConfidenceElements.no.opacity = 0;
	            
	            if (card.cardSide == 'left') { otherCardObject = eventObject.target.nextElementSibling };
		        if (card.cardSide == 'right') { otherCardObject = eventObject.target.previousElementSibling };
		        throwOutConfidenceElementsOther = {};	    	    		
		        throwOutConfidenceElementsOther.no = otherCardObject.querySelector('.yes').style;
		        throwOutConfidenceElementsOther.yes = otherCardObject.querySelector('.no').style;
	            throwOutConfidenceElementsOther.yes.opacity = 0;
	            throwOutConfidenceElementsOther.no.opacity = 0;
	            
				//eventObject.target.querySelector('.cardinfo').style.opacity = 1;
				//otherCardObject.querySelector('.cardinfo').style.opacity = 1;
	        
				otherCardObject.style.pointerEvents = "auto";
	        
	        	$scope.$digest();
	            
	        }
	    };
	    
	    // INPUT CLICK INFO
		$scope.cardInfo = function(eventObject, card) {
			if (eventObject.type == "click") { 
			    if ($scope.clickProtect == 0) return;
			}
			if (card.flipped === true) {
				card.flipped = false;
			} else {
				card.flipped = true;
			}
		}
        
    };


function updateTable(array) {
  var currentIndex = array.length;
  while (0 !== currentIndex) {
    currentIndex -= 1;
	array[currentIndex].wins = array[currentIndex].wins + array[currentIndex].gameWins;
	array[currentIndex].plays = array[currentIndex].plays + array[currentIndex].gamePlays;
  }
  return array;
}

function numberCards(array) {
  var currentIndex = array.length;
  while (0 !== currentIndex) {
    currentIndex -= 1;
	array[currentIndex].number = currentIndex;
  }
  return array;
}

function shuffle(array,range) {
  var currentIndex = range, temporaryValue, randomIndex ;
  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
}

function arraymove(arr, fromIndex, toIndex) {
    var element = arr[fromIndex];
    arr.splice(fromIndex, 1);
    arr.splice(toIndex, 0, element);
}



// MODAL OPEN CONTROLLER 
ModalCtrl.$inject = ['$scope', '$modal', '$log'];
angular.module('primomoApp')
	.controller('ModalCtrl', ModalCtrl);
function ModalCtrl($scope, $modal, $log) {
  $scope.modalTemplate = '';
  $scope.open = function () {
    var modalInstance = $modal.open({
      template: $scope.modalTemplate,
      windowClass: 'small'
    });
  };
};
