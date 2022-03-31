import {Deck, Card} from "./deck.js"        

    /**
     * Initiates the global Variables
     */
    function init() {
        window.playerDeck = new Deck()
        window.computer1Deck = new Deck()
        window.computer2Deck = new Deck()
        window.computer3Deck = new Deck()
        window.computer4Deck = new Deck()
        window.computer5Deck = new Deck()
        window.discardDeck = new Deck()
        window.specialCardValue = 0
        window.cardsToDraw = 0
        window.suitFromJack = ""
        window.timeouts = []
    }

    /**
     * Starts the round by shuffle the deck and deals the starting cards to 
     * the players. Then prints all information to the HTML-site and starts
     * the clickEventListener 
     * @param  {Number} numberOfPlayers Number of Players
     * @param  {Number} numberOfStartingCards Number of Starting Cards
     * @param {Deck}    startDeck The Deck to play with
     */
    function start(numberOfPlayers, numberOfStartingCards, startDeck){
        init()
        window.numberOfPlayers = numberOfPlayers
        window.drawDeck = startDeck;
        window.oldDeck = startDeck
        drawDeck.shuffle()
        for(var i = 0; i < numberOfStartingCards; i++){
            switch (numberOfPlayers) {
                case 6:  drawCard(5)
                case 5:  drawCard(4)
                case 4:  drawCard(3)
                case 3:  drawCard(2)
                case 2:  drawCard(1)
                drawCard()
            }
        }
        discardDeck.pushCard(drawDeck.shiftCard())
        switch (numberOfPlayers) {
            case 6:  $(`#computer5 .circle`).text(computer5Deck.numberOfCards)
            case 5:  $(`#computer4 .circle`).text(computer4Deck.numberOfCards)
            case 4:  $(`#computer3 .circle`).text(computer3Deck.numberOfCards)
            case 3:  $(`#computer2 .circle`).text(computer2Deck.numberOfCards)
            case 2:  $(`#computer1 .circle`).text(computer1Deck.numberOfCards)
            $(`#drawDeck .circle`).text(drawDeck.numberOfCards)
        }
        printDiscardDeck();
        printPlayerDeck();

        window.startPlayer = Math.floor(Math.random() * numberOfPlayers)
        
        if(startPlayer == 0){
            addClickForPlayerTurn()
        } else {
            doComputerTurns(startPlayer)
        }
    }

    
    /**
     * Gives the right deck for the computer number
     * @param  {Number} computerNumber Number of the Computer
     * @returns {Deck}    Deck which matches the computerNumber
     */
    function getComputerDeck(computerNumber) {
        var varname = "computer"+ computerNumber +  "Deck"
        return window[varname];
    }

    /**
     * Draws for the given computer. If no computer is handed over
     * draws for the player
     * @param  {Number} computerNumber Number of the Computer.
     */
    function drawCard(computerNumber) {
        if(computerNumber == null){
            playerDeck.pushCard(drawDeck.shiftCard())
        } else{
            getComputerDeck(computerNumber).pushCard(drawDeck.shiftCard())
        }
        printDrawDeck()
        if(drawDeck.cards.length == 0){
            shuffleDiscardDeck()
        }
        
    }

     /**
     * Shuffles the discardDeck into the drawDeck
     */
    function shuffleDiscardDeck(){
        var cards = discardDeck.cards.splice(1, discardDeck.cards.length - 1)
        drawDeck.pushCards(cards)
        drawDeck.shuffle();
        printDrawDeck()
    }

     /**
     * Checks if card is playable and calls playPlayerCard if is
     * @param  {Card} card card to check if playable
     * @returns {boolean} true if card is played, otherwise false
     */
    function playersTurn(card) {
        if(specialCardValue == 7){
            if(card.value == 7){
                cardsToDraw += 2
                return playPlayerCard(card)
            } else {
                $(`drawDeck img`) //toDo draw deck red
            }
        } else if(checkCardPlayable(card)) {
            if(card.value == 7){
                cardsToDraw +=2
            }
            return playPlayerCard(card)
        }
            //toDo print error 
            return false
    }

    /**
     * Plays the given card and prints the affected. Checks if player
     * has won
     * @param  {Card} card card to play
     * @returns {boolean} true if card is played, otherwise false
     */
    function playPlayerCard(card) {
        if(card.value != "j") {
            suitFromJack = ""
        }
        var removedCard = playerDeck.removeCard(card)
        specialCardValue = removedCard[0].value
        discardDeck.unshiftCard(removedCard[0])
        printDiscardDeck()
        printPlayerDeck()
        if(playerDeck.cards.length == 0){
            showWinningScreen(0)
            showOptions();
            return false
        }
        return true
    }

    /**
     * Does all turns for the computers starting with startNumber
     */
    function doComputerTurns(startNumber) {
        for(var i = startNumber; i < numberOfPlayers; i++){ 
            timeouts.push(setTimeout(showActivePlayer,3000*(i-startNumber),i))
            timeouts.push(setTimeout(computersTurn, 3000 * (i+1-startNumber), i))
        } 
        timeouts.push(setTimeout(() => {
            if (specialCardValue == 8){
                specialCardValue = 0
                doComputerTurns(1)
            } else {
                addClickForPlayerTurn()
            }
            
        }, 3000 * (numberOfPlayers - startNumber))
        )
       
    }

    /**
     * Checks if computer has a card which is playable and calls 
     * playComputerCard if is. otherwise draws a card
     * @param  {Number} computerNumber Number of the Computer.
     * @returns {boolean} true if turn is over
     */
    function computersTurn(computerNumber) {
        if(specialCardValue == 8) {
            specialCardValue = 0
            return
        }
        for(var index in getComputerDeck(computerNumber).cards){
            var card = getComputerDeck(computerNumber).cards[index]
            if (specialCardValue == 7){
                if(getComputerDeck(computerNumber).cards[index].value == 7){     
                    cardsToDraw +=2
                    playComputerCard(computerNumber, card)
                    return
                }
            } else {
                if(checkCardPlayable(card)){ 
                    if(card.value == 7){
                        cardsToDraw +=2
                    }
                    playComputerCard(computerNumber, card)
                    return
                }
            }
        }
        if(cardsToDraw > 0){
            for(var i = 0; i < cardsToDraw; i++){
                drawCard(computerNumber)
            }
            printNumberOfCards(computerNumber)
            cardsToDraw = 0
            specialCardValue = 0
            return
        }
        drawCard(computerNumber)
        printNumberOfCards(computerNumber)
    }

    /**
     * Plays the given card. When computer has won clears all timeouts
     * @param  {Number} computerNumber number of the Computer.
     * @param  {Card} card card to play
     */
    function playComputerCard(computerNumber, card) {
        if(card.value == "j"){
            suitFromJack = getComputerDeck(computerNumber).getMostOccuringSuit()
        } else {
            suitFromJack = ""
        }
        var removedCard = getComputerDeck(computerNumber).removeCard(card)
        specialCardValue = removedCard[0].value
        discardDeck.unshiftCard(removedCard[0])
        printNumberOfCards(computerNumber)
        printDiscardDeck()
        if(getComputerDeck(computerNumber).cards.length  == 0){
            for(var i = 0; i < timeouts.length; i++) {
                clearTimeout(timeouts[i])
            }
            showWinningScreen(computerNumber)
            showOptions()
        }
    }

    /**
     * Checks if card matches value or suit of the last played card
     * @param  {Card} card card to play
     * @returns {boolean} true if card matches
     */
    function checkCardPlayable(card) {
        if(specialCardValue == "j"){
            return (card.suit  == suitFromJack ||
            card.value == discardDeck.cards[0].value) || card.value == "j"
        }
        return (card.suit  == discardDeck.cards[0].suit ||
        card.value == discardDeck.cards[0].value) || card.value == "j"
    }

     /**
     * Prints number of cards in drawdeck
     */
    function printDrawDeck() {
        $(`#drawDeck .circle`).text(drawDeck.numberOfCards)
    }

    /**
     * Prints the last played card
     */
    function printDiscardDeck() {
        $(`#discardDeck img`).remove()
        var disCard = discardDeck.cards[0]
        if(suitFromJack != "") {
            $(`#discardDeck`).append(`<img id="${disCard.value + suitFromJack}"`+
            `class="card" src="PNG-cards/${disCard.value + suitFromJack}.png">`)
        } else {
        $(`#discardDeck`).append(`<img id="${disCard.value + disCard.suit}"`+
            `class="card" src="PNG-cards/${disCard.value + disCard.suit}.png">`)
        }
    }

    /**
     * Print all cards of the player
     */
    function printPlayerDeck() {
        $(`#player img`).remove();
        for(var index in playerDeck.cards){
            var suit = playerDeck.cards[index].suit
            var value = playerDeck.cards[index].value
            $(`#player`).append(`<img id="${value + suit}" class="card" src="PNG-cards/${value + suit}.png">`)
        }
        $(`#player`).attr(`style`, `--gridColumns:${playerDeck.cards.length};`)
    }

    /**
     * Prints the number of cards of the given computer
     * @param  {Number} computerNumber number of the Computer.
     */
    function printNumberOfCards(computerNumber){
        $(`#computer${computerNumber}> .circle`).text(getComputerDeck(computerNumber).numberOfCards)
    }

    /**
     * Prints the active Player when he is on turn
     * @param  {Number} computerNumber number of the Computer.
     */
    function showActivePlayer(computerNumber) {
        $(`#computer${computerNumber} .card`).css({border : '5px solid yellow'})
        setTimeout(clearActivePlayer, 3000, computerNumber)
    }

    /**
     * Clears the active Player when his turn is over
     * @param  {Number} computerNumber number of the Computer.
     */
    function clearActivePlayer(computerNumber) {
        $(`#computer${computerNumber} .card`).css({border : '1px solid black'})
    }

    /**
     * Shows options for the game
     */
    function showOptions() {
        $(`.circle`).text("")
        $(`#discardDeck img`).remove()
        $(`#player img`).remove()
        $(`#options`).show()
        deck.new52Deck()
    }

    /**
     * Hide options for the game
     */
    function hideOptions() {
        $(`#options`).hide();
    }

    /**
     * Shows selectSuit for the game
     */
    function showSelectSuit() {
        $(`#selectSuit`).show();
    }

    /**
     * Hide selectSuit for the game
     */
    function hideSelectSuit() {
        $(`#selectSuit`).hide();
    }
    
     /**
     * Shows winningScreen for the game
     * @param {Number} winnerNumber number of winner, 0 if player has won
     */
      function showWinningScreen(winnerNumber) {
          if(winnerNumber == 0){
            $(`#winningScreen`).text("Bravo! You won the Game!").show();
          } else {
            $(`#winningScreen`).text(`Computer ${winnerNumber} won the Game`).show();
          }
    }

    /**
     * Hide winningScreen for the game
     */
    function hideWinningScreen() {
        $(`#winningScreen`).hide();
    }

    /**
     * Adds clickEventListener to player Cards and draw Deck if it is players turn
     */
     function addClickForPlayerTurn() {
        //clickEventListener for player cards. Calls doComputerTurns if players turn is over
        
        $(`#player img`).click((e) => {
            var cardId = e.currentTarget.id
            var card = new Card(cardId[cardId.length - 1], cardId.substring(0, cardId.length - 1))
            if(card.value == "j") {
                removeClickForPlayerTurn()
                showSelectSuit()
                addClickForSelectSuit(card)

            } else if(playersTurn(card)) {
                removeClickForPlayerTurn()
                doComputerTurns(1)
            }
        })
        //clickEventListener for drawDeck. Draws all cardsToDraw that the player must draw
        $(`#drawDeck img`).click((e) => {
            removeClickForPlayerTurn();
            if(specialCardValue == 7){
                while(cardsToDraw > 0){
                    drawCard()
                    cardsToDraw--
                }
            } else {
                drawCard()
            }
            specialCardValue = 0
            printPlayerDeck()
            doComputerTurns(1)
        })
    }

    /**
     * Removes the clickEventListener from player cards and drawDeck
     */
    function removeClickForPlayerTurn() {
        $(`#player img`).off(`click`)
        $(`#drawDeck img`).off(`click`)
    }

    /**
     * Adds the clickEventListener to selectSuit and plays the selected jack
     * @param {Card} card selected jack
     */
    function addClickForSelectSuit(card){
        $(`span`).click((e) => {
            var cardSuit = e.currentTarget.id
            suitFromJack = cardSuit
            playersTurn(card)
            removeClickForSelectSuit()
            hideSelectSuit()
            doComputerTurns(1)
        })
    }

    /**
     * Removes the clickEventListener from selectSuit
     */
    function removeClickForSelectSuit(){
        $(`selectSuit span`).off(`click`)
    }

