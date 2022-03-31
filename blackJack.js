import {Deck} from "./deck.js" 

const VALUE_MAP = {
    "2": 2,
    "3": 3,
    "4": 4,
    "5": 5,
    "6": 6,
    "7": 7,
    "8": 8,
    "9": 9,
    "10": 10,
    "j": 10,
    "q": 10,
    "k": 10,
    "a": 11
  }

/**
* Initiates the global variables and adds clickEventListener to playerButtons
*/
function start() {
    hideWinningScreen()
    window.startDeck = new Deck()
    startDeck.new312Deck()
    startDeck.shuffle()
    window.playerCards = new Deck()
    window.dealerCards = new Deck()
}

/**
* Deals two cards to each player and dealer
*/
function dealCards() {
    addClickToPlayerButtons()
    playerCards.pushCard(startDeck.popCard())
    dealerCards.pushCard(startDeck.popCard())
    playerCards.pushCard(startDeck.popCard())
    dealerCards.pushCard(startDeck.popCard())
    printPlayerCards()
    printDealerCards(false)
    console.log(playerCards)
    console.log(dealerCards)
}

/**
* Does the turns for the dealer
*/
function dealerTurn() {
    var value = getSumOfValues(dealerCards)
    if(value > 21) {
        setTimeout(showWinningScreen(true), 3000)
    } else if(value < 17) {
        dealerCards.pushCard(startDeck.popCard())
        setTimeout(() => {
            printDealerCards(true)
            dealerTurn()
        }, 3000)
    } else {
        if(getSumOfValues(playerCards) > value) {
            setTimeout(showWinningScreen(true), 3000)
        } else {
            setTimeout(showWinningScreen(false), 3000)
        }
    }
}

/**
* Evaluates the sum of all cards in the deck
* @param {Deck} deck deck which is to be calculated
*/
function getSumOfValues(deck) {
    var value = deck.cards.reduce((rv, v) => rv + VALUE_MAP[v.value], 0)
    for(var i in deck.cards){
        if(value > 21 && deck.cards[i].value == "a"){
            value -= 10
        }
    }
    return value
}

/**
* Checks if sum of cards from playerDeck is less than, greater than or equal 21 and run the
* appropriate methode
*/
function checkPlayerSum() {
    var value = getSumOfValues(playerCards)
    if(value > 21) {
        showWinningScreen(false)
    } else if(value < 21) {
        addClickToPlayerButtons()
    } else {
        setTimeout(printDealerCards(true), 3000)
        dealerTurn()
    }
}

/**
 * Shows winningScreen for the game
 * @param {boolean} playerWon true if player won, false if enemy won
 */
 function showWinningScreen(playerWon) {
    if(playerWon){
      $(`#winningScreen`).text("Bravo! You won the Game!").show()
    } else {
      $(`#winningScreen`).text(`Dealer has won the Game`).show()
    }
}

/**
* Hide winningScreen for the game
*/
function hideWinningScreen() {
    $(`#winningScreen`).hide()
    addClickToDealButton()
  }

/**
* Prints all player cards to the site
*/
function printPlayerCards() {
    $(`#player img`).remove()
    for(var index in playerCards.cards){
        var suit = playerCards.cards[index].suit
        var value = playerCards.cards[index].value
        $(`#player`).append(`<img id="${value + suit}" class="card" src="PNG-cards/${value + suit}.png">`)
    }
    $(`#player`).attr(`style`, `--gridColumns:${playerCards.cards.length};`)
}

/**
* Prints one or all dealerCards to the site.
@param {boolean} printAllCards true if all cards should be printed, false if only first card
*   should be printed
*/
function printDealerCards(printAllCards) {
    $(`#dealer img`).remove()
    if(printAllCards){
        for(var index in dealerCards.cards){
            var suit = dealerCards.cards[index].suit
            var value = dealerCards.cards[index].value
            $(`#dealer`).append(`<img id="${value + suit}" class="card" src="PNG-cards/${value + suit}.png">`)
        }
        $(`#dealer`).attr(`style`, `--gridColumns:${dealerCards.cards.length};`)
    } else {
        var suit = dealerCards.cards[0].suit
        var value = dealerCards.cards[0].value
        $(`#dealer`).append(`<img id="${value + suit}" class="card" src="PNG-cards/${value + suit}.png">`)
        $(`#dealer`).append(`<img class="card" src="PNG-cards/back.png">`)
        $(`#dealer`).attr(`style`, `--gridColumns:2;`)
    }
}

/**
* Adds clickEventListener to dealButton
*/
function addClickToDealButton() {
    $(`#dealCards`).prop(`disabled`, false)
    $(`#dealCards`).click(() => {
        removeClickToDealButton()
        dealCards()
    })
}

/**
* Removes clickEventListener from dealButton
*/
function removeClickToDealButton() {
    $(`#dealCards`).off(`click`)
    $(`#dealCards`).prop(`disabled`, true)
}

/**
* Adds clickEventListener to playerButtons #hit and #stand
*/
function addClickToPlayerButtons() {
    $(`#hit, #stand`).prop(`disabled`, false)
    $(`#hit`).click(() => {
        removeClickToPlayerButtons()
        playerCards.pushCard(startDeck.popCard())
        printPlayerCards()
        checkPlayerSum()
    })
    $(`#stand`).click(() => {
        removeClickToPlayerButtons()
        setTimeout(() => {
            printDealerCards(true)
            dealerTurn()
        }, 3000)
    })
}

/**
* Removes clickEventListener to playerButtons #hit and #stand
*/
function removeClickToPlayerButtons() {
    $(`#hit, #stand`).prop(`disabled`, true)
    $(`#hit , #stand`).off(`click`)
}

/**
* Starts game and hides winnigScreen onClick
*/
$(document).ready(() => {
    start()
    $(`#hit, #stand`).prop(`disabled`, true)
    $(`#winningScreen`).click(() => {
        start()
    })
})