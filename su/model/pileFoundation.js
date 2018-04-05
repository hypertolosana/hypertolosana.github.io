
(function() {

    SU.PileFoundation= function()   {
        SU.PileFoundation.superclass.constructor.call(this);
        this.type= SU.Pile.Type.FOUNDATION;
        return this;
    };

    SU.PileFoundation.prototype=    {

        addCard : function( card ) {
            SU.PileFoundation.superclass.addCard.call(this, card);
            card.setVisitedFoundation(true);
            return this;
        },

        addCards : function( cards )    {
            SU.PileFoundation.superclass.addCards.call( this, cards );
            for( var i=0; i<cards.length; i++ ) {
                cards[i].setVisitedFoundation(true);
            }
            return this;
        }
    };

    extend( SU.PileFoundation, SU.Pile );
})();