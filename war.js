import { Card, Deck } from "./deck.js";

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
    "j": 11,
    "q": 12,
    "k": 13,
    "a": 14
  }

/**
 * Starts the round by initializes and shuffles the deck and splits it up to the enemy and the player.
 *  Then prints all information to the HTML-site and adds the clickEventListener
 */
function start() {
    var deck = new Deck()
    deck.newDeck()
    deck.shuffle()
    window.playerDeck = new Deck()
    window.enemyDeck = new Deck()
    window.cardsInWar = []
    playerDeck.pushCards(deck.cards.slice(0, deck.numberOfCards/2))
    enemyDeck.pushCards(deck.cards.slice(deck.numberOfCards/2, deck.numberOfCards))
    printNumberOfCards()
    printCardsInWar()
    showRoundWon()
    addClickToPlayButton()
}

/**
 * Plays on card of each deck and compares who won
 */
function playCards(){
    showRoundWon()
    var playerCard = playerDeck.shiftCard()
    var enemyCard = enemyDeck.shiftCard()
    printCards(playerCard, enemyCard)
    printNumberOfCards()
    removeClickToPlayButton()
    setTimeout(() => {
        if(compareCards(playerCard, enemyCard)){
            cardsInWar.push(playerCard, enemyCard)
            playerDeck.pushCards(cardsInWar)
            cardsInWar = []
            showRoundWon("player")
        } else if(compareCards(enemyCard, playerCard)) {
            cardsInWar.push(playerCard, enemyCard)
            enemyDeck.pushCards(cardsInWar)
            cardsInWar = []
            showRoundWon("enemy")
        } else {
            cardsInWar.push(playerCard, enemyCard)
            for(let i = 0; i < 3; i++) {
                cardsInWar.push(playerDeck.shiftCard())
                cardsInWar.push(enemyDeck.shiftCard())
            }
            showRoundWon(0)
        }
        printCardsInWar()
        printNumberOfCards()
        if(playerDeck.numberOfCards == 0){
            showWinningScreen(false)
        } else if (enemyDeck.numberOfCards == 0) {
            showWinningScreen(true)
        } else {
            addClickToPlayButton()
        }
        clearCards()
    }, 3000)

}

/**
 * Compares the two card Values
 * @param {Card} firstCard
 * @param {Card} secondCard
 * @returns {boolean} firstCard > secondCard
 */
function compareCards(firstCard, secondCard) {
    return VALUE_MAP[firstCard.value] > VALUE_MAP[secondCard.value]
}

/**
 * Shows to play Button if player, enemy or nobody won
 * @param {String} roundWon player of player has won, enemy if enemy has won
 */
function showRoundWon(roundWon) {
    if(roundWon == "player"){
        $(`#play`).css({border : '5px solid green'})
    } else if(roundWon == "enemy") {
        $(`#play`).css({border : '5px solid red'})
    } else {
        $(`#play`).css({border : '5px solid #242582'})
    }
}

/**
 * Shows winningScreen for the game
 * @param {boolean} playerWon true if player won, false if enemy won
 */
 function showWinningScreen(playerWon) {
    if(playerWon){
      $(`#winningScreen`).text("Bravo! You won the Game!").show();
    } else {
      $(`#winningScreen`).text(`Computer has won the Game`).show();
    }
}

/**
* Hide winningScreen for the game
*/
function hideWinningScreen() {
  $(`#winningScreen`).hide();
}

/**
* Prints the number of cards in player and enemy deck
*/
function printNumberOfCards() {
    $(`#playerDeck > .circle`).text(playerDeck.numberOfCards)
    $(`#enemyDeck > .circle`).text(enemyDeck.numberOfCards)
}

/**
* Prints the two cards to the player and enemy dicard
*/
function printCards(playerCard, enemyCard){
    $(`#playerDiscard img`).remove()
    $(`#playerDiscard`).append(`<img id="${playerCard.value+ playerCard.suit}"`+
            `class="card" src="PNG-cards/${playerCard.value + playerCard.suit}.png">`)
            
    $(`#enemyDiscard img`).remove()
    $(`#enemyDiscard`).append(`<img id="${enemyCard.value+ enemyCard.suit}"`+
        `class="card" src="PNG-cards/${enemyCard.value + enemyCard.suit}.png">`)
}

/**
* Prints number of cards in war
*/
function printCardsInWar() {
    $(`#cardsInWar .circle`).text(cardsInWar.length)
}

/**
* Clears player and enemy card
*/
function clearCards() {
    $(`#playerDiscard img`).remove()
    $(`#playerDiscard`).append(`<img class="card discard" src="PNG-cards/back.png">`)
            
    $(`#enemyDiscard img`).remove()
    $(`#enemyDiscard`).append(`<img class="card discard" src="PNG-cards/back.png">`)
}

/**
* Adds clickEventListener to play button
*/
function addClickToPlayButton() {
    $(`#play`).click(() => {
        playCards()
    })
}

/**
* Removes clickEventListener from play button
*/
function removeClickToPlayButton() {
    $(`#play`).off()
}

/**
* Starts game and hides winnigScreen onClick
*/
$(document).ready(() => {
    hideWinningScreen()
    printCardsInWar()  
    start()
    $(`#winningScreen`).click(() => {
        hideWinningScreen()
        start()
    })
})