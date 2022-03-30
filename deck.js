const SUITS = ["s", "c", "h", "d"]
const VALUES = ["a", "2", "3", "4", "5", "6", "7", "8", "9", "10", "j", "q", "k"]

class Deck {
    constructor() {  
        this.cards = new Array();
    }

    get numberOfCards() {
        return this.cards.length
    }

    /**
     * Shuffles the deck
     */
    shuffle() {
        for (let i = this.numberOfCards - 1; i > 0; i--) {
            const newIndex = Math.floor(Math.random() * (i + 1))
            const oldValue = this.cards[newIndex]
            this.cards[newIndex] = this.cards[i]
            this.cards[i] = oldValue
          }
    }

    /**
     * removes the first card
     * @returns {Card} removed card
     */
    shiftCard(){
        return this.cards.shift()
    }

    /**
     * adds the card before all other cards
     */
    unshiftCard(card){
        this.cards.unshift(card)
    }


    /**
     * Addes the card to the deck
     * @param  {Card} card Card to add to the deck
     */
     pushCard(card){
        this.cards.push(card)
    }

    /**
     * adds the card last
     * @param {Card} card card to add
     */
    pushCards(cards){
        this.cards.push.apply(this.cards, cards)
    }

    /**
     * removes the last card
     * @param {Card} card card to remove
     * @return {Card} removed card
     */
    removeCard(card){
        return this.cards.splice(this.cards.findIndex(x => 
            (x.suit == card.suit && x.value == card.value)), 1)
    }

    /**
     * determine the most occuring suit
     * @returns the suit that occures most
     */
    getMostOccuringSuit(){
        var array = this.cards
        var map = array.map(function(a) {
            return array.filter(function(b) {
                return a.suit === b.suit;
            }).length;
        });
    
        return this.cards[map.indexOf(Math.max.apply(null, map))].suit;
    }

    /**
     * creates a new Deck with every card once
     */
    newDeck() {
        this.cards = SUITS.flatMap(suit => {
            return VALUES.map(value => {
                return new Card(suit, value)
            })
        })
    }
    
}

class Card {
    constructor(suit, value){
        this.suit = suit
        this.value = value
    }
    /**
     * Getter for the full name of the suit
     * @return {String} full name of the suit
     */
    getSuitString() {
        switch(this.suit){
            case "h": return" of Hearts"
            case "d": return " of Diamonds"
            case "c": return " of Clubs"
            case "s": return " of Spades"
        }
    }

    /**
     * Getter for the full name of the value
     * @return {String} full name of the value
     */
    getValueString() {
        if(isNaN(this.value)){
            switch(this.value){
                case "j": return "Jack"
                case "q": return "Queen"
                case "k": return "King"
                case "a": return "Ace"
            }
        } else {
            return this.value
        }
    }
}

export { Deck, Card}