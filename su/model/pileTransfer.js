
(function()  {

    SU.PileTransfer= function() {
        SU.PileTransfer.superclass.constructor.call(this);
        this.type= SU.Pile.Type.TRANSFER;
        this.setName('Transfer');
        return this;
    };

    SU.PileTransfer.prototype=  {

        sourcePile:   null,

        setSourcePile : function( pile )    {
            this.sourcePile= pile;
            return this;
        },

        getSourcePile : function()  {
            return this.sourcePile;
        },

        undo : function()   {
            this.sourcePile.addCards( this.cards );
            this.cards= [];
        },

        /**
         *
         * @param undoAction {SU.Action}
         */
        setReady : function(undoAction)   {
            return this.sourcePile.setReady(undoAction);
        },

        startTransfer : function(card)  {
            this.setSourcePile( card.getPile() );
            this.addCards( card.extract() );
            return this;
        },

        startTransferDealInit : function(card) {
            this.setSourcePile( card.getPile() );
            this.addCards( card.extractDealInit() );
            return this;
        },

        extract : function()    {
            return SU.PileTransfer.superclass.extract.call(this, this.getSize());
        }
    };

    extend( SU.PileTransfer, SU.Pile );

})();