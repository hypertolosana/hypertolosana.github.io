
(function() {

    SU.PileStock= function()    {
        SU.PileStock.superclass.constructor.call(this);
        this.type= SU.Pile.Type.STOCK;
        this.setName('Stock');
        return this;
    };

    SU.PileStock.prototype= {

        addCards : function( cards )    {
            return SU.PileStock.superclass.addCards.call( this, cards.reverse() );
        },

        initialize : function( numDecks, listener )   {
            for( var i=0; i<numDecks; i++ ) {
                new SU.Deck().getCards( this );
            }

            for( var i=0; i<this.getSize(); i++ )   {
                this.getCard(i).addListener(listener);
            }

            return this;
        },

        /**
         * Barajar las cartas
         */
        shuffle : function() {

            var i, c0, c1;

            for( var i=0; i<this.cards.length*5; i++ ) {
                c0= (Math.random()*this.cards.length)>>0;
                do {
                    c1= (Math.random()*this.cards.length)>>0;
                } while( c1===c0 );

                var tmp= this.cards[c0];
                this.cards[c0]= this.cards[c1];
                this.cards[c1]= tmp;
            }

            return this;
        },

        /**
         * Deal a given amount of cards to a pile at initialization time.
         *
         * @param pile
         * @param numCard
         */
        dealInit : function( pile, numCards )   {

            for( var i=0; i<numCards; i++ ) {
                pile.addCard( this.cards.shift() );
            }

            return this;
        },

        canDrag : function( card )  {
            return false;
        },

        canDrop : function( pile )  {
            return false;
        },

        setReady : function( undoAction )   {

            var card;
            var i;

            for( i=0; i<this.getSize(); i++ )   {

                card= this.getCard(i);
                if ( card.isVisible() )  {
                    card.setVisible(false);
                    undoAction.addAction(
                        new SU.ActionCardVisible().init( card )
                    )
                }
            }

            return this;
        }

    };

    extend( SU.PileStock, SU.Pile );
})();