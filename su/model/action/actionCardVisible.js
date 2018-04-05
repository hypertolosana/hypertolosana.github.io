
(function() {

    /**
     * @constructor
     */
    SU.ActionCardVisible= function()   {
        return this;
    };

    SU.ActionCardVisible.prototype= {

        card :  null,

        init : function(card)   {
            return this.setCard(card);
        },

        setCard : function(card)    {
            this.card= card;
            return this;
        },

        getCard : function()    {
            return this.card;
        },

        undo: function()    {
            this.card.setVisible( !this.card.isVisible() );
        },

        redo : function()   {
            this.card.setVisible( !this.card.isVisible() );
        }
    };
})();