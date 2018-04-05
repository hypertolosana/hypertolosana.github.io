
(function() {

    /**
     * @constructor
     */
    SU.PileTableau= function()  {
        SU.PileTableau.superclass.constructor.call(this);
        this.type= SU.Pile.Type.TABLEAU;
        return this;
    };

    SU.PileTableau.prototype=   {
        cardsOnStart:   0,

        setCardsOnStart : function( n )  {
            this.cardsOnStart= n;
            return this;
        },

        getCardsOnStart : function()    {
            return this.cardsOnStart;
        },

        /**
         *
         * @param undoAction {null|SU.Action} can be null when performing dealInit.
         */
        setReady : function( undoAction )   {

            var card;

            if ( this.getSize() )   {
                card= this.getLastCard();
                if ( !card.isVisible() )  {
                    card.setVisible(true);
                    if ( undoAction )   {
                        undoAction.addAction(
                            new SU.ActionCardVisible().init( card )
                        )
                    }
                }
            }

            return this;
        }

    };

    extend( SU.PileTableau, SU.Pile );

})();