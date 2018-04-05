
(function() {

    /**
     * @constructor
     */
    SU.Deck= function() {

        var i,j;

        this.cards= [];

        for( i=0; i<SU.Suits.length; i++ ) {
            for( j=1; j<14; j++ ) {
                this.cards.push( new SU.Card(j,SU.Suits[i]) );
            }
        }
        
        return this;
    };

    SU.Deck.prototype= {

        cards:  null,

        getCards : function( pileStock )   {
            for( var i=0; i<this.cards.length; i++ )    {
                pileStock.addCard( this.cards[i] );
            }
        }
    };
})();