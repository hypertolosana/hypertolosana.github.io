
(function() {

    /**
     * @constructor
     */
    SU.ActionTransfer= function(model)   {
        this.model= model;
        return this;
    };

    SU.ActionTransfer.prototype=    {

        fromPile:   null,
        toPile:     null,
        cards:      null,

        status:     null,

        model:      null,

        setStatus : function( status )  {
            this.status= status;
            return this;
        },

        getStatus : function( ) {
            return this.status;
        },

        undo : function()   {
            this.model.transfer.startTransfer( this.cards[0] );
            this.model.transferCards( this.fromPile, true );
        },

        redo : function()   {
            this.model.transfer.startTransfer( this.cards[0] );
            this.model.transferCards( this.toPile, true );
        },

        setSourcePile : function(pile)  {
            this.fromPile= pile;
            return this;
        },

        setDestinationPile : function(pile) {
            this.toPile= pile;
            return this;
        },

        setTransferredCards : function( cards ) {
            this.cards= cards;
            return this;
        },

        init : function( sp, dp, cards )    {
            this.fromPile=  sp;
            this.toPile=    dp;
            this.cards=     cards;
            return this;
        }
    };
})();