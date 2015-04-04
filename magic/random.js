// Randomizers

// These are just a simple set of tools useful for fast game prototyping

// Roll dices

function roll( faceNumber, diceNumber, startFrom ) {
	startFrom = startFrom || 0;
	diceNumber = diceNumber || 1;

	var total = 0;
	
	for( var i=0; i < diceNumber; i++ ) {
	    total += Math.floor(Math.random() * faceNumber) + startFrom; 
	}

	return total;
};

// Create a deck of cards
// cards is an array. cards[0] is the top of the deck, 
// cards[cards.length-1] is the bottom

function Deck( cards ) {
    this.cardsOriginal = cards;
    this.reset();
}

Deck.prototype.cards = [];
Deck.prototype.cardsOriginal = [];

// generates an array 0..cardNumber-1 to be substituted for the deck
// overwrites the deck defined in the constructot
// not very elegant, could be improved

Deck.prototype.generate = function( cardNumber ) {
    var deck = [];
    
    for( var i = 0; i<cardNumber; i++ ) {
	deck[i] = i;
    }
    
    this.cardsOriginal = deck;
    this.cards = deck;
};

// Pick card from deck, without changing anything

Deck.prototype.pick = function( pos ) {
    pos = pos || 0;
    if( pos > this.cards.length ) pos = this.cards.length;
    return this.cards[pos];
};

// Pick card and remove it from deck

Deck.prototype.take = function( pos ) {
    pos = pos || 0;
    if( pos > this.cards.length ) pos = this.cards.length;
    return this.cards.splice( pos, 1 )[0];
};

// Shuffle the deck

Deck.prototype.shuffle = function() {
    for( var i=0; i<this.cards.length; i++ ) { // TODO: how many iterations are necessary?
	var pos = roll( this.cards.length-1, 1, 1 );
	var temp = this.cards[pos];
	this.cards[pos] = this.cards[0];
	this.cards[0] = temp;
    }
};

// restore the original card configuration

Deck.prototype.reset = function() {
    this.cards = this.cardsOriginal.slice();
};