/**
 * Adds all cards in deck to cardDeck selection amd adds logic to
 *  buttons addCard, removeCard and startGame when document is ready
 */
$(document).ready(() => {
    hideSelectSuit()
    hideWinningScreen()
    window.deck = new Deck()
    deck.new52Deck()
    var card 
    for(var index in deck.cards){
        card = deck.cards[index]
        $(`#cardDeck`).append(`<option value="${card.value + card.suit}">
        ${card.getValueString() + card.getSuitString()}</option>`)
    }

    //adds Card with addCardValue and addCardSuit selection to deck
    $(`#addCard`).click(() => {
        var cardValue = $(`#addCardValue option:selected`).val()
        var cardSuit = $(`#addCardSuit option:selected`).val()
        card = new Card(cardSuit, cardValue)
        deck.pushCard(card)
        $(`#cardDeck`).append(`<option value="${card.value + card.suit}">
            ${card.getValueString() + card.getSuitString()}</option>`)
    })

    //removes selected card from deck
    $(`#removeCard`).click(() => {
      var elem = $(`#cardDeck option:selected`).remove().val()
      var removedCard = new Card(elem[elem.length - 1], elem.substring(0, elem.length - 1))
      deck.removeCard(removedCard)
    })

    //starts game with selected numberOfPlayers, numberOfStartingCards and deck
    $(`#startGame`).click(() => {
        var player = parseInt($(`#numberOfPlayers option:selected`).val())
        var startCards = $(`#numberOfStartingCards`).val()
        if(deck.numberOfCards > player * startCards){
            hideOptions()
            start(player, startCards, deck)
        } else {
            $(`#error`).text("Not enought cards to start")
        }
    })
    $(`#winningScreen`).click(() => {
        hideWinningScreen()
    })
})