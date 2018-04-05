
(function() {

    /**
     *
     * @extends {SU.Pile}
     * @constructor
     */
    SU.PileWaste= function()    {

        SU.PileWaste.superclass.constructor.call(this);
        this.type= SU.Pile.Type.WASTE;
        this.setName('Waste');

        this.dragCondition=
            new SU.ConditionCardPositionInPile().setType(
                SU.ConditionCardPositionInPile.Types.LAST_IN_PILE
            );

        return this;
    };

    SU.PileWaste.prototype= {

        addCards : function( cards )    {
            return SU.PileStock.superclass.addCards.call( this, cards.reverse() );
        },

        setReady : function( undoAction )   {

            var card;
            var i;

            for( i=0; i<this.getSize(); i++ )   {

                card= this.getCard(i);
                if ( !card.isVisible() )  {
                    card.setVisible(true);
                    undoAction.addAction(
                        new SU.ActionCardVisible().init( card )
                    )
                }
            }

            return this;
        }


    };

    extend( SU.PileWaste, SU.Pile );
})();